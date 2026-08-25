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

## 방언 글로서리 수집 (선택)

우리말샘 오픈 API에서 표준어-방언 대역 데이터를 모아 `data/dialect-glossary.json`을 만듭니다. 번역 프롬프트 정확도를 높이는 few-shot 자료로 쓸 수 있습니다.

1. [우리말샘 오픈 API 신청](https://opendict.korean.go.kr/service/openApiRegister)에서 키 발급
2. `.env`에 `OPENDICT_API_KEY=발급받은키` 추가
3. 실행:

```bash
npm run fetch-dialect-data
```

## Cloudflare Pages 배포

```bash
npm run deploy
```

빌드 결과(`dist/`)를 Cloudflare Pages 프로젝트 `saturi-master`에 업로드합니다. Wrangler 로그인이 필요합니다 (`npx wrangler login`).

## 주의사항

이 앱은 클라이언트에서 직접 Gemini API를 호출하므로, 빌드된 결과물에 API 키가 포함됩니다. 개인 프로젝트/프로토타입 용도로만 사용하고, 공개 배포 시에는 백엔드 프록시를 통해 키를 감추는 것을 권장합니다.
