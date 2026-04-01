'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Zap, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function Visualizer() {
  return (
    <div className="my-16 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.1)_0%,transparent_70%)] opacity-50" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Human Side */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400">
            <User size={32} />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-tighter">
              The Architect
            </h4>
            <p className="text-[10px] text-zinc-400 normal-case italic">
              Sets Goals & Constraints
            </p>
          </div>
        </motion.div>

        {/* The Connection */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ x: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Zap size={20} className="text-cyber-purple" />
            </motion.div>
            <div className="h-px w-12 bg-gradient-to-r from-indigo-500 to-cyber-purple" />
            <div className="p-2 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20">
              <Cpu size={24} className="text-cyber-purple" />
            </div>
            <div className="h-px w-12 bg-gradient-to-r from-cyber-purple to-cyber-green" />
            <motion.div
              animate={{ x: [0, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight size={20} className="text-cyber-green" />
            </motion.div>
          </div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] animate-pulse">
            Establishing_Handshake
          </div>
        </div>

        {/* Agent Side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-cyber-green/5 border border-cyber-green/10"
        >
          <div className="p-4 rounded-full bg-cyber-green/10 text-cyber-green">
            <Bot size={32} />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-tighter">
              The Claweague
            </h4>
            <p className="text-[10px] text-zinc-400 normal-case italic">
              Autonomous Execution
            </p>
          </div>
        </motion.div>
      </div>

      {/* Feature List */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: ShieldCheck,
            label: 'VPC_ISOLATED',
            color: 'text-cyber-blue',
          },
          { icon: Zap, label: 'SUMMER_SPEED', color: 'text-cyber-purple' },
          { icon: Cpu, label: 'SST_NATIVE', color: 'text-zinc-400' },
          { icon: Bot, label: 'AUTO_REFRESH', color: 'text-cyber-green' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-black/40 border border-white/5"
          >
            <item.icon size={14} className={item.color} />
            <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
