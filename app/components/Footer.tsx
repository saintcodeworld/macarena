"use client";

import { Music, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer id="about" className="border-t border-border bg-card/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black">
                  <span className="text-primary">$</span>MACARENA
                </h3>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              The Macarena is the soundtrack of the current era. A cultural
              phenomenon turned memecoin. This is more than music — it&apos;s a
              movement.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted">
              Quick Links
            </h4>
            <div className="space-y-2">
              <a
                href="#videos"
                className="block text-sm text-muted hover:text-foreground transition-colors"
              >
                Watch Videos
              </a>
              <a
                href="#"
                className="block text-sm text-muted hover:text-foreground transition-colors"
              >
                Buy $MACARENA
              </a>
              <a
                href="#"
                className="block text-sm text-muted hover:text-foreground transition-colors"
              >
                Tokenomics
              </a>
              <a
                href="#"
                className="block text-sm text-muted hover:text-foreground transition-colors"
              >
                Roadmap
              </a>
            </div>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted">
              Community
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary/40 hover:text-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-muted">
              Join our community for the latest updates, new viral drops, and
              $MACARENA alpha.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © 2026 $MACARENA. All rights reserved. Not financial advice.
          </p>
          <p className="text-xs text-muted">
            🎵 Hey Macarena! 💃
          </p>
        </div>
      </div>
    </footer>
  );
}
