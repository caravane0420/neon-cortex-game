import React from 'react';

const PageLayout = ({ title, children, onBack }) => (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-slate-300 w-full overflow-hidden">
        <div className="w-full max-w-5xl h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-10 border-b border-slate-800 pb-6 sticky top-0 bg-black/95 backdrop-blur z-10 pt-2">
                <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                    {title}
                </h2>
                <button
                    onClick={onBack}
                    className="px-6 py-2 bg-slate-900 border border-slate-700 text-neon-blue font-mono text-sm rounded hover:bg-neon-blue hover:text-black hover:border-neon-blue transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                >
                    [ 터미널로 복귀 ]
                </button>
            </div>

            {/* Content Content */}
            <div className="w-full space-y-8 font-body leading-relaxed text-lg max-w-4xl mx-auto pb-20">
                {children}
            </div>
        </div>
    </div>
);

export const About = ({ onBack }) => (
    <PageLayout title="프로토콜 정보 (ABOUT)" onBack={onBack}>
        <section className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-2 border-l-4 border-neon-pink pl-4 py-1">프로젝트 기원</h3>
            <p>
                <strong>네온 엔트로피 (Neon Entropy)</strong>는 1인 개발자가 제작한 실험적인 방치형 전략 시뮬레이션입니다.
                열역학 법칙과 사이버펑크 미학에서 영감을 받아, 붕괴하는 우주 속에서 영구 기관을 구축하려는 도전을 담았습니다.
            </p>
            <p>
                이 게임 엔진은 초당 수천 번의 상호작용을 시뮬레이션하여 열 확산, 에너지 생산, 그리고 엔트로피 축적을 실시간으로 계산합니다.
                단순히 건물을 많이 짓는 것이 능사가 아닙니다. "효율"만이 초월을 위한 유일한 열쇠입니다.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-2xl font-bold text-white mb-2 border-l-4 border-neon-blue pl-4 py-1">연락처 및 지원</h3>
            <p>
                오퍼레이터 커뮤니티의 피드백, 버그 제보, 제안을 환영합니다.
            </p>
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 font-mono text-sm">
                <p className="mb-2"><span className="text-slate-500">개발자:</span> Shin (Solo Dev)</p>
                <p className="mb-2"><span className="text-slate-500">이메일:</span> contact@neonentropy.com</p>
                <p><span className="text-slate-500">스튜디오:</span> Caravaggio Interactive Experiments</p>
            </div>
        </section>

        <p className="mt-12 text-sm text-slate-600 text-center">
            © 2026 Caravaggio AI. All Rights Reserved. <br />
            "엔트로피는 버그가 아닙니다; 이 우주의 기능입니다."
        </p>
    </PageLayout>
);

