const links = {
  Product: ["Features", "Pricing", "Changelog", "Documentation", "API Reference"],
  Resources: ["MCP Protocol", "Server Directory", "Templates", "Blog", "Community"],
  Company: ["About", "Careers", "Contact", "Privacy", "Terms"],
};

export default function Footer() {
  return (
    <footer className="py-20 px-8 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="font-display text-xl font-semibold tracking-tight text-ink mb-4 block">Gateway</a>
            <p className="text-sm text-ink/30 leading-relaxed max-w-xs">Connect every tool to Slack through a single MCP-powered agent.</p>
          </div>
          {Object.entries(links).map(([cat, items]) => (
            <div key={cat}><h4 className="text-xs font-mono text-ink/25 uppercase tracking-wider mb-4">{cat}</h4>
              <ul className="space-y-2.5">{items.map(l => <li key={l}><a href="#" className="text-sm text-ink/40 hover:text-ink transition-colors">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-border"><p className="text-xs text-ink/25">© 2026 Gateway. Built for the Slack Agent Builder Challenge.</p></div>
      </div>
    </footer>
  );
}
