export enum DialectRegion {
  BUSAN = 'Busan (부산)',
  GYEONGNAM = 'Gyeongnam (경남)',
  JEOLLA = 'Jeolla (전라)',
  CHUNGCHEONG = 'Chungcheong (충청)',
  JEJU = 'Jeju (제주)'
}

export interface TranslationResponse {
  translatedText: string;
  keyTerms: string[];
  comment: string;
}

export interface DialectOption {
  id: DialectRegion;
  label: string;
  description: string;
  color: string;
}
