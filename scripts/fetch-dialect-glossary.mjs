// 우리말샘 오픈 API로 방언(지역어) 표제어를 모아 표준어-방언 글로서리를 만든다.
// API 키 발급: https://opendict.korean.go.kr/service/openApiRegister
// 실행: node --env-file=.env scripts/fetch-dialect-glossary.mjs

const API_KEY = process.env.OPENDICT_API_KEY;
const BASE_URL = 'https://opendict.korean.go.kr/api/search';

// 우리말샘엔 '부산' 지역 코드가 따로 없어 경남(3)으로 근사한다.
// (구성 참고: constants.ts의 DIALECT_OPTIONS와 동일한 키를 사용)
const REGIONS = {
  'Busan (부산)': 3,
  'Gyeongnam (경남)': 3,
  'Jeolla (전라)': 7,
  'Chungcheong (충청)': 12,
  'Jeju (제주)': 9,
};

// 검색 기준 표준어 씨앗 단어. 정의문에 이 단어가 포함된 지역어 표제어를 찾는다.
const SEED_WORDS = [
  '어머니', '아버지', '할아버지', '할머니', '아이', '친구',
  '밥', '국', '반찬', '김치', '고기', '국수', '떡', '부엌',
  '배고프다', '힘들다', '아프다', '피곤하다', '예쁘다', '춥다', '덥다',
  '가다', '오다', '먹다', '자다', '놀다', '일하다', '울다', '웃다',
  '정말', '너무', '조금', '많이',
  '집', '학교', '가방', '옷', '신발', '돈',
  '안녕', '고맙다', '미안하다',
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// "'실제표준어'의 방언" 패턴에서 정확한 표준어를 뽑아낸다.
// target=9(뜻풀이)+method=include 검색은 정의문에 씨앗 단어가 "포함"되기만 해도 걸리므로
// (예: "가다" 검색에 "날이 이지러지거나 떨어져 나가다"가 걸림), 이 패턴에 안 맞으면
// 실제로는 무관한 매칭일 가능성이 높아 씨앗 단어로 대체하지 않고 버린다.
function parseStandardWord(definition) {
  const match = definition.match(/^[‘']([^’']+)[’']의 방언/);
  return match ? match[1] : null;
}

// item(JSON) -> 표준어-방언 글로서리 엔트리 목록. 순수 함수라 --self-test로 검증 가능.
export function extractEntries(items) {
  const entries = [];
  for (const item of items ?? []) {
    for (const sense of item.sense ?? []) {
      if (sense.type !== '방언') continue;
      const standardWord = parseStandardWord(sense.definition);
      if (!standardWord) continue;
      entries.push({
        dialectWord: item.word,
        standardWord,
        definition: sense.definition,
      });
    }
  }
  return entries;
}

async function fetchDialectEntries(regionCode, standardWord) {
  const url = new URL(BASE_URL);
  url.searchParams.set('key', API_KEY);
  url.searchParams.set('q', standardWord);
  url.searchParams.set('req_type', 'json');
  url.searchParams.set('advanced', 'y');
  url.searchParams.set('target', '9'); // 뜻풀이에서 검색
  url.searchParams.set('method', 'include');
  url.searchParams.set('type3', 'dialect'); // 지역어(방언)만
  url.searchParams.set('region', String(regionCode));
  url.searchParams.set('num', '20');

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  const items = json.channel?.item ?? [];
  return extractEntries(items);
}

async function main() {
  if (!API_KEY) {
    console.error('OPENDICT_API_KEY가 없습니다. .env에 OPENDICT_API_KEY=발급받은키 를 추가하세요.');
    process.exit(1);
  }

  const glossary = {};
  const codeCache = {}; // regionCode -> entries (Busan/Gyeongnam처럼 같은 코드는 한 번만 조회)

  for (const [dialectRegionKey, regionCode] of Object.entries(REGIONS)) {
    if (codeCache[regionCode]) {
      glossary[dialectRegionKey] = codeCache[regionCode];
      console.log(`${dialectRegionKey}: region ${regionCode} 캐시 재사용 (${codeCache[regionCode].length}건)`);
      continue;
    }

    const seen = new Set();
    const collected = [];

    for (const word of SEED_WORDS) {
      try {
        const entries = await fetchDialectEntries(regionCode, word);
        for (const entry of entries) {
          const key = `${entry.dialectWord}:${entry.standardWord}`;
          if (!seen.has(key)) {
            seen.add(key);
            collected.push(entry);
          }
        }
      } catch (err) {
        console.error(`  [경고] "${word}" 검색 실패: ${err.message}`);
      }
      await sleep(150); // API에 과도한 요청 방지
    }

    codeCache[regionCode] = collected;
    glossary[dialectRegionKey] = collected;
    console.log(`${dialectRegionKey}: ${collected.length}건 수집`);
  }

  const { writeFile } = await import('node:fs/promises');
  const outPath = new URL('../data/dialect-glossary.json', import.meta.url);
  await writeFile(outPath, JSON.stringify(glossary, null, 2));

  console.log(`\n완료: ${outPath.pathname}`);
}

function selfTest() {
  const sample = [
    {
      word: '정지',
      sense: [
        { type: '방언', definition: "'부엌'의 방언" },
        { type: '일반어', definition: '다른 뜻풀이' },
      ],
    },
    {
      word: '가시-어멍',
      sense: [{ type: '방언', definition: '‘가시어머니’의 방언' }],
    },
    {
      // "가다" 검색에 정의문이 우연히 걸렸을 뿐 실제로는 무관한 항목 -> 버려야 함
      word: '베물리다',
      sense: [{ type: '방언', definition: '돌이나 쇠에 부딪혀 날의 일부가 이지러지거나 떨어져 나가다' }],
    },
  ];
  const result = extractEntries(sample);
  console.assert(result.length === 2, 'self-test 실패: 무관한 항목이 걸러지지 않음');
  console.assert(result[0].dialectWord === '정지', 'self-test 실패: dialectWord');
  console.assert(result[0].standardWord === '부엌', 'self-test 실패: standardWord(ascii quote)');
  console.assert(result[1].standardWord === '가시어머니', 'self-test 실패: standardWord(curly quote)');
  console.log('self-test 통과');
}

if (process.argv.includes('--self-test')) {
  selfTest();
} else {
  main();
}
