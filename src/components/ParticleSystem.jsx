import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ParticleSystem = ({ x, y, active }) => {
    if (!active) return null;

    // Generate random particles
    const particles = Array.from({ length: 8 }).map((_, i) => ({
        angle: (i / 8) * 360,
        delay: Math.random() * 0.2,
        dist: 10 + Math.random() * 10
    }));

    return (
        <div
            className="absolute pointer-events-none z-20"
            style={{
                left: x * 50 + 25,
                top: y * 50 + 25,
                transform: 'translate(-50%, -50%)'
            }}
        >
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                        x: Math.cos(p.angle * Math.PI / 180) * p.dist,
                        y: Math.sin(p.angle * Math.PI / 180) * p.dist,
                        opacity: 0,
                        scale: 0
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: p.delay
                    }}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_cyan]"
                />
            ))}
            <div className="absolute w-4 h-4 bg-cyan-500 rounded-full blur-sm opacity-50 animate-pulse"></div>
        </div>
    );
};

export default ParticleSystem;
