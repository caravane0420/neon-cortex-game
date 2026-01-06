import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { GameCanvas } from './components/GameCanvas';
import { DuelUI } from './components/DuelUI';

// Connect to backend (Env var or default to local)
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
const socket = io(SERVER_URL);

interface Player {
    id: string;
    x: number;
    y: number;
    radius: number;
    color: string;
}

function App() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [orbs, setOrbs] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [duelData, setDuelData] = useState<{ opponent: string, word: string } | null>(null);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onState(gameState: any) {
            setPlayers(gameState.players);
            setOrbs(gameState.orbs || []);
        }

        function onDuelStart(data: { opponent: string, word: string }) {
            setDuelData(data);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('state', onState);
        socket.on('duel-start', onDuelStart);

        // Cleanup
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('state', onState);
            socket.off('duel-start', onDuelStart);
        };
    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <div className="absolute top-4 left-4 z-10 text-white font-mono pointer-events-none">
                <h1 className="text-2xl font-bold bg-black/50 p-2 rounded border border-neon-blue shadow-[0_0_10px_#00FFFF]">
                    NEON CORTEX
                </h1>
                <p className="text-sm bg-black/50 p-1 mt-2 rounded">
                    Status: {isConnected ? 'Connected' : 'Disconnected'}
                </p>
                <p className="text-sm bg-black/50 p-1 mt-1 rounded">
                    Players: {players.length}
                </p>
            </div>

            <DuelUI
                socket={socket}
                duelData={duelData}
                onClose={() => setDuelData(null)}
            />

            <GameCanvas socket={socket} players={players} orbs={orbs} />
        </div>
    );
}

export default App;
