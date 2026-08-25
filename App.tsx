import React, { useState } from 'react';
import Header from './components/Header';
import DialectSelector from './components/DialectSelector';
import ResultCard from './components/ResultCard';
import Spinner from './components/Spinner';
import { DialectRegion, TranslationResponse } from './types';
import { translateToDialect } from './services/geminiService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedDialect, setSelectedDialect] = useState<DialectRegion>(DialectRegion.BUSAN);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await translateToDialect(inputText, selectedDialect);
      setResult(response);
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleTranslate();
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f8fafc]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-5xl">
        <div className="space-y-8">
          
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold">1</span>
              어느 지역 사투리로 바꿀까요?
            </h2>
            <DialectSelector 
              selected={selectedDialect} 
              onSelect={setSelectedDialect} 
              disabled={isLoading}
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Input Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold">2</span>
                서울말을 입력하세요
              </h2>
              
              <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all duration-300">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  placeholder="예: 오늘 날씨가 참 좋네요. 밥은 먹었어요?"
                  className="w-full h-64 p-4 text-lg bg-transparent border-none outline-none resize-none placeholder-gray-300 rounded-xl"
                  spellCheck="false"
                />
                <div className="px-4 pb-3 flex justify-between items-center border-t border-gray-50 pt-3">
                  <span className="text-xs text-gray-400">
                    {inputText.length}자 입력됨
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 hidden sm:inline">Command + Enter로 변환</span>
                    <button
                      onClick={handleTranslate}
                      disabled={!inputText.trim() || isLoading}
                      className={`
                        px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all duration-200 flex items-center gap-2
                        ${!inputText.trim() || isLoading
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'}
                      `}
                    >
                      {isLoading ? (
                        <>
                          <Spinner className="-ml-1 mr-2 h-4 w-4 text-white" />
                          변환 중...
                        </>
                      ) : (
                        <>
                          변환하기
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold">3</span>
                변환 결과
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                   {error}
                </div>
              )}

              {result ? (
                <ResultCard result={result} dialect={selectedDialect} />
              ) : (
                <div className="h-64 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                  <div className="bg-gray-100 p-4 rounded-full mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </div>
                  <p className="font-medium text-sm">입력하신 내용이 이곳에 변환되어 나타납니다</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Tips or Footer Info */}
          <section className="mt-12 pt-8 border-t border-gray-200">
             <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                   <h3 className="text-lg font-bold text-gray-800 mb-2">사투리 팁!</h3>
                   <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
                      각 지역 사투리는 억양과 어미가 핵심입니다. AI가 텍스트는 변환해주지만, 
                      실제 말맛을 살리려면 해당 지역의 억양(Intonation)을 함께 연습해보세요. 
                      부산/경남은 억양이 강하고, 전라는 구수하게 늘이며, 충청은 느긋하게 끝을 올리거나 내립니다.
                   </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-block bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-indigo-600 border border-indigo-100">
                     제주 방언은 정말 어려워요! 🗿
                  </span>
                </div>
             </div>
          </section>

        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Saturi Master. Powered by Google Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
