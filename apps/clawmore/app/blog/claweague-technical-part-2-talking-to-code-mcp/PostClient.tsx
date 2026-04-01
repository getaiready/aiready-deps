'use client';

import React from 'react';
import { Zap, ChevronRight, Cpu, Activity, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import BlogLayout from '../_components/BlogLayout';
import TraceViewer from '../../../components/blog/TraceViewer';

export default function PostClient() {
  return (
    <BlogLayout
      metadata={{
        title:
          'CLAWEAGUE: Part 2 - The MCP Handshake: Talking to Your Code Substrate',
        description:
          'Using the Model Context Protocol (MCP) to bridge the gap between your IDE and your autonomous colleague. Real-time collaboration without a clipboard.',
        date: '2026-04-01',
        image: '/blog-images/claweague-technical-part2-cover.png',
        slug: 'claweague-technical-part-2-talking-to-code-mcp',
      }}
      header={{
        category: 'CLAWEAGUE_002',
        hash: 'mcp-handshake',
        readTime: '7 MIN READ',
        title: (
          <>
            The MCP Handshake: <br />
            <span className="text-cyber-blue">Code Substrate Sync</span>
          </>
        ),
        subtitle: 'Bilateral Context Streaming',
        description:
          'Stop copying and pasting into chat windows. Learn how to bridge the gap between your local IDE and your serverless Claweague using the Model Context Protocol.',
        image: '/blog-images/claweague-technical-part2-cover.png',
      }}
      breadcrumbItems={[
        { label: 'BLOG', href: '/blog' },
        {
          label: 'CLAWEAGUE P2',
          href: '/blog/claweague-technical-part-2-talking-to-code-mcp',
        },
      ]}
    >
      <section>
        <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
          <span className="text-cyber-blue font-mono text-sm">01</span>
          The Context Gap
        </h2>
        <p className="text-zinc-200 leading-relaxed text-lg italic normal-case">
          The biggest friction in AI-pair programming isn&apos;t the
          model&apos;s intelligence—it&apos;s the context.
        </p>
        <p className="text-zinc-200 leading-relaxed text-lg mt-6 normal-case">
          Traditional AI tools live in a sandbox. They can see what you paste,
          but they can&apos;t feel the codebase. In **ClawMore**, we use the
          **Model Context Protocol (MCP)** to create a persistent, bilateral
          connection between your silicon colleague and your file system.
        </p>
      </section>

      <TraceViewer />

      <section className="mt-16">
        <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
          <span className="text-cyber-blue font-mono text-sm">02</span>
          The Protocol of Collaboration
        </h2>
        <p className="text-zinc-200 leading-relaxed text-lg normal-case">
          MCP allows your Claweague to &quot;request&quot; context rather than
          you manually providing it. If an agent needs to understand of a
          dependency tree, it just queries the MCP server.
        </p>
        <div className="mt-8 p-6 bg-cyber-blue/5 border border-cyber-blue/20 rounded-sm">
          <div className="flex items-center gap-3 mb-4 text-cyber-blue">
            <ArrowRightLeft className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest">
              Context_Protocol_V6
            </span>
          </div>
          <ul className="space-y-3 text-sm text-zinc-300 normal-case">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-1 text-cyber-blue" />
              <span>
                <strong>Tool Access:</strong> Agents can call local scripts, run
                tests, and browse files via authorized MCP tools.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-1 text-cyber-blue" />
              <span>
                <strong>Resource Streaming:</strong> Code metadata is streamed
                in real-time as your agent works on its isolated AWS stack.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-1 text-cyber-blue" />
              <span>
                <strong>Secure Bridge:</strong> All communication travels
                through a zero-trust encrypted tunnel.
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4">
          <span className="text-cyber-blue font-mono text-sm">03</span>
          The Managed Handshake
        </h2>
        <p className="text-zinc-200 leading-relaxed text-lg normal-case">
          With **ClawMore**, setting up MCP is automatic. Once your agent is
          provisioned, its MCP server is registered in your IDE (Cursor, Claude
          Desktop, or Windsurf), allowing for a seamless &quot;Mental
          Model&quot; synchronization.
        </p>
      </section>

      <section className="mt-16 p-8 bg-zinc-900 border border-white/5 rounded-3xl">
        <div className="flex items-center gap-4 mb-4">
          <Activity className="text-cyber-blue" />
          <h3 className="text-xl font-bold italic tracking-tighter uppercase">
            What&apos;s Next?
          </h3>
        </div>
        <p className="text-zinc-400 normal-case italic">
          In Part 3, we&apos;ll explore **Skill Development**—how to teach your
          Claweagues custom commands that are specific to your business logic.
        </p>
      </section>
    </BlogLayout>
  );
}
