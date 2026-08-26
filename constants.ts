import { DialectRegion, DialectOption } from './types';

export const DIALECT_OPTIONS: DialectOption[] = [
  {
    id: DialectRegion.BUSAN,
    label: '부산 사투리',
    description: '강렬하고 억양이 뚜렷한 부산 특유의 말씨',
    color: 'bg-blue-500',
  },
  {
    id: DialectRegion.GYEONGNAM,
    label: '경남 사투리',
    description: '부산과 비슷하지만 조금 더 부드러운 경남권 방언',
    color: 'bg-indigo-500',
  },
  {
    id: DialectRegion.JEOLLA,
    label: '전라 사투리',
    description: '구수하고 정감 있는 전라도 특유의 어휘',
    color: 'bg-green-600',
  },
  {
    id: DialectRegion.CHUNGCHEONG,
    label: '충청 사투리',
    description: '느긋하고 여유로운 충청도 양반 스타일',
    color: 'bg-yellow-600',
  },
  {
    id: DialectRegion.JEJU,
    label: '제주 방언',
    description: '육지와는 확연히 다른 독창적인 제주어',
    color: 'bg-orange-500',
  },
  {
    id: DialectRegion.GANGWON,
    label: '강원 사투리',
    description: '억양이 강한 듯 순박한, 산골 특유의 강원도 말씨',
    color: 'bg-teal-500',
  },
];
