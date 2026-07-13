"use client";

import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For individuals and small teams getting started.",
    features: ["3 MCP server connections", "50 queries/day", "Single Slack workspace", "Community support"],
    cta: "Add to Slack",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For growing teams that need all their tools connected.",
    features: [
      "Unlimited MCP servers",
      "1,000 queries/day",
      "5 Slack workspaces",
      "Scheduled queries",
      "Priority support",
      "Custom tool routing",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with advanced security and scale needs.",
    features: [
      "Everything in Pro",
      "Unlimited queries",
      "SSO & SAML",
      "Audit logs",
      "Custom MCP server hosting",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Talk to sales",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="font-mono text-xs text-signal tracking-[0.2em] uppercase mb-4">Pricing</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Start free, <span className="text-signal">scale fast</span>
          </h2>
          <p className="text-paper/60 max-w-lg mx-auto">
            No hidden fees. No per-tool pricing. Pay for usage, not integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 flex flex-col ${
                tier.featured
                  ? "bg-signal text-ink ring-2 ring-signal"
                  : "bg-surface border border-border text-paper"
              }`}
            >
              <h3 className="font-display font-semibold text-lg mb-1">{tier.name}</h3>
              <p className={`text-sm mb-6 ${tier.featured ? "text-ink/60" : "text-paper/40"}`}>{tier.description}</p>

              <div className="mb-8">
                <span className="font-display text-4xl font-bold">{tier.price}</span>
                {tier.period && (
                  <span className={`text-sm ${tier.featured ? "text-ink/60" : "text-paper/40"}`}>{tier.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        tier.featured ? "text-ink/70" : "text-signal"
                      }`}
                    />
                    <span className={tier.featured ? "text-ink/80" : "text-paper/60"}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`block text-center px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  tier.featured
                    ? "bg-ink text-signal hover:bg-ink/90"
                    : "border border-paper/20 hover:border-signal/30 hover:text-signal"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
