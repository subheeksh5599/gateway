"use client";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-line", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="min-h-screen flex items-center pt-20 pb-24 px-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="max-w-3xl">
          <p className="hero-line font-mono text-xs text-accent tracking-[0.2em] uppercase mb-8">MCP → Slack</p>
          <h1 className="hero-line font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] tracking-[-0.02em] mb-8 text-ink">
            One agent.<br />
            <span className="italic text-accent">Every&nbsp;tool.</span>
          </h1>
          <p className="hero-line text-lg md:text-xl text-ink/50 max-w-lg mb-10 leading-relaxed">
            Gateway connects your entire toolchain to Slack through a single MCP-powered agent. GitHub, Jira, Notion, databases — ask anything, get answers instantly.
          </p>
          <div className="hero-line flex flex-col sm:flex-row gap-4">
            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-medium hover:bg-accent/90 transition-colors text-sm">
              Add to Slack <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-ink/60 hover:text-ink hover:border-ink/20 transition-all text-sm">
              Try the demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
