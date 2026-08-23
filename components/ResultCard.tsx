import React, { useState } from 'react';
import { TranslationResponse, DialectRegion } from '../types';
import { DIALECT_OPTIONS } from '../constants';
import { generateDialectSpeech } from '../services/geminiService';
import { playPcmAudio } from '../utils/audio';

interface ResultCardProps {
  result: TranslationResponse;
  dialect: DialectRegion;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, dialect }) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const dialectInfo = DIALECT_OPTIONS.find(d => d.id === dialect);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePlayAudio = async () => {
    if (isPlaying || isLoadingAudio) return;

    try {
      setIsLoadingAudio(true);
      const dialectLabel = dialectInfo?.label || 'Korean';
      // Request audio from Gemini
      const base64Audio = await generateDialectSpeech(result.translatedText, dialectLabel);
      
      setIsLoadingAudio(false);
      setIsPlaying(true);
      
      // Decode and play
      await playPcmAudio(base64Audio);
      
    } catch (error) {
      console.error(error);
      alert("음성을 재생할 수 없습니다.");
    } finally {
      setIsLoadingAudio(false);
      setIsPlaying(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
      <div className={`h-2 w-full ${dialectInfo?.color || 'bg-blue-500'}`} />
      
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${dialectInfo?.color || 'bg-gray-500'}`}>
              {dialectInfo?.label}
            </span>
            <span className="text-gray-400 text-sm">변환 결과</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Audio Button */}
            <button
              onClick={handlePlayAudio}
              disabled={isPlaying || isLoadingAudio}
              className={`
                flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors
                ${isPlaying 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'}
              `}
              title="사투리로 듣기"
            >
              {isLoadingAudio ? (
                <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-pulse">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 2.485.556 4.835 1.55 6.958.07.15.153.298.249.439.148.22.338.415.561.559.61.396 1.344.47 2.05.21 1.25-.457 2.292-1.42 2.943-2.61.16-.294.52-.407.803-.25.283.158.397.518.25.814-.808 1.636-2.223 2.937-3.957 3.518a2.956 2.956 0 01-1.896-.067c-.24-.092-.47-.215-.678-.363-.263-.187-.492-.42-.67-.68a11.237 11.237 0 01-1.41-3.66C.256 14.868 0 13.456 0 12c0-3.314 1.343-6.314 3.515-8.486.377-.377.785-.71 1.21-1.002.348-.24.787-.205 1.096.082L8.25 5.06l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v17.14c0 1.336-1.616 2.005-2.56 1.06l-2.206-2.207a.75.75 0 011.06-1.06l1.646 1.646V4.06z" />
                  <path d="M17.5 12a5.5 5.5 0 00-1.787-4.045.75.75 0 011.034-1.086A7 7 0 0120.5 12a7 7 0 01-3.753 6.131.75.75 0 01-.734-1.307A5.5 5.5 0 0017.5 12z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 2.485.556 4.835 1.55 6.958.07.15.153.298.249.439.148.22.338.415.561.559.61.396 1.344.47 2.05.21 1.25-.457 2.292-1.42 2.943-2.61.16-.294.52-.407.803-.25.283.158.397.518.25.814-.808 1.636-2.223 2.937-3.957 3.518a2.956 2.956 0 01-1.896-.067c-.24-.092-.47-.215-.678-.363-.263-.187-.492-.42-.67-.68a11.237 11.237 0 01-1.41-3.66C.256 14.868 0 13.456 0 12c0-3.314 1.343-6.314 3.515-8.486.377-.377.785-.71 1.21-1.002.348-.24.787-.205 1.096.082L8.25 5.06l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v17.14c0 1.336-1.616 2.005-2.56 1.06l-2.206-2.207a.75.75 0 011.06-1.06l1.646 1.646V4.06z" />
                  <path d="M20.808 5.61a.75.75 0 011.063.033 11.96 11.96 0 012.12 7.37c-.365 2.87-1.555 5.437-3.268 7.424a.75.75 0 01-1.168-.905A10.46 10.46 0 0022.49 12.5a10.46 10.46 0 00-1.714-6.857.75.75 0 01.033-1.063z" />
                  <path d="M17.5 12a5.5 5.5 0 00-1.787-4.045.75.75 0 011.034-1.086A7 7 0 0120.5 12a7 7 0 01-3.753 6.131.75.75 0 01-.734-1.307A5.5 5.5 0 0017.5 12z" />
                </svg>
              )}
              <span>{isPlaying ? '재생 중' : '듣기'}</span>
            </button>

            {/* Copy Button */}
            <button 
              onClick={handleCopy}
              className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium px-2 py-1.5"
              title="복사하기"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-600">복사됨</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  <span>복사</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed whitespace-pre-wrap">
            {result.translatedText}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              해설
            </h4>
            <p className="text-sm text-gray-700">
              {result.comment}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path d="M11.096 3.658a.75.75 0 01.596.012l7.25 3.5a.75.75 0 010 1.35l-7.25 3.5a.75.75 0 01-.73 0l-7.25-3.5a.75.75 0 010-1.35l7.25-3.5a.75.75 0 01.134-.012z" />
                <path d="M2.57 9.873a.75.75 0 01.65.266l6.28 7.327 6.28-7.327a.75.75 0 111.14.978l-6.85 7.992a.75.75 0 01-1.14 0l-6.85-7.992a.75.75 0 01.52-1.244z" />
              </svg>
              주요 어휘
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.keyTerms.map((term, idx) => (
                <span key={idx} className="bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium shadow-sm">
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
