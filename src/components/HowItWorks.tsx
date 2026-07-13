"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    step: "01",
    title: "Install Gateway",
    description: "Add Gateway to your Slack workspace with one click. No configuration needed — the agent is ready in seconds.",
  },
  {
    step: "02",
    title: "Connect MCP servers",
    description: "Paste any MCP server endpoint. Gateway auto-discovers available tools and makes them queryable from Slack.",
  },
  {
    step: "03",
    title: "Ask questions",
    description: "Type your question in any Slack channel. Gateway routes it to the right tools, calls them in parallel, and responds with a synthesized answer.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".step-card",
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-32 px-6 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="font-mono text-xs text-signal tracking-[0.2em] uppercase mb-4">How It Works</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Three steps to <span className="text-signal">superpowers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="step-card relative">
              <span className="font-display text-7xl font-bold text-signal/10 absolute -top-4 -left-2 select-none">
                {s.step}
              </span>
              <div className="relative z-10 pt-12">
                <h3 className="font-display font-semibold text-xl mb-3">{s.title}</h3>
                <p className="text-sm text-paper/50 leading-relaxed">{s.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 text-signal/30">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