export const Guide = ({ onBack }) => (
    <PageLayout title="오퍼레이터 메뉴얼 v7.0" onBack={onBack}>
        {/* LORE INTRO */}
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg mb-8 italic text-slate-400">
            "서기 2142년. 네온 시티는 우주의 붕괴, 그 자체를 수확하며 연명하고 있습니다.
            엔트로피 드라이브의 설계자로서 당신의 임무는 단순합니다. 메쉬(Mesh)를 유지하십시오.
            충분한 에너지 크레딧을 생산하되, 시스템의 열 폭주(Heat)가 코어를 녹이지 않도록 주의하십시오."
        </div>

        <section className="space-y-4">
            <h3 className="text-2xl font-bold text-neon-yellow mb-4">1. 시너지 메쉬 시스템 (핵심 공략)</h3>
            <p>
                네온 엔트로피의 핵심 메커니즘은 <strong>시너지 메쉬(Synergy Mesh)</strong>입니다. 일반적인 타이쿤 게임과 달리,
                건물들은 독립적으로 작동하지 않고 인접한 건물에 영향을 미칩니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li><strong className="text-white">인접 효과 (Proximity):</strong> 발전기 옆에 냉각 팬을 배치하면 효율이 15% 증가하고 발열이 감소합니다.</li>
                <li><strong className="text-white">연쇄 반응 (Chain Reaction):</strong> 고성능 프로세서 두 개를 붙여 지으면 '공명 보너스'가 발동하여 출력이 2배가 되지만, 발열은 3배로 폭증합니다.</li>
                <li><strong className="text-white">데드 존 (Dead Zones):</strong> 일부 T4 이상의 장비는 최대 효율을 위해 주변 타일이 비어있어야('침묵' 상태) 합니다.</li>
            </ul>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-2xl font-bold text-neon-red mb-4">2. 열역학 및 발열 관리</h3>
            <p>
                발열(Heat)은 주적입니다. 적절한 냉각 솔루션 없이는 고티어 건물들이 <strong>열 포화 상태(Thermal Saturation)</strong>에 도달합니다.
                포화 상태가 되면 온도가 정상화될 때까지 생산이 완전히 중단됩니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-900 p-4 rounded border border-slate-700">
                    <h4 className="font-bold text-neon-blue mb-2">전략 A: 체크무늬 배치 (국룰)</h4>
                    <p className="text-sm">[발열체]와 [냉각기]를 체스판처럼 번갈아 배치하는 것이 가장 기초적이고 효율적인 전략입니다. 모든 발전기가 최소 2~3개의 냉각기와 접촉하게 하십시오.</p>
                </div>
                <div className="bg-slate-900 p-4 rounded border border-slate-700">
                    <h4 className="font-bold text-neon-blue mb-2">전략 B: 히트 싱크 올인</h4>
                    <p className="text-sm">'열 전도체(T3)'를 사용하여 중앙 클러스터의 열을 맵 외곽의 '싱크 존'으로 빼내고, 그곳에 대형 방열판을 집중시키는 고급 전략입니다.</p>
                </div>
            </div>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-2xl font-bold text-neon-purple mb-4">3. 테크 트리 및 티어 가이드</h3>
            <p>
                총 7단계의 기술 티어가 존재합니다.
            </p>
            <div className="space-y-4 mt-2">
                <div className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-800 flex items-center justify-center font-bold text-slate-500 border border-slate-600">T1-T2</div>
                    <div>
                        <h4 className="font-bold text-white">실리콘 시대 (The Silicon Era)</h4>
                        <p className="text-sm text-slate-400">기초적인 효율의 컴퓨팅입니다. 발열이 적고 수입이 안정적입니다. 모든 그리드의 기반이 됩니다.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-800 flex items-center justify-center font-bold text-slate-500 border border-slate-600">T3-T5</div>
                    <div>
                        <h4 className="font-bold text-white">양자 도약 (The Quantum Leap)</h4>
                        <p className="text-sm text-slate-400">큐비트와 초전도체가 도입됩니다. 생산량이 폭발적으로 늘어나지만, 시너지 메쉬를 적극적으로 관리해야 합니다.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-800 flex items-center justify-center font-bold text-slate-500 border border-slate-600">T7</div>
                    <div>
                        <h4 className="font-bold text-white">항성 공학 (Stellar Engineering)</h4>
                        <p className="text-sm text-slate-400">별의 힘을 이용합니다. 다이슨 노드는 무한에 가까운 에너지를 제공하지만 지역 현실(Entropy)을 붕괴시킵니다.</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-2xl font-bold text-white mb-4">4. 환생 시스템: 신경망 업로드</h3>
            <p>
                결국 물리 법칙이 성장을 제한하게 됩니다. 이것은 필연입니다. 발전이 정체되면(보통 T5 구간), <strong>신경망 업로드</strong>를 수행해야 합니다.
            </p>
            <p>
                업로드를 수행하면 물리적 공장(크레딧 및 건물)은 파괴되지만, 당신의 의식은 <strong>뉴로 포인트(NP)</strong>로 변환되어 영구적으로 보존됩니다.
            </p>
            <p className="bg-neon-purple/10 border-l-4 border-neon-purple p-4 italic">
                "초월은 잃는 것이 아니라, 정제하는 것입니다. 짓고, 최적화하고, 업로드하고, 반복하십시오."
            </p>
        </section>
    </PageLayout>
);

