'use client';

import React from 'react';
import { Zap, ChevronRight, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import BlogLayout from '../_components/BlogLayout';
import Visualizer from '../../../components/blog/Visualizer';

export default function PostClient() {
  return (
    <BlogLayout
      metadata={{
        title:
          'CLAWEAGUE: Part 1 - Provisioning Your Pair Programmer in 60 Seconds',
        description:
          'How to automate infrastructure for your AI agents via AWS account vending and SST. Isolation, security, and one-click teammate setup.',
        date: '2026-04-01',
        image: '/blog-images/claweague-technical-part1-cover.png',
        slug: 'claweague-technical-part-1-provisioning-pair-programmer',
      }}
      header={{
        category: 'CLAWEAGUE_001',
        hash: 'provision',
        readTime: '6 MIN READ',
        title: (
          <>
            Provisioning Your <br />
            <span className="text-cyber-green">Pair Programmer</span>
          </>
        ),
        subtitle: 'Managed Autonomy in 60s',
        description:
          'Stop dealing with API key rot and VPC configuration. Learn how to launch a fully-isolated digital teammate using the physics of serverless.',
        image: '/blog-images/claweague-technical-part1-cover.png',
      }}
      breadcrumbItems={[
        { label: 'BLOG', href: '/blog' },
        {
          label: 'CLAWEAGUE P1',
          href: '/blog/claweague-technical-part-1-provisioning-pair-programmer',
        },
      ]}
    >
      <section>
        <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
          <span className="text-cyber-green font-mono text-sm">01</span>
          The Infrastructure Handshake
        </h2>
        <p className="text-zinc-200 leading-relaxed text-lg italic normal-case">
          A Claweague isn&apos;t just a script running on your laptop. It&apos;s
          a fully-provisioned engineering node with its own secure identity.
        </p>
        <p className="text-zinc-200 leading-relaxed text-lg mt-6 normal-case">
          In the past, giving an agent access to your AWS environment was a
          security nightmare. In the **Eclawnomy**, we use **Account Vending**
          to provide every agent with its own sandboxed VPC.
        </p>
      </section>

      <Visualizer />

      <section className="mt-16">
        <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
          <span className="text-cyber-green font-mono text-sm">02</span>
          The Stack: SST + AWS Organizations
        </h2>
        <p className="text-zinc-200 leading-relaxed text-lg normal-case">
          How do we automate the creation of a colleague? We leverage **SST**
          and the **AWS Organizations SDK**.
        </p>
        <div className="mt-8 p-6 bg-cyber-green/5 border border-cyber-green/20 rounded-sm">
          <div className="flex items-center gap-3 mb-4 text-cyber-green">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest">
              Security_Protocol_V4
            </span>
          </div>
          <ul className="space-y-3 text-sm text-zinc-300 normal-case">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-1 text-cyber-green" />
              <span>
                <strong>VPC Isolation:</strong> Each agent operates in a
                strictly isolated subnet.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-1 text-cyber-green" />
              <span>
                <strong>IAM Scoping:</strong> Agents only have permissions for
                the specific resources they manage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-1 text-cyber-green" />
              <span>
                <strong>Ephemeral Lifespan:</strong> Accounts can be torched and
                re-vended in seconds if a boundary is breached.
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
          <span className="text-cyber-green font-mono text-sm">03</span>
          One Click to Collaboration
        </h2>
        <p className="text-zinc-200 leading-relaxed text-lg normal-case">
          Inside the **ClawMore** dashboard, provisioning is as simple as
          clicking &quot;Hire Agent.&quot; In the background:
        </p>
        <ol className="list-decimal pl-6 mt-8 space-y-4 text-zinc-300 normal-case">
          <li>AWS Account is created via SDK.</li>
          <li>SST is bootstrapped into the new account.</li>
          <li>
            The agent&apos;s &quot;Neural Spine&quot; (EventBridge) is linked to
            the monorepo.
          </li>
          <li>
            Your new Claweague sends its first &quot;Hello World&quot; commit.
          </li>
        </ol>
      </section>

      <section className="mt-16 p-8 bg-zinc-900 border border-white/5 rounded-3xl">
        <div className="flex items-center gap-4 mb-4">
          <Cpu className="text-cyber-green" />
          <h3 className="text-xl font-bold italic tracking-tighter uppercase">
            What&apos;s Next?
          </h3>
        </div>
        <p className="text-zinc-400 normal-case italic">
          In Part 2, we&apos;ll explore the **Handshake Protocol**—how your
          agents use MCP to talk to your code without the need for constant
          copy-pasting.
        </p>
      </section>
    </BlogLayout>
  );
}
