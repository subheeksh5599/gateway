"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-text",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.06),transparent_70%)]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-signal/10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-signal/5" />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl">
          <p className="hero-text font-mono text-xs text-signal tracking-[0.2em] uppercase mb-6">
            MCP → Slack
          </p>
          <h1 className="hero-text font-display text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6">
            One agent.
            <br />
            <span className="text-signal">Every tool.</span>
          </h1>
          <p className="hero-text text-lg md:text-xl text-paper/60 max-w-xl mb-10 leading-relaxed">
            Gateway connects your entire toolchain to Slack through a single MCP-powered agent.
            GitHub, Jira, Notion, databases — ask anything, get answers instantly.
          </p>
          <div className="hero-text flex flex-col sm:flex-row gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-signal text-ink font-semibold hover:bg-signal/90 transition-colors text-sm"
            >
              <span className="font-bold text-base">#</span>
              Add to Slack
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-paper/20 text-paper/80 hover:border-paper/40 hover:text-paper transition-all text-sm"
            >
              Try the demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
