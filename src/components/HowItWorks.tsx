"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const steps = [
  { step: "01", title: "Install Gateway", desc: "Add Gateway to your Slack workspace with one click. The agent is ready in seconds." },
  { step: "02", title: "Connect MCP servers", desc: "Paste any MCP server endpoint. Gateway auto-discovers available tools." },
  { step: "03", title: "Ask questions", desc: "Type your question in any Slack channel. Gateway routes it to the right tools and responds with a synthesized answer." },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".step", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 60%" } });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="how-it-works" className="py-28 px-8 bg-surface border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-accent tracking-[0.2em] uppercase mb-4">How It Works</p>
          <h2 className="font-display text-4xl md:text-5xl font-light italic tracking-[-0.02em] mb-4">Three steps to <span className="text-accent">superpowers</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-3xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="step relative">
              <span className="font-display text-8xl font-bold text-accent/8 absolute -top-6 -left-2 select-none">{s.step}</span>
              <div className="relative z-10 pt-10"><h3 className="font-display font-medium text-xl mb-3">{s.title}</h3><p className="text-sm text-ink/40 leading-relaxed">{s.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
