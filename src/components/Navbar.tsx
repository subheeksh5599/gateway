"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = ["Features", "How It Works", "Pricing", "Docs"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const cb = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", cb); return () => window.removeEventListener("scroll", cb); }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? "bg-paper/95 backdrop-blur-xl border-b border-border" : ""}`}>
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        <a href="#" className="font-display text-xl font-semibold tracking-tight text-ink">Gateway</a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => <a key={l} href={`#${l.toLowerCase().replace(/\s/g,"-")}`} className="text-sm text-ink/50 hover:text-ink transition-colors">{l}</a>)}
          <a href="#" className="text-sm font-medium px-4 py-2 rounded-full bg-accent text-white hover:bg-accent/90 transition-colors">Add to Slack</a>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
      </div>
      {open && (
        <div className="md:hidden bg-surface px-8 py-4 space-y-3 border-t border-border">
          {links.map(l => <a key={l} href={`#${l.toLowerCase()}`} className="block text-sm text-ink/60">{l}</a>)}
          <a href="#" className="block text-sm font-medium px-4 py-2 rounded-full bg-accent text-white text-center">Add to Slack</a>
        </div>
      )}
    </nav>
  );
}
