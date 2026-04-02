'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ExternalLink, Zap, Shield, Building2 } from 'lucide-react';

interface TierSelectionProps {
  onSelectManaged: () => void;
  onClose: () => void;
}

const tiers = [
  {
    id: 'oss',
    name: 'OSS',
    description: 'Self-host for free',
    price: 'Free',
    icon: ExternalLink,
    color: 'text-zinc-400',
    borderColor: 'border-zinc-500/20',
    bgColor: 'bg-zinc-500/[0.02]',
    features: [
      'Full source code',
      'Community support',
      '100% data sovereignty',
    ],
    href: 'https://github.com/serverlessclaw/serverlessclaw',
    isExternal: true,
  },
  {
    id: 'solo',
    name: 'Solo',
    description: 'For individual developers',
    price: '$29/mo',
    icon: Zap,
    color: 'text-cyber-blue',
    borderColor: 'border-cyber-blue/30',
    bgColor: 'bg-cyber-blue/[0.03]',
    features: ['Unlimited repos', 'Unlimited scans', '$10/mo AI credits'],
    isDefault: true,
  },
  {
    id: 'team',
    name: 'Team',
    description: 'For startups & teams',
    price: '$99/mo',
    icon: Shield,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    bgColor: 'bg-amber-500/[0.02]',
    features: ['Everything in Solo', 'Team management', '$30/mo AI credits'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large scale swarms',
    price: '$299/mo',
    icon: Building2,
    color: 'text-cyber-purple',
    borderColor: 'border-cyber-purple/20',
    bgColor: 'bg-cyber-purple/[0.02]',
    features: ['50+ repositories', 'SSO & audit logs', '$100/mo AI credits'],
  },
];

export default function TierSelection({
  onSelectManaged,
  onClose,
}: TierSelectionProps) {
  const [selectedTier, setSelectedTier] = useState<string>('solo');

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-black tracking-tight text-white mb-2">
          Choose Your Plan
        </h3>
        <p className="text-white/50 text-sm">
          Select a tier to get started. Managed tiers include a free trial.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          const isSelected = selectedTier === tier.id;

          if (tier.isExternal) {
            return (
              <motion.a
                key={tier.id}
                href={tier.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-xl border ${tier.borderColor} ${tier.bgColor} hover:border-white/20 transition-all cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${tier.color}`} />
                    <span className={`font-bold text-lg ${tier.color}`}>
                      {tier.name}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-zinc-400">
                    {tier.price}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-3">{tier.description}</p>
                <ul className="space-y-1.5">
                  {tier.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs text-zinc-400"
                    >
                      <Check className="w-3 h-3 text-zinc-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-zinc-400" />
                </div>
              </motion.a>
            );
          }

          return (
            <motion.button
              key={tier.id}
              onClick={() => {
                setSelectedTier(tier.id);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? `${tier.borderColor} ${tier.bgColor} shadow-[0_0_30px_rgba(0,224,255,0.1)]`
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {tier.isDefault && (
                <div className="absolute -top-2 left-4 px-2 py-0.5 bg-cyber-blue text-black text-[9px] font-bold uppercase tracking-widest rounded-sm">
                  Default
                </div>
              )}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div
                    className={`w-5 h-5 rounded-full ${tier.color.replace('text-', 'bg-')} flex items-center justify-center`}
                  >
                    <Check className="w-3 h-3 text-black" />
                  </div>
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${tier.color}`} />
                  <span className={`font-bold text-lg ${tier.color}`}>
                    {tier.name}
                  </span>
                </div>
                <span className="text-sm font-mono text-white">
                  {tier.price}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mb-3">{tier.description}</p>
              <ul className="space-y-1.5">
                {tier.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs text-zinc-300"
                  >
                    <Check className={`w-3 h-3 ${tier.color}`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSelectManaged}
          className="flex-1 py-4 rounded-xl bg-cyber-blue hover:bg-cyber-blue/90 text-black font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,224,255,0.3)]"
        >
          Continue with{' '}
          {tiers.find((t) => t.id === selectedTier)?.name || 'Managed'}
          <Zap className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="sm:w-24 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 font-bold transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
