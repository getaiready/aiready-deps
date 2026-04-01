'use client';

import React from 'react';
import { Zap, ChevronRight, Cpu, Activity, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import BlogLayout from '../_components/BlogLayout';
import Visualizer from '../../../components/blog/Visualizer';

export default function PostClient() {
  return (
    <BlogLayout
      metadata={{
        title: 'CLAWEAGUE: Part 3 - Teaching Your Claw New Skills',
        description:
          'How to build and deploy custom domain-specific skills for your agentic teammates. Modular intelligence for high-performance evolution.',
        date: '2026-04-01',
        image: '/blog-images/claweague-technical-part3-cover.png',
        slug: 'claweague-technical-part-3-teaching-claw-new-skills',
      }}
      header={{
        category: 'CLAWEAGUE_003',
        hash: 'skills-dev',
        readTime: '8 MIN READ',
        title: (
          <>
            Teaching Your Claw <br />
            <span className="text-cyber-purple">New Domain Skills</span>
          </>
        ),
        subtitle: 'Modular Intelligence Deployment',
        description:
          'Generic AI is boring. Domain-specific AI is transformative. Learn how to train and deploy specialized skills to your agentic teammates via the AgentSkills standard.',
        image: '/blog-images/claweague-technical-part3-cover.png',
      }}
      breadcrumbItems={[
        { label: 'BLOG', href: '/blog' },
        {
          label: 'CLAWEAGUE P3',
          href: '/blog/claweague-technical-part-3-teaching-claw-new-skills',
        },
      ]}
    >
      <section>
        <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
          <span className="text-cyber-purple font-mono text-sm">01</span>
          Intelligence That is Unique to You
        </h2>
        <p className="text-zinc-200 leading-relaxed text-lg italic normal-case">
          A truly effective Claweague shouldn&apos;t just know how to code; it
          should know how *you* code.
        </p>
        <p className="text-zinc-200 leading-relaxed text-lg mt-6 normal-case">
          Every business has its own unique &quot;physics&quot;—its own
          libraries, APIs, and conventions. In this series, we introduce
          **AgentSkills**, a modular standard for extending the capabilities of
          your serverless AI agents.
        </p>
      </section>

      <Visualizer />

      <section className="mt-16">
        <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
          <span className="text-cyber-purple font-mono text-sm">02</span>
          Developing a Skill Node
        </h2>
        <p className="text-zinc-200 leading-relaxed text-lg normal-case">
          An AgentSkill is a specialized Lambda function that lives in your
          **Spoke** account. It is registered with the central hub and can be
          invoked by any authorized agent in the swarm.
        </p>
        <div className="mt-8 p-6 bg-cyber-purple/5 border border-cyber-purple/20 rounded-sm">
          <div className="flex items-center gap-3 mb-4 text-cyber-purple">
            <GraduationCap className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest">
              Skill_Blueprint_V1
            </span>
          </div>
          <ul className="space-y-3 text-sm text-zinc-300 normal-case">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-1 text-cyber-purple" />
              <span>
                <strong>Zod Definition:</strong> Every skill has a strictly
                typed input/output schema for reliable agentic calling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-1 text-cyber-purple" />
              <span>
                <strong>Managed Auth:</strong> Access control is handled at the
                hub level, ensuring only trusted agents can execute sensitive
                logic.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-1 text-cyber-purple" />
              <span>
                <strong>Telemetry Sync:</strong> Execution traces are
                automatically logged to **ClawMore** for observability.
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
          <span className="text-cyber-purple font-mono text-sm">03</span>
          Deploying Intelligence with SST
        </h2>
        <p className="text-zinc-200 leading-relaxed text-lg normal-case">
          Teaching a new skill is as simple as adding a new function to your SST
          stack. The **ClawMore** orchestrator will detect the new Skill ARN and
          update the agent&apos;s &quot;Brain Map&quot; in real-time. No
          re-deployment of the agent required.
        </p>
      </section>

      <section className="mt-16 p-8 bg-zinc-900 border border-white/5 rounded-3xl">
        <div className="flex items-center gap-4 mb-4">
          <Activity className="text-cyber-purple" />
          <h3 className="text-xl font-bold italic tracking-tighter uppercase">
            What&apos;s Next?
          </h3>
        </div>
        <p className="text-zinc-400 normal-case italic">
          In our final installment, Part 4, we&apos;ll dive into
          **Observability**—how to trace and debug your Claweague&apos;s
          reasoning to keep your silicon relationship healthy.
        </p>
      </section>
    </BlogLayout>
  );
}
