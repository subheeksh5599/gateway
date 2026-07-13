"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Send,
  Database,
  GitBranch,
  FileText,
  MessageSquare,
  Loader2,
  Check,
  X,
  Slash,
  Activity,
  Globe,
  BarChart3,
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  description: string;
}

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  toolCalls?: { tool: string; status: "calling" | "done" | "error" }[];
  timestamp: Date;
}

const availableTools: Tool[] = [
  { id: "github", name: "GitHub", icon: <GitBranch className="w-4 h-4" />, connected: true, description: "Issues, PRs, repos" },
  { id: "jira", name: "Jira", icon: <Activity className="w-4 h-4" />, connected: true, description: "Tickets, sprints, boards" },
  { id: "notion", name: "Notion", icon: <FileText className="w-4 h-4" />, connected: true, description: "Docs, wikis, databases" },
  { id: "postgres", name: "PostgreSQL", icon: <Database className="w-4 h-4" />, connected: true, description: "Query your database" },
  { id: "slack", name: "Slack API", icon: <MessageSquare className="w-4 h-4" />, connected: true, description: "Channels, messages, users" },
  { id: "stripe", name: "Stripe", icon: <BarChart3 className="w-4 h-4" />, connected: false, description: "Payments, invoices, customers" },
  { id: "datadog", name: "Datadog", icon: <Activity className="w-4 h-4" />, connected: false, description: "Metrics, logs, alerts" },
  { id: "linear", name: "Linear", icon: <Slash className="w-4 h-4" />, connected: false, description: "Issue tracking" },
];

