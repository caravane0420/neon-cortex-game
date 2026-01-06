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
                    [ RETURN TO TERMINAL ]
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
    <PageLayout title="ABOUT PROTOCOL" onBack={onBack}>
        <section className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-2 border-l-4 border-neon-pink pl-4 py-1">Project Origins</h3>
            <p>
                <strong>Neon Entropy</strong> is an experimental idle strategy game developed by a solo independent developer.
                Born from a fascination with thermodynamics and cyberpunk aesthetics, the simulation challenges players to build perpetual motion machines within a collapsing universe.
            </p>
            <p>
                The game engine simulates thousands of interactions per second, calculating heat diffusion, energy production, and entropy accumulation in real-time.
                Unlike standard idle games, "more" isn't always better—efficiency is the only path to transcendence.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-2xl font-bold text-white mb-2 border-l-4 border-neon-blue pl-4 py-1">Contact & Support</h3>
            <p>
                We appreciate feedback, bug reports, and suggestions from our operator community.
            </p>
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 font-mono text-sm">
                <p className="mb-2"><span className="text-slate-500">DEVELOPER:</span> Shin (Solo Dev)</p>
                <p className="mb-2"><span className="text-slate-500">EMAIL:</span> contact@neonentropy.com</p>
                <p><span className="text-slate-500">STUDIO:</span> Caravaggio Interactive Experiments</p>
            </div>
        </section>

        <p className="mt-12 text-sm text-slate-600 text-center">
            © 2026 Caravaggio AI. All Rights Reserved. <br />
            "Entropy is not a bug; it is a feature of the universe."
        </p>
    </PageLayout>
);

export const Guide = ({ onBack }) => (
    <PageLayout title="OPERATOR MANUAL: v7.0" onBack={onBack}>
        {/* LORE INTRO */}
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg mb-8 italic text-slate-400">
            "The year is 2142. The Neon City survives only by harvesting the decay of the universe itself.
            As an Architect of the Entropy Drive, your task is simple: maintain the Mesh.
            Produce adequate energy credits while keeping the system's thermal runaway—the 'Heat'—from melting the core."
        </div>

        <section className="space-y-4">
            <h3 className="text-2xl font-bold text-neon-yellow mb-4">1. The Synergy Mesh System</h3>
            <p>
                The core mechanic of Neon Entropy is the <strong>Synergy Mesh</strong>. Unlike traditional manufacturing where factories operate in isolation,
                every structure in Neon City affects its neighbors.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li><strong className="text-white">Proximity Effects:</strong> A Cooling Fan places next to a Generator increases its efficiency by 15% whilst reducing its Heat output.</li>
                <li><strong className="text-white">Chain Reactions:</strong> Placing two High-Frequency Processors adjacent to each other invokes a 'Resonance Bonus', doubling output but tripling Heat generation.</li>
                <li><strong className="text-white">Dead Zones:</strong> Some Tier 4+ machinery requires 'Silence' (empty tiles) around them to function at peak capacity.</li>
            </ul>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-2xl font-bold text-neon-red mb-4">2. Thermodynamics & Heat Management</h3>
            <p>
                Heat is the enemy. Without proper cooling solutions, high-tier buildings will reach <strong>Thermal Saturation</strong>.
                When saturated, production halts completely until the temperature normalizes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-900 p-4 rounded border border-slate-700">
                    <h4 className="font-bold text-neon-blue mb-2">Strategy A: The Checkerboard</h4>
                    <p className="text-sm">Ideally, alternate between [Heat Source] and [Cooling Unit] in a checkerboard pattern. This ensures every generator touches at least 2-3 cooling units.</p>
                </div>
                <div className="bg-slate-900 p-4 rounded border border-slate-700">
                    <h4 className="font-bold text-neon-blue mb-2">Strategy B: The Heat Sink</h4>
                    <p className="text-sm">Use 'Thermal Conductors' (T3) to pipe heat away from your core cluster into a dedicated 'Sink' zone at the edge of the map, filled with massive radiators.</p>
                </div>
            </div>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-2xl font-bold text-neon-purple mb-4">3. Progression & Tiers explained</h3>
            <p>
                There are 7 distinct technological tiers to unlock.
            </p>
            <div className="space-y-4 mt-2">
                <div className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-800 flex items-center justify-center font-bold text-slate-500 border border-slate-600">T1-T2</div>
                    <div>
                        <h4 className="font-bold text-white">The Silicon Era</h4>
                        <p className="text-sm text-slate-400">Basic efficient computing. Low heat, stable income. The foundation of any grid.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-800 flex items-center justify-center font-bold text-slate-500 border border-slate-600">T3-T5</div>
                    <div>
                        <h4 className="font-bold text-white">The Quantum Leap</h4>
                        <p className="text-sm text-slate-400">Introduces Qubits and Hyper-Cooling. Massive production spikes, but requires active management of the Synergy Mesh.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-800 flex items-center justify-center font-bold text-slate-500 border border-slate-600">T7</div>
                    <div>
                        <h4 className="font-bold text-white">Stellar Engineering</h4>
                        <p className="text-sm text-slate-400">Harnessing the power of stars. Dyson Nodes provide near-infinite energy but destabilize local reality (Entropy).</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-2xl font-bold text-white mb-4">4. The Prestige: Neural Upload</h3>
            <p>
                Eventually, physics will limit your growth. This is inevitable. When progress slows (usually around Tier 5), you must perform a <strong>Neural Upload</strong>.
            </p>
            <p>
                Uploading destroys your physical factories—resetting Credits and Buildings—but preserves your consciousness as <strong>Neuro-Points (NP)</strong>.
            </p>
            <p className="bg-neon-purple/10 border-l-4 border-neon-purple p-4 italic">
                "To Transcend is not to lose, but to refine. Build, Optimize, Upload, Repeat."
            </p>
        </section>
    </PageLayout>
);

