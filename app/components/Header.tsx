"use client";

import { Music, Rocket, ExternalLink } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">
                <span className="text-primary">$</span>MMGA
              </h1>
              <p className="text-[10px] text-muted uppercase tracking-widest">
                Viral Dashboard
              </p>
            </div>
          </div>

          {/* Contract Address */}
          <div className="hidden lg:flex items-center">
            <span className="text-xs text-muted font-mono bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20">
              4LQTq4LAmPVZ3Krk5Yd1Uck616kEq2RQeaXRVdGupump
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#videos" className="text-sm text-muted hover:text-foreground transition-colors">
              Videos
            </a>
            <a href="#about" className="text-sm text-muted hover:text-foreground transition-colors">
              About
            </a>
            <a
              href="https://pump.fun/coin/4LQTq4LAmPVZ3Krk5Yd1Uck616kEq2RQeaXRVdGupump"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors"
            >
              <Rocket className="w-4 h-4" />
              Buy $MMGA
            </a>
          </nav>

          {/* Mobile CTA */}
          <a
            href="https://pump.fun/coin/4LQTq4LAmPVZ3Krk5Yd1Uck616kEq2RQeaXRVdGupump"
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
          >
            <Rocket className="w-3.5 h-3.5" />
            Buy
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
}
