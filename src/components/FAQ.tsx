"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What is an MCP server?",
    a: "MCP (Model Context Protocol) is an open standard that lets AI agents connect to tools and data sources. An MCP server exposes a tool's capabilities — like querying a database, searching docs, or creating tickets — through a standardized interface that any MCP-compatible agent can use. Gateway uses MCP to connect your Slack workspace to all your tools.",
  },
  {
    q: "Which tools can Gateway connect to?",
    a: "Any tool that has an MCP server. This includes GitHub, Jira, Notion, PostgreSQL, Stripe, Datadog, Linear, and hundreds more. You can also build custom MCP servers for internal tools — Gateway discovers the available functions automatically.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Gateway enforces Slack's channel-level permissions — private channel data never leaks to public channels. MCP server connections are encrypted in transit (TLS 1.3). Enterprise plans include SSO, audit logging, and the option to host Gateway on your own infrastructure.",
  },
  {
    q: "How does Gateway compare to individual Slack integrations?",
    a: "Individual integrations require separate OAuth flows, configuration, and maintenance for each tool. Gateway replaces all of them with a single agent. Connect any MCP server once, and it's available across your entire Slack workspace. New tools? Just paste the endpoint — no integration work needed.",
  },
  {
    q: "Can I build my own MCP server for internal tools?",
    a: "Absolutely. The MCP protocol is open-source and well-documented. Build an MCP server for your internal API, database, or service, and Gateway will discover it automatically. Pro and Enterprise plans include custom tool routing rules.",
  },
  {
    q: "Does Gateway work with Slack Enterprise Grid?",
    a: "Yes. Gateway is built for Enterprise Grid from day one. Tool configurations can be shared across workspaces, and permissions are enforced per-channel. Contact sales for Enterprise Grid pricing.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 px-6 bg-surface border-t border-border">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-signal tracking-[0.2em] uppercase mb-4">FAQ</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Got <span className="text-signal">questions</span>?
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-paper/[0.02] transition-colors"
              >
                <span className="font-display font-semibold text-sm pr-4">{faq.q}</span>
                {openIndex === i ? (
                  <Minus className="w-4 h-4 text-signal flex-shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-paper/40 flex-shrink-0" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-paper/50 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
