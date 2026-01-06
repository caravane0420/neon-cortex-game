import React from 'react';

const PageLayout = ({ title, children, onBack }) => (
    <div className="flex flex-col items-center justify-start min-h-full p-8 text-slate-300 overflow-y-auto w-full max-w-4xl mx-auto">
        <div className="w-full flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
            <h2 className="text-3xl font-display font-bold text-neon-blue">{title}</h2>
            <button
                onClick={onBack}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded hover:border-neon-pink hover:text-neon-pink transition-all"
            >
                BACK TO GAME
            </button>
        </div>
        <div className="w-full space-y-6 font-body leading-relaxed">
            {children}
        </div>
    </div>
);

export const About = ({ onBack }) => (
    <PageLayout title="ABOUT NEON ENTROPY" onBack={onBack}>
        <p>
            <strong>Neon Entropy</strong> is a strategic idle tycoon game set in a cyberpunk dystopia.
            Your goal is to build an efficient manufacturing empire, managing heat, power, and entropy while scaling your operations to transcendence.
        </p>
        <h3 className="text-xl font-bold text-white mt-4">Features</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-400">
            <li><strong>Synergy Mesh System</strong>: Building placement matters. Manage heat and noise.</li>
            <li><strong>Offline Progression</strong>: Your factories run even when you are away.</li>
            <li><strong>Prestige</strong>: Upload your consciousness to restart with powerful neural upgrades.</li>
            <li><strong>Tech Tree</strong>: Over 500 unique technologies to research (T7 Update).</li>
        </ul>
        <p className="mt-8 text-sm text-slate-500">
            Version: 1.2.0 (T7 Expansion) <br />
            Developed by: <strong>Caravaggio AI Team</strong>
        </p>
    </PageLayout>
);

export const Guide = ({ onBack }) => (
    <PageLayout title="GAME GUIDE: OPERATOR MANUAL" onBack={onBack}>
        <div className="space-y-6">
            <section>
                <h3 className="text-lg font-bold text-neon-yellow mb-2">1. The Fundamentals</h3>
                <p>
                    <strong>Produce & Upload:</strong> Build processors to generate Credits. Optimize your layout to handle Heat.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-neon-yellow mb-2">2. Synergy Mesh</h3>
                <p>Buildings interact with their neighbors!</p>
                <ul className="list-disc list-inside text-slate-400 ml-2 mt-1">
                    <li><strong>Heat:</strong> Most machines generate Heat. If a tile gets too hot, efficiency drops.</li>
                    <li><strong>Cooling:</strong> Place <span className="text-neon-blue">Cooling Fans</span> or Pipelines adjacent to hot machines.</li>
                    <li><strong>Isolation:</strong> Some Tier 4+ machines require empty space (Noise reduction).</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-bold text-neon-yellow mb-2">3. Prestige & Transcendence</h3>
                <p>
                    When progress slows, perform a <strong>Neural Upload</strong>. You will reset your physical empire but gain <strong>Neuro-Points (NP)</strong>.
                    Spend NP on permanent upgrades to production, coherence, and offline efficiency.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-neon-yellow mb-2">4. Tips</h3>
                <ul className="list-disc list-inside text-slate-400 ml-2 mt-1">
                    <li>Use the <strong>Heatmap</strong> (Eye Icon) frequently to spot bottlenecks.</li>
                    <li><strong>Overclock</strong> gives a massive temporary boost. Use it before going offline!</li>
                    <li>Complete <strong>Objectives</strong> to earn fast starting capital.</li>
                </ul>
            </section>
        </div>
    </PageLayout>
);

export const PrivacyPolicy = ({ onBack }) => (
    <PageLayout title="PRIVACY POLICY" onBack={onBack}>
        <p>Last Updated: January 6, 2026</p>

        <h3 className="text-lg font-bold text-white">1. Data Collection</h3>
        <p>
            Neon Entropy stores game progress locally on your device using <strong>LocalStorage</strong> and <strong>IndexedDB</strong>.
            We do not collect personal identifiable information (PII) on our servers.
        </p>

        <h3 className="text-lg font-bold text-white">2. Cookies & Ads</h3>
        <p>
            We use third-party vendors, including Google, which use cookies to serve ads based on your prior visits to our website or other websites.
            Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.
        </p>
        <p>
            You may opt-out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-neon-blue underline" target="_blank">Google Ad Settings</a>.
        </p>
    </PageLayout>
);

export const TermsOfService = ({ onBack }) => (
    <PageLayout title="TERMS OF SERVICE" onBack={onBack}>
        <h3 className="text-lg font-bold text-white">1. Acceptance of Terms</h3>
        <p>By accessing and playing Neon Entropy, you agree to these Terms of Service.</p>

        <h3 className="text-lg font-bold text-white">2. License</h3>
        <p>
            We grant you a personal, non-exclusive, non-transferable license to play the game for personal, non-commercial use.
        </p>

        <h3 className="text-lg font-bold text-white">3. Disclaimers</h3>
        <p>
            The game is provided "as is" without warranties of any kind. We are not liable for any data loss (save files) due to browser cache clearing or device failure.
        </p>
    </PageLayout>
);
