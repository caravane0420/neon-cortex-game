import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Circle, Text, Group } from 'react-konva';
import { Socket } from 'socket.io-client';

interface Player {
    id: string;
    x: number;
    y: number;
    radius: number;
    color: string;
}

interface GameCanvasProps {
    socket: Socket;
    players: Player[];
    orbs: { x: number, y: number, color: string }[];
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ socket, players, orbs }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const stageRef = useRef<any>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const stage = stageRef.current;
            if (stage) {
                const pointer = stage.getPointerPosition();
                if (pointer) {
                    setMousePos(pointer);
                    socket.emit('input', { x: pointer.x, y: pointer.y });
                }
            }
        };

        // Konva handles events on stage, but we want global mouse if dragging? 
        // Actually, let's use stage onMouseMove.
    }, [socket]);

    const handleStageMouseMove = (e: any) => {
        const stage = e.target.getStage();
        const pointer = stage.getPointerPosition();
        if (pointer) {
            setMousePos(pointer);
            // Throttle this in real app
            socket.emit('input', { x: pointer.x, y: pointer.y });
        }
    };

    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseMove={handleStageMouseMove}
            ref={stageRef}
            style={{ background: '#050505' }}
        >
            <Layer>
                {/* Orbs */}
                {orbs.map((orb: { x: number, y: number, color: string }, i: number) => (
                    <Circle
                        key={i}
                        x={orb.x}
                        y={orb.y}
                        radius={5}
                        fill={orb.color}
                        shadowColor={orb.color}
                        shadowBlur={10}
                    />
                ))}

                {/* Players */}
                {players.map((player: Player) => (
                    <Group key={player.id} x={player.x} y={player.y}>
                        <Circle
                            radius={player.radius}
                            fill={player.color}
                            shadowColor={player.color}
                            shadowBlur={20}
                            shadowOpacity={0.8}
                        />
                        <Circle
                            radius={player.radius * 0.8}
                            fill="white"
                            opacity={0.3}
                        />
                        <Text
                            text={player.id.slice(0, 4)}
                            fontSize={12}
                            fill="white"
                            align="center"
                            offsetX={10}
                            offsetY={-30}
                        />
                    </Group>
                ))}
            </Layer>
        </Stage>
    );
};
