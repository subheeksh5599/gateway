"use client";

import { useEffect, useRef } from "react";
import { Plug, Zap, Shield, Layers, Globe, Clock } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Plug className="w-5 h-5" />,
    title: "One-click MCP connect",
    description: "Connect any MCP server to Slack in seconds. No custom integrations. No OAuth hell. Just paste the endpoint and Gateway handles the rest.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Real-time tool calling",
    description: "Ask a question in Slack. Gateway determines which tools to query, calls them in parallel via MCP, and synthesizes the answer.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Permission-aware routing",
    description: "Every tool call respects Slack channel permissions. Private channel data stays private. Gateway enforces access control at the MCP layer.",
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "1000+ MCP servers",
    description: "Compatible with the entire MCP ecosystem. Databases, APIs, file systems, SaaS tools — if it has an MCP server, Gateway connects it to Slack.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Cross-workspace sync",
    description: "Share tool configurations across Slack workspaces. Enterprise Grid? Gateway scales to thousands of channels with zero added latency.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Scheduled queries",
    description: "Set up recurring queries — daily standup summaries, weekly sprint reports, hourly pipeline checks. Gateway posts them to the right channel on schedule.",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="font-mono text-xs text-signal tracking-[0.2em] uppercase mb-4">Features</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Every tool, <span className="text-signal">one agent</span>
          </h2>
          <p className="text-paper/60 max-w-lg mx-auto">
            Gateway eliminates the fragmentation of a dozen Slack integrations. One agent. Any MCP server.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card bg-surface p-8 group hover:bg-paper/[0.02] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-signal/10 flex items-center justify-center mb-5 group-hover:bg-signal/20 transition-colors">
                <span className="text-signal">{f.icon}</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-3">{f.title}</h3>
              <p className="text-sm text-paper/50 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
