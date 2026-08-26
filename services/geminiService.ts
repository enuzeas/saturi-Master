import { GoogleGenAI, Type } from "@google/genai";
import { DialectRegion, TranslationResponse } from "../types";
import { DIALECT_EXAMPLES } from "../data/dialectExamples";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from process.env");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

export const translateToDialect = async (
  text: string,
  targetDialect: DialectRegion
): Promise<TranslationResponse> => {
  try {
    const examples = DIALECT_EXAMPLES[targetDialect]
      .map((e) => `- ${e.standardWord} → ${e.dialectWord}`)
      .join("\n");

    const prompt = `
      Convert the following Standard Korean (Seoul dialect) text into natural, native-sounding ${targetDialect}.

      Reference vocabulary (real ${targetDialect} words, from the National Institute of Korean Language's open dictionary):
      ${examples}

      Input Text: "${text}"

      Requirements:
      1. The translation must strictly follow the grammatical and vocabulary nuances of ${targetDialect}.
      2. Prefer the reference vocabulary above where it naturally fits the input, but don't force it if it doesn't fit.
      3. If the input is formal, keep the output relatively formal but in dialect. If informal, keep it informal.
      4. Identify 1-3 key dialect words or phrases used in the translation.
      5. Provide a brief one-sentence comment explaining the vibe or specific grammar point used, written in Korean (한국어로 작성).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: {
              type: Type.STRING,
              description: "The translated text in the target dialect",
            },
            keyTerms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of key dialect words used",
            },
            comment: {
              type: Type.STRING,
              description: "A brief cultural or grammatical note about the translation",
            },
          },
          required: ["translatedText", "keyTerms", "comment"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI");
    }

    const parsedResult = JSON.parse(resultText) as TranslationResponse;
    return parsedResult;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("번역 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
};

export const generateDialectSpeech = async (
  text: string,
  dialectLabel: string
): Promise<string> => {
  try {
    // Explicitly prompt for the dialect accent/vibe
    const prompt = `Say the following text with a ${dialectLabel} accent: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        // Use string literal 'AUDIO' to avoid potential Enum import issues with some bundlers/environments
        responseModalities: ["AUDIO"], 
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore (Female)
          },
        },
      },
    });

    // Robust extraction: Iterate over parts to find the one with inlineData
    const parts = response.candidates?.[0]?.content?.parts || [];
    let audioData: string | undefined;

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        audioData = part.inlineData.data;
        break;
      }
    }

    if (!audioData) {
      console.error("Gemini TTS Response:", JSON.stringify(response, null, 2));
      throw new Error("No audio data found in response");
    }

    return audioData;
  } catch (error) {
    console.error("TTS error:", error);
    throw new Error("음성 생성 중 오류가 발생했습니다.");
  }
};
