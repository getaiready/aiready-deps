import React from 'react';
import { Zap, Terminal } from 'lucide-react';

interface NodesTabProps {
  detectedRegion: string;
  accounts: any[];
}

export default function NodesTab({ detectedRegion, accounts }: NodesTabProps) {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black italic tracking-tight">
            Managed Hubs
          </h2>
          <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.3em]">
            Distributed Intelligence Fabric
          </p>
        </div>
        <button className="px-6 py-3 bg-cyber-blue text-black font-black uppercase italic text-xs rounded-xl hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(0,224,255,0.2)]">
          <Zap className="w-4 h-4" />
          Deploy New Node
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Render Real Hub Nodes */}
        {accounts.map((account, index) => (
          <div
            key={account.awsAccountId || index}
            className="bg-black/60 border border-cyber-blue/20 rounded-2xl p-8 relative overflow-hidden group hover:border-cyber-blue/50 transition-all shadow-xl"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Terminal className="w-20 h-20 text-cyber-blue" />
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div
                className={`w-2.5 h-2.5 rounded-full ${account.accountStatus === 'ACTIVE' ? 'bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]'}`}
              />
              <span
                className={`text-[10px] font-mono ${account.accountStatus === 'ACTIVE' ? 'text-emerald-500' : 'text-amber-500'} uppercase font-black tracking-widest`}
              >
                {account.awsAccountId || 'PROVISIONING...'}
              </span>
            </div>

            <h3 className="text-xl font-black italic text-white mb-2 truncate">
              {account.repoName || 'Primary Synthesis Hub'}
            </h3>
            <p className="text-[10px] text-zinc-600 font-mono mb-8 uppercase tracking-widest">
              Region: {detectedRegion}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-[10px] font-mono border-b border-white/5 pb-2">
                <span className="text-zinc-600 uppercase">Evolution Loop:</span>
                <span className="text-cyber-blue font-bold">
                  {account.accountStatus === 'ACTIVE'
                    ? 'SYNCHRONIZED'
                    : 'BOOTING...'}
                </span>
              </div>
              <div className="flex justify-between text-[10px] font-mono border-b border-white/5 pb-2">
                <span className="text-zinc-600 uppercase">Spend (MTD):</span>
                <span className="text-white font-bold">
                  ${((account.currentMonthlySpendCents || 0) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[10px] font-mono border-b border-white/5 pb-2">
                <span className="text-zinc-600 uppercase">Plan:</span>
                <span className="text-white font-bold uppercase">
                  {account.plan?.split('_').pop() || 'STARTER'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={account.repoUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all text-center"
              >
                GitHub
              </a>
              <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all">
                Config
              </button>
            </div>
          </div>
        ))}

        {/* Placeholder for expansion */}
        <div className="bg-black/20 border border-white/5 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/[0.03] transition-all hover:border-cyber-blue/30">
          <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-6 text-zinc-700 group-hover:text-cyber-blue group-hover:border-cyber-blue/50 transition-all shadow-inner">
            <Zap className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-zinc-600 group-hover:text-zinc-300 transition-colors uppercase tracking-[0.2em]">
            Scale Regional Node
          </p>
          <p className="text-[9px] text-zinc-700 mt-4 font-mono leading-relaxed max-w-[180px]">
            Expand your intelligence mesh to other AWS regions or separate
            accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
