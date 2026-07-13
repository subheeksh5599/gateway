"use client";
import { Check } from "lucide-react";

const tiers = [
  { name: "Starter", price: "Free", desc: "For individuals and small teams.", features: ["3 MCP servers", "50 queries/day", "Single workspace", "Community support"], featured: false },
  { name: "Pro", price: "$29", period: "/mo", desc: "For growing teams.", features: ["Unlimited MCP servers", "1,000 queries/day", "5 workspaces", "Scheduled queries", "Priority support", "Custom routing"], featured: true },
  { name: "Enterprise", price: "Custom", desc: "For organizations.", features: ["Everything in Pro", "Unlimited queries", "SSO & SAML", "Audit logs", "Custom hosting", "Dedicated support", "SLA"], featured: false },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-accent tracking-[0.2em] uppercase mb-4">Pricing</p>
          <h2 className="font-display text-4xl md:text-5xl font-light italic tracking-[-0.02em] mb-4">Start free, <span className="text-accent">scale fast</span></h2>
          <p className="text-ink/40 max-w-lg mx-auto">No hidden fees. No per-tool pricing. Pay for usage, not integrations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {tiers.map((t, i) => (
            <div key={i} className={`rounded-2xl p-8 flex flex-col ${t.featured ? "bg-accent text-white ring-2 ring-accent" : "bg-surface border border-border"}`}>
              <h3 className="font-display font-medium text-xl mb-1">{t.name}</h3>
              <p className={`text-sm mb-6 ${t.featured ? "text-white/60" : "text-ink/30"}`}>{t.desc}</p>
              <div className="mb-8"><span className="font-display text-4xl font-bold">{t.price}</span>{t.period && <span className={`text-sm ${t.featured ? "text-white/60" : "text-ink/30"}`}>{t.period}</span>}</div>
              <ul className="space-y-3 mb-8 flex-1">
                {t.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm"><Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${t.featured ? "text-white/70" : "text-accent"}`} /><span className={t.featured ? "text-white/80" : "text-ink/50"}>{f}</span></li>
                ))}
              </ul>
              <a href="#" className={`block text-center px-6 py-3 rounded-full text-sm font-medium transition-all ${t.featured ? "bg-white text-accent hover:bg-white/90" : "border border-border hover:border-accent/30 hover:text-accent"}`}>{t.name === "Enterprise" ? "Talk to sales" : t.name === "Pro" ? "Start free trial" : "Add to Slack"}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
