// 우리말샘 오픈 API에서 추출한 실제 표준어-방언 대역 예시 (data/dialect-glossary.json 참고).
// geminiService.ts 프롬프트의 few-shot 예시로 사용된다.
// 재생성: npm run fetch-dialect-data 실행 후 이 목록을 다시 골라 채운다.

import { DialectRegion } from '../types';

export interface DialectExample {
  standardWord: string;
  dialectWord: string;
}

export const DIALECT_EXAMPLES: Record<DialectRegion, DialectExample[]> = {
  [DialectRegion.BUSAN]: [
    { standardWord: '미안하다', dialectWord: '미안타' },
    { standardWord: '어머니', dialectWord: '니미' },
    { standardWord: '아버지', dialectWord: '아바' },
    { standardWord: '할머니', dialectWord: '할마니' },
    { standardWord: '부엌', dialectWord: '부섴' },
    { standardWord: '배고프다', dialectWord: '배고푸다' },
    { standardWord: '예쁘다', dialectWord: '새첩다' },
    { standardWord: '덥다', dialectWord: '떱다' },
  ],
  [DialectRegion.GYEONGNAM]: [
    { standardWord: '미안하다', dialectWord: '미안타' },
    { standardWord: '어머니', dialectWord: '니미' },
    { standardWord: '아버지', dialectWord: '아바' },
    { standardWord: '할머니', dialectWord: '할마니' },
    { standardWord: '부엌', dialectWord: '부섴' },
    { standardWord: '배고프다', dialectWord: '배고푸다' },
    { standardWord: '예쁘다', dialectWord: '새첩다' },
    { standardWord: '덥다', dialectWord: '떱다' },
  ],
  [DialectRegion.JEOLLA]: [
    { standardWord: '어머니', dialectWord: '어매' },
    { standardWord: '아버지', dialectWord: '아부씨' },
    { standardWord: '할머니', dialectWord: '할마니' },
    { standardWord: '아이', dialectWord: '아' },
    { standardWord: '밥', dialectWord: '뱁' },
    { standardWord: '김치', dialectWord: '지' },
    { standardWord: '부엌', dialectWord: '개맷부삭' },
    { standardWord: '힘들다', dialectWord: '써빠지다' },
  ],
  [DialectRegion.CHUNGCHEONG]: [
    { standardWord: '어머니', dialectWord: '어마이' },
    { standardWord: '아버지', dialectWord: '아부지' },
    { standardWord: '아이', dialectWord: '아' },
    { standardWord: '밥', dialectWord: '뱁' },
    { standardWord: '김치', dialectWord: '짐치' },
    { standardWord: '부엌', dialectWord: '부섴' },
    { standardWord: '예쁘다', dialectWord: '여쁘다' },
    { standardWord: '정말', dialectWord: '증말' },
  ],
  [DialectRegion.JEJU]: [
    { standardWord: '어머니', dialectWord: '어망' },
    { standardWord: '할머니', dialectWord: '할마니' },
    { standardWord: '김치', dialectWord: '김끼' },
    { standardWord: '국수', dialectWord: '국쉬' },
    { standardWord: '부엌', dialectWord: '정지' },
    { standardWord: '춥다', dialectWord: '얼다' },
    { standardWord: '먹다', dialectWord: '막다' },
    { standardWord: '웃다', dialectWord: '우시다' },
  ],
  [DialectRegion.GANGWON]: [
    { standardWord: '어머니', dialectWord: '어마이' },
    { standardWord: '아버지', dialectWord: '아버니' },
    { standardWord: '할머니', dialectWord: '할마시' },
    { standardWord: '김치', dialectWord: '짐치' },
    { standardWord: '국수', dialectWord: '국시' },
    { standardWord: '부엌', dialectWord: '벜' },
    { standardWord: '춥다', dialectWord: '칩다' },
    { standardWord: '덥다', dialectWord: '듭다' },
  ],
};
