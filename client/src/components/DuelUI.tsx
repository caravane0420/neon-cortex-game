import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface DuelUIProps {
    socket: Socket;
    duelData: { opponent: string, word: string } | null;
    onClose: () => void;
}

export const DuelUI: React.FC<DuelUIProps> = ({ socket, duelData, onClose }) => {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [result, setResult] = useState<'win' | 'lose' | null>(null);

    useEffect(() => {
        if (duelData) {
            setInput('');
            setResult(null);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [duelData]);

    useEffect(() => {
        const onDuelEnd = (data: { result: 'win' | 'lose', mass: number }) => {
            setResult(data.result);
            setTimeout(() => {
                onClose();
            }, 2000);
        };

        socket.on('duel-end', onDuelEnd);
        return () => {
            socket.off('duel-end', onDuelEnd);
        };
    }, [socket, onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);
        // Auto submit if match? Or wait for enter?
        // Let's send every change or check match locally to avoid spam?
        // Server checks match. Let's send on Enter or if length matches.
        // Actually, for "QuickType", real-time check or enter is fine.
        // Let's send if length >= word length
        if (duelData && val.length >= duelData.word.length) {
            socket.emit('duel-input', val);
        }
    };

    if (!duelData && !result) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
            <div className={`p-8 rounded-xl border-4 ${result === 'win' ? 'border-green-500' : result === 'lose' ? 'border-red-500' : 'border-neon-pink'} bg-black shadow-[0_0_50px_rgba(255,0,255,0.5)] text-center`}>
                {result ? (
                    <div className="text-4xl font-black text-white animate-bounce">
                        {result === 'win' ? 'VICTORY!' : 'DEFEAT!'}
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl text-neon-blue mb-4 font-bold tracking-widest">DUEL DETECTED</h2>
                        <div className="mb-6">
                            <p className="text-gray-400 text-sm">TYPE THE CODE:</p>
                            <p className="text-5xl font-mono text-white font-bold tracking-[0.5em] my-2 select-none">
                                {duelData?.word}
                            </p>
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={handleChange}
                            className="bg-gray-900 border-2 border-neon-blue rounded px-4 py-2 text-white text-center text-xl outline-none focus:shadow-[0_0_20px_#00FFFF]"
                            autoFocus
                        />
                    </>
                )}
            </div>
        </div>
    );
};
