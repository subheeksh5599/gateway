"use client";
import { useEffect, useRef } from "react";
import { Plug, Zap, Shield, Layers, Globe, Clock } from "lucide-react";
import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: <Plug className="w-5 h-5" />, title: "One-click MCP connect", description: "Connect any MCP server to Slack in seconds. No custom integrations. No OAuth hell. Just paste the endpoint and Gateway handles the rest." },
  { icon: <Zap className="w-5 h-5" />, title: "Real-time tool calling", description: "Ask a question in Slack. Gateway determines which tools to query, calls them in parallel via MCP, and synthesizes the answer." },
  { icon: <Shield className="w-5 h-5" />, title: "Permission-aware routing", description: "Every tool call respects Slack channel permissions. Private channel data stays private." },
  { icon: <Layers className="w-5 h-5" />, title: "1000+ MCP servers", description: "Compatible with the entire MCP ecosystem. Databases, APIs, file systems, SaaS tools — if it has an MCP server, Gateway connects it to Slack." },
  { icon: <Globe className="w-5 h-5" />, title: "Cross-workspace sync", description: "Share tool configurations across Slack workspaces. Enterprise Grid scales to thousands of channels." },
  { icon: <Clock className="w-5 h-5" />, title: "Scheduled queries", description: "Daily standup summaries, weekly sprint reports, hourly pipeline checks — posted to the right channel on schedule." },
];

export default function Features() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".feature-card", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 70%" } });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="features" className="py-28 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-accent tracking-[0.2em] uppercase mb-4">Features</p>
          <h2 className="font-display text-4xl md:text-5xl font-light italic tracking-[-0.02em] mb-4">Every tool, <span className="text-accent">one agent</span></h2>
          <p className="text-ink/40 max-w-lg mx-auto">Gateway eliminates the fragmentation of a dozen Slack integrations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="feature-card group">
              <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center mb-5 group-hover:bg-accent/10 transition-colors"><span className="text-accent">{f.icon}</span></div>
              <h3 className="font-display font-medium text-lg mb-3">{f.title}</h3>
              <p className="text-sm text-ink/40 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
