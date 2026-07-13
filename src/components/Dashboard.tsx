"use client";
import { useState, useRef, useEffect } from "react";
import { Search, Send, Database, GitBranch, FileText, MessageSquare, Loader2, Check, X, Slash, Activity, Globe, BarChart3 } from "lucide-react";

interface Tool { id: string; name: string; icon: React.ReactNode; connected: boolean; description: string; }
interface Message { id: string; role: "user" | "agent"; content: string; toolCalls?: { tool: string; status: "calling" | "done" | "error" }[]; timestamp: Date; }

const availableTools: Tool[] = [
  { id: "github", name: "GitHub", icon: <GitBranch className="w-3.5 h-3.5" />, connected: true, description: "Issues, PRs, repos" },
  { id: "jira", name: "Jira", icon: <Activity className="w-3.5 h-3.5" />, connected: true, description: "Tickets, sprints" },
  { id: "notion", name: "Notion", icon: <FileText className="w-3.5 h-3.5" />, connected: true, description: "Docs, wikis" },
  { id: "postgres", name: "PostgreSQL", icon: <Database className="w-3.5 h-3.5" />, connected: true, description: "Query database" },
  { id: "slack", name: "Slack API", icon: <MessageSquare className="w-3.5 h-3.5" />, connected: true, description: "Channels, msgs" },
  { id: "stripe", name: "Stripe", icon: <BarChart3 className="w-3.5 h-3.5" />, connected: false, description: "Payments" },
  { id: "datadog", name: "Datadog", icon: <Activity className="w-3.5 h-3.5" />, connected: false, description: "Metrics, logs" },
  { id: "linear", name: "Linear", icon: <Slash className="w-3.5 h-3.5" />, connected: false, description: "Issues" },
];

const sampleQueries = ["Show me open pull requests in React", "Search for bug issues in Next.js", "What's the MCP servers repo info?"];

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeToolCalls, setActiveToolCalls] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (text?: string) => {
    const query = text || input.trim();
    if (!query || isProcessing) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput(""); setIsProcessing(true); setActiveToolCalls(["github"]);
    const agentMsg: Message = { id: (Date.now()+1).toString(), role: "agent", content: "", toolCalls: [{ tool: "github", status: "calling" }], timestamp: new Date() };
    setMessages(prev => [...prev, agentMsg]);

    try {
      const res = await fetch("/api/query", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const names = data.toolCalls?.length ? data.toolCalls.map((t: string) => ({ tool: t, status: "done" as const })) : [{ tool: "github", status: "done" as const }];
      setMessages(prev => prev.map(m => m.id === agentMsg.id ? { ...m, content: data.response, toolCalls: names } : m));
    } catch (error) {
      setMessages(prev => prev.map(m => m.id === agentMsg.id ? { ...m, content: `Error: ${error instanceof Error ? error.message : "Failed"}. Rate limits may apply.`, toolCalls: [{ tool: "github", status: "error" as const }] } : m));
    }
    setActiveToolCalls([]); setIsProcessing(false);
  };

  return (
    <section id="dashboard" className="py-24 px-8 bg-surface border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-mono text-xs text-accent tracking-[0.2em] uppercase mb-4">Interactive Demo</p>
          <h2 className="font-display text-4xl md:text-5xl font-light italic tracking-[-0.02em] mb-4">Ask anything. Get answers from <span className="text-accent">everywhere</span>.</h2>
          <p className="text-ink/40 max-w-lg mx-auto">Type a question below. Gateway queries your connected tools via MCP and returns a single answer.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 max-w-4xl mx-auto">
          <div className="bg-paper border border-border rounded-2xl p-4 space-y-0.5">
            <p className="text-[10px] text-ink/30 font-mono uppercase tracking-wider mb-3 px-2">Connected</p>
            {availableTools.map(tool => (
              <div key={tool.id} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${tool.connected ? "text-ink/70" : "text-ink/20"} ${activeToolCalls.includes(tool.id) ? "bg-accent/5 text-accent" : ""}`}>
                <span className={tool.connected ? "text-accent" : "text-ink/15"}>{tool.icon}</span>
                <div className="text-left"><div className="font-medium text-xs">{tool.name}</div><div className="text-[10px] text-ink/25">{tool.description}</div></div>
                <span className="ml-auto">{activeToolCalls.includes(tool.id) ? <Loader2 className="w-3 h-3 animate-spin text-accent" /> : tool.connected ? <Check className="w-3 h-3 text-accent" /> : <X className="w-3 h-3 text-ink/15" />}</span>
              </div>
            ))}
          </div>

          <div className="bg-paper border border-border rounded-2xl flex flex-col h-[550px] overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-accent" /><span className="text-sm font-medium">Gateway Agent</span><span className="text-xs text-ink/30 ml-auto">5 tools connected</span></div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-8">
                  <div className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center mb-4"><Search className="w-6 h-6 text-accent" /></div>
                  <p className="font-display font-medium text-xl mb-2 italic">Ask your tools anything</p>
                  <p className="text-sm text-ink/30 mb-6 max-w-sm">Gateway queries all your connected tools via MCP and synthesizes answers in real time.</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {sampleQueries.slice(0, 3).map((s, i) => (
                      <button key={i} onClick={() => handleSend(s)} className="text-xs px-3 py-1.5 rounded-full border border-border text-ink/40 hover:border-accent/30 hover:text-ink/70 transition-all">{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "agent" && <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Globe className="w-3.5 h-3.5 text-accent" /></div>}
                  <div className={`max-w-[85%] ${msg.role === "user" ? "bg-accent/5 border border-accent/10 rounded-2xl rounded-br-md px-4 py-2.5" : "space-y-2"}`}>
                    {msg.role === "user" ? <p className="text-sm">{msg.content}</p> : <>
                      {msg.toolCalls && msg.toolCalls.length > 0 && <div className="flex flex-wrap gap-1.5 mb-2">{msg.toolCalls.map((tc, i) => (
                        <span key={i} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${tc.status === "done" ? "bg-accent/10 text-accent" : tc.status === "calling" ? "bg-ink/5 text-ink/30" : "bg-terracotta/10 text-terracotta"}`}>{tc.status === "calling" && <Loader2 className="w-2.5 h-2.5 animate-spin" />}{tc.status === "done" && <Check className="w-2.5 h-2.5" />}{availableTools.find(t => t.id === tc.tool)?.name || tc.tool}</span>
                      ))}</div>}
                      {msg.content && <div className="text-sm leading-relaxed text-ink/70 whitespace-pre-wrap">{msg.content.split("\n").map((line, i) => <p key={i} className={line.startsWith("**") ? "font-semibold text-ink mt-2 first:mt-0" : ""}>{line}</p>)}</div>}
                    </>}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="px-5 py-3 border-t border-border"><div className="flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Ask anything across your tools..." className="flex-1 bg-transparent border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-ink/15 focus:outline-none focus:border-accent/50 transition-colors" disabled={isProcessing} />
              <button onClick={() => handleSend()} disabled={isProcessing || !input.trim()} className="px-3 py-2.5 rounded-xl bg-accent text-white hover:bg-accent/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all">{isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</button>
            </div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
