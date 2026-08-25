# 사투리 마스터 (Saturi Master)

서울말(표준어)을 부산, 경남, 전라, 충청, 제주 사투리로 변환해주는 AI 번역기입니다. Google Gemini를 이용해 텍스트 변환과 사투리 억양 음성(TTS) 생성을 지원합니다.

## 기술 스택

- React 19 + TypeScript
- Vite
- Google Gemini API (`@google/genai`)
  - 텍스트 변환: `gemini-3-flash-preview`
  - 음성 생성: `gemini-2.5-flash-preview-tts`

## 시작하기

### 1. 설치

```bash
npm install
```

### 2. Gemini API 키 설정

[Google AI Studio](https://aistudio.google.com/apikey)에서 API 키를 발급받은 후, 프로젝트 루트에 `.env.local` 파일을 만들고 아래와 같이 입력합니다. (`.env.example` 참고)

```
GEMINI_API_KEY=your_api_key_here
```

`.env.local`은 `.gitignore`에 의해 git에 올라가지 않으니 키를 안전하게 보관하세요.

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 주의사항

이 앱은 클라이언트에서 직접 Gemini API를 호출하므로, 빌드된 결과물에 API 키가 포함됩니다. 개인 프로젝트/프로토타입 용도로만 사용하고, 공개 배포 시에는 백엔드 프록시를 통해 키를 감추는 것을 권장합니다.