export const PrivacyPolicy = ({ onBack }) => (
    <PageLayout title="개인정보 처리방침" onBack={onBack}>
        <div className="text-slate-400 text-sm mb-4">시행일: 2026년 1월 6일</div>

        <section className="space-y-4">
            <h3 className="text-xl font-bold text-white">1. 개요</h3>
            <p>
                Caravaggio Interactive(이하 "회사")는 귀하의 개인정보를 중요하게 생각합니다. 본 개인정보 처리방침은 "Neon Entropy"(이하 "서비스") 이용 시 귀하의 정보를 수집, 이용, 보호하는 방법을 설명합니다.
            </p>
            <p>
                본 게임은 계정 생성을 요구하지 않습니다. 게임 진행 상황은 귀하의 기기에 로컬로 저장됩니다.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">2. 정보 수집 및 이용</h3>
            <h4 className="font-bold text-slate-300">로그 데이터</h4>
            <p>
                귀하가 서비스에 접속할 때, 당사의 서버는 브라우저가 전송하는 표준 데이터(로그 데이터)를 자동으로 기록할 수 있습니다. 이는 개인을 식별하지 않는 정보로, IP 주소, 브라우저 유형, 방문 페이지 등이 포함될 수 있습니다.
            </p>

            <h4 className="font-bold text-slate-300">쿠키 (Cookies)</h4>
            <p>
                당사는 사용자 경험을 개선하고 선호도를 이해하기 위해 "쿠키"를 사용합니다. 쿠키는 웹사이트가 귀하의 컴퓨터에 저장하는 작은 데이터 조각입니다.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">3. 광고 서비스</h3>
            <p>
                본 서비스는 광고 수익으로 운영됩니다. 당사는 광고 송출을 위해 <strong>Google AdSense</strong>와 같은 제3자 광고 파트너와 협력합니다.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Google을 포함한 제3자 벤더는 쿠키를 사용하여 사용자의 과거 방문 기록에 기반한 광고를 게재합니다.</li>
                <li>사용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-neon-blue underline">Google 광고 설정</a>에서 맞춤형 광고를 해제할 수 있습니다.</li>
            </ul>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">4. 데이터 저장</h3>
            <p>
                귀하의 게임 저장 데이터(크레딧, 인벤토리, 업그레이드 등)는 브라우저의 <strong>LocalStorage</strong> 및 <strong>IndexedDB</strong>에 전적으로 저장됩니다.
                당사는 이 데이터를 외부 서버로 전송하지 않습니다. 브라우저 캐시를 삭제하면 진행 상황이 유실될 수 있습니다.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">5. 아동의 개인정보</h3>
            <p>
                본 서비스는 만 13세 미만의 아동을 대상으로 하지 않으며, 아동의 개인정보를 고의로 수집하지 않습니다.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">6. 문의하기</h3>
            <p>
                개인정보 처리방침에 대해 궁금한 점이 있으시면 언제든지 문의해 주십시오: <span className="text-neon-blue">privacy@neonentropy.com</span>
            </p>
        </section>
    </PageLayout>
);

export const TermsOfService = ({ onBack }) => (
    <PageLayout title="이용 약관 (TERMS)" onBack={onBack}>
        <div className="text-slate-400 text-sm mb-4">최종 수정일: 2026년 1월 6일</div>

        <section className="space-y-4">
            <h3 className="text-xl font-bold text-white">1. 약관의 승인</h3>
            <p>
                Neon Entropy에 접속하거나 이용함으로써 귀하는 본 약관에 동의하게 됩니다. 약관의 일부라도 동의하지 않는 경우 서비스를 이용할 수 없습니다.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">2. 사용 권한</h3>
            <p>
                당사는 귀하에게 개인적이고 비상업적인 엔터테인먼트 목적으로 서비스를 이용할 수 있는 제한적이고, 비독점적이며, 양도 불가능한 라이선스를 부여합니다.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">3. 지적 재산권</h3>
            <p>
                서비스와 그 원본 콘텐츠, 기능은 Caravaggio Interactive 및 라이선스 제공자의 독점적 자산입니다. 본 서비스는 저작권법에 의해 보호받습니다.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">4. 면책 조항</h3>
            <p>
                본 서비스는 "있는 그대로", "이용 가능한 대로" 제공됩니다. 당사는 서비스가 중단되지 않거나, 안전하거나, 오류가 없음을 보장하지 않습니다.
            </p>
        </section>
    </PageLayout>
);