export const PrivacyPolicy = ({ onBack }) => (
    <PageLayout title="PRIVACY POLICY" onBack={onBack}>
        <div className="text-slate-400 text-sm mb-4">Effective Date: January 6, 2026</div>

        <section className="space-y-4">
            <h3 className="text-xl font-bold text-white">1. Introduction</h3>
            <p>
                Caravaggio Interactive ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you access our game "Neon Entropy" (the "Service").
            </p>
            <p>
                We do not require you to create an account to play. Your game progress is stored locally on your device.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">2. Information Collection and Use</h3>
            <h4 className="font-bold text-slate-300">Log Data</h4>
            <p>
                When you visit our Service, our servers may automatically log the standard data provided by your web browser. This data is considered "non-identifying information", as it does not personally identify you on its own. It may include your computer’s Internet Protocol (IP) address, browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details.
            </p>

            <h4 className="font-bold text-slate-300">Cookie Policy</h4>
            <p>
                We use "cookies" to collect information about you and your activity across our site. A cookie is a small piece of data that our website stores on your computer, and accesses each time you visit, so we can understand how you use our site. This helps us serve you content based on preferences you have specified.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">3. Advertising</h3>
            <p>
                This Service is supported by advertising. We work with third-party advertising partners, specifically <strong>Google AdSense</strong>, to display ads.
            </p>
            <p>
                These third parties may use cookies and similar technologies to collect information about your activities on this Service and other websites to provide you with advertising based on your browsing activities and interests.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
                <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
                <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-neon-blue underline">Google Ads Settings</a>.</li>
            </ul>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">4. Data Storage</h3>
            <p>
                Your game save data (Credits, inventory, upgrades) is stored entirely in your browser's <strong>LocalStorage</strong> and <strong>IndexedDB</strong>.
                We do not transmit this save data to any external server. If you clear your browser cache, your progress may be lost.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">5. Children's Privacy</h3>
            <p>
                Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">6. Changes to This Policy</h3>
            <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">7. Contact Us</h3>
            <p>
                If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at: <span className="text-neon-blue">privacy@neonentropy.com</span>.
            </p>
        </section>
    </PageLayout>
);

export const TermsOfService = ({ onBack }) => (
    <PageLayout title="TERMS OF SERVICE" onBack={onBack}>
        <div className="text-slate-400 text-sm mb-4">Last Updated: January 6, 2026</div>

        <section className="space-y-4">
            <h3 className="text-xl font-bold text-white">1. Acceptance of Terms</h3>
            <p>
                By accessing or using Neon Entropy, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">2. License to Use</h3>
            <p>
                Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Service for your own personal, non-commercial entertainment purposes.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">3. Intellectual Property</h3>
            <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of Caravaggio Interactive and its licensors. The Service is protected by copyright in the United States and foreign countries.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">4. Termination</h3>
            <p>
                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
        </section>

        <section className="space-y-4 mt-8">
            <h3 className="text-xl font-bold text-white">5. Limit of Liability</h3>
            <p>
                To the fullest extent permitted by applicable law, in no event will Caravaggio Interactive, its affiliates, officers, directors, employees, agents, or licensors be liable to any person for any indirect, incidental, special, punitive, cover or consequential damages.
            </p>
            <p>
                The Service is provided "AS IS" and "AS AVAILABLE" basis. We do not warrant that the Service will be uninterrupted, secure, or free from errors.
            </p>
        </section>
    </PageLayout>
);
