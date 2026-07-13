import { Zap } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Documentation", "API Reference"],
  Resources: ["MCP Protocol", "Server Directory", "Templates", "Blog", "Community"],
  Company: ["About", "Careers", "Contact", "Privacy", "Terms"],
};

export default function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 font-display font-bold text-lg tracking-tight mb-4">
              <Zap className="w-5 h-5 text-signal" />
              Gateway
            </a>
            <p className="text-sm text-paper/40 leading-relaxed max-w-xs">
              Connect every tool to Slack through a single MCP-powered agent.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-mono text-paper/30 uppercase tracking-wider mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-paper/50 hover:text-paper transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-paper/30">© 2026 Gateway. Built for the Slack Agent Builder Challenge.</p>
          <p className="text-xs text-paper/30">
            Based on{" "}
            <a href="https://www.ycombinator.com/companies/strata" className="text-paper/50 hover:text-signal transition-colors">
              Strata (YC P25)
            </a>{" "}
            +{" "}
            <a href="https://colosseum.com/companies" className="text-paper/50 hover:text-signal transition-colors">
              MCPay (Colosseum)
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