const sampleQueries: { q: string; response: string; tools: string[] }[] = [
  {
    q: "What's the status of the login bug fix?",
    response: "Found the issue across your tools:\n\n**GitHub** → PR #342 \"Fix login redirect loop\" by @sarah — merged to main 2 hours ago\n**Jira** → DEV-187 marked \"Done\" yesterday, sprint review approved\n**Notion** → Release notes updated with fix details in v2.4.1 changelog\n\nLooks like it's resolved and deployed. Want me to check Sentry for any remaining login errors?",
    tools: ["github", "jira", "notion"],
  },
  {
    q: "Show me open pull requests that need review",
    response: "Here are PRs waiting for review:\n\n1. **#356** — \"Add rate limiting middleware\" by @alex • 3 days old • +124/-18\n2. **#348** — \"Fix database connection pool exhaustion\" by @maya • 1 day old • +42/-8\n3. **#361** — \"Migrate to new auth flow\" by @jordan • opened today • +289/-156\n\nAll in the `backend` repo. Want me to assign reviewers?",
    tools: ["github"],
  },
  {
    q: "How many users signed up this week?",
    response: "Querying across tools:\n\n**PostgreSQL** → 1,847 new signups this week (+12% WoW)\n**Stripe** → 342 new paid subscriptions, $28,400 MRR added\n**Notion** → Onboarding doc viewed 1,203 times\n\nTop acquisition channel: GitHub stars → signup flow (43% conversion).",
    tools: ["postgres", "stripe", "notion"],
  },
];

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeToolCalls, setActiveToolCalls] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const query = text || input.trim();
    if (!query || isProcessing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsProcessing(true);

    // Find matching sample or generate generic response
    const match = sampleQueries.find((s) =>
      query.toLowerCase().includes(s.q.toLowerCase().split(" ").slice(0, 3).join(" "))
    );
    const tools = match?.tools || ["github", "notion"];
    setActiveToolCalls(tools);

    const agentMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "agent",
      content: "",
      toolCalls: tools.map((t) => ({ tool: t, status: "calling" })),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, agentMsg]);

    // Simulate tool calls sequentially
    for (let i = 0; i < tools.length; i++) {
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentMsg.id
            ? {
                ...m,
                toolCalls: m.toolCalls?.map((tc, idx) =>
                  idx === i ? { ...tc, status: "done" as const } : tc
                ),
              }
            : m
        )
      );
    }

    await new Promise((r) => setTimeout(r, 400));

    setMessages((prev) =>
      prev.map((m) =>
        m.id === agentMsg.id
          ? {
              ...m,
              content: match?.response || `Here's what I found about "${query}":\n\nI searched across your connected tools (${tools.map((t) => availableTools.find((at) => at.id === t)?.name).join(", ")}) but couldn't find a direct match. Try rephrasing or connecting more tools.`,
            }
          : m
      )
    );

    setActiveToolCalls([]);
    setIsProcessing(false);
  };

  const toggleTool = (id: string) => {
    // Toggle connection for demo purposes
    const tool = availableTools.find((t) => t.id === id);
    if (tool) tool.connected = !tool.connected;
    // Force re-render
    setActiveToolCalls([...activeToolCalls]);
  };

  return (
    <section id="dashboard" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-signal tracking-[0.2em] uppercase mb-4">Interactive Demo</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Ask anything. Get answers from everywhere.
          </h2>
          <p className="text-paper/60 max-w-lg mx-auto">
            Type a question below. Gateway queries all your connected tools via MCP and returns a single answer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 max-w-5xl mx-auto">
          {/* Sidebar — connected tools */}
          <div className="bg-surface border border-border rounded-2xl p-4 space-y-1">
            <p className="text-xs text-paper/40 font-mono uppercase tracking-wider mb-3 px-2">Connected Tools</p>
            {availableTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                  tool.connected
                    ? "text-paper/80 hover:bg-paper/5"
                    : "text-paper/30 hover:bg-paper/5"
                } ${activeToolCalls.includes(tool.id) ? "bg-signal/10 text-signal" : ""}`}
              >
                <span className={tool.connected ? "text-signal" : "text-paper/20"}>{tool.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-xs">{tool.name}</div>
                  <div className="text-[10px] text-paper/30">{tool.description}</div>
                </div>
                <span className="ml-auto">
                  {activeToolCalls.includes(tool.id) ? (
                    <Loader2 className="w-3 h-3 animate-spin text-signal" />
                  ) : tool.connected ? (
                    <Check className="w-3 h-3 text-signal" />
                  ) : (
                    <X className="w-3 h-3 text-paper/20" />
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Main chat area */}
          <div className="bg-surface border border-border rounded-2xl flex flex-col h-[600px] overflow-hidden">
            {/* Chat header */}
            <div className="px-5 py-3 border-b border-border flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-signal animate-pulse" />
              <span className="text-sm font-medium">Gateway Agent</span>
              <span className="text-xs text-paper/40 ml-auto">5 tools connected</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-8">
                  <div className="w-16 h-16 rounded-2xl bg-signal/10 flex items-center justify-center mb-4">
                    <Search className="w-7 h-7 text-signal" />
                  </div>
                  <p className="font-display font-semibold text-lg mb-2">Ask your tools anything</p>
                  <p className="text-sm text-paper/40 mb-6 max-w-sm">
                    Gateway queries all your connected tools via MCP and synthesizes answers in real time.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {sampleQueries.slice(0, 3).map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(s.q)}
                        className="text-xs px-3 py-1.5 rounded-full border border-paper/10 text-paper/50 hover:border-signal/30 hover:text-paper/80 transition-all"
                      >
                        {s.q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "agent" && (
                    <div className="w-7 h-7 rounded-lg bg-signal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Globe className="w-3.5 h-3.5 text-signal" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-signal/10 border border-signal/20 rounded-2xl rounded-br-md px-4 py-2.5"
                        : "space-y-2"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <>
                        {/* Tool call indicators */}
                        {msg.toolCalls && msg.toolCalls.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {msg.toolCalls.map((tc, i) => (
                              <span
                                key={i}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                  tc.status === "done"
                                    ? "bg-signal/10 text-signal"
                                    : tc.status === "calling"
                                    ? "bg-paper/5 text-paper/40"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {tc.status === "calling" && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                                {tc.status === "done" && <Check className="w-2.5 h-2.5" />}
                                {availableTools.find((t) => t.id === tc.tool)?.name || tc.tool}
                              </span>
                            ))}
                          </div>
                        )}
                        {msg.content && (
                          <div className="text-sm leading-relaxed text-paper/80 whitespace-pre-wrap [&_strong]:text-paper [&_strong]:font-semibold">
                            {msg.content.split("\n").map((line, i) => (
                              <p key={i} className={line.startsWith("**") ? "font-semibold text-paper mt-2 first:mt-0" : ""}>
                                {line}
                              </p>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-paper/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-paper/50">U</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-3 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything across your tools..."
                  className="flex-1 bg-transparent border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-paper/20 focus:outline-none focus:border-signal/50 transition-colors"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isProcessing || !input.trim()}
                  className="px-3 py-2.5 rounded-xl bg-signal text-ink hover:bg-signal/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
