"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "What is an MCP server?", a: "MCP (Model Context Protocol) is an open standard that lets AI agents connect to tools and data sources. An MCP server exposes a tool's capabilities through a standardized interface that any MCP-compatible agent can use." },
  { q: "Which tools can Gateway connect to?", a: "Any tool with an MCP server: GitHub, Jira, Notion, PostgreSQL, Stripe, Datadog, Linear, and hundreds more. You can also build custom MCP servers for internal tools." },
  { q: "Is my data secure?", a: "Gateway enforces Slack's channel-level permissions. MCP connections are encrypted in transit (TLS 1.3). Enterprise plans include SSO, audit logging, and self-hosted options." },
  { q: "How does Gateway compare to individual Slack integrations?", a: "Individual integrations require separate OAuth and maintenance per tool. Gateway replaces all of them with a single agent. Connect an MCP server once — available everywhere." },
  { q: "Can I build my own MCP server?", a: "Yes. The MCP protocol is open-source. Build an MCP server for your internal API and Gateway discovers it automatically." },
  { q: "Does Gateway work with Slack Enterprise Grid?", a: "Yes. Gateway is built for Enterprise Grid. Share tool configs across workspaces, per-channel permissions enforced." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-28 px-8 bg-surface border-t border-border">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-accent tracking-[0.2em] uppercase mb-4">FAQ</p>
          <h2 className="font-display text-4xl md:text-5xl font-light italic tracking-[-0.02em]">Got <span className="text-accent">questions</span>?</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-2xl overflow-hidden bg-paper">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-ink/[0.01] transition-colors">
                <span className="font-display font-medium text-sm pr-4">{faq.q}</span>
                {open === i ? <Minus className="w-4 h-4 text-accent flex-shrink-0" /> : <Plus className="w-4 h-4 text-ink/30 flex-shrink-0" />}
              </button>
              {open === i && <div className="px-6 pb-5"><p className="text-sm text-ink/40 leading-relaxed">{faq.a}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
