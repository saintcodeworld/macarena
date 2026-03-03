"use client";

import { TrendingUp, HelpCircle, X } from "lucide-react";
import { useState, useRef } from "react";
import MacarenaGame from "./MacarenaGame";

export default function Hero() {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const gameRef = useRef<{ openGame: () => void } | null>(null);

  return (
    <>
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold px-4 py-2 rounded-full mb-6">
            <TrendingUp className="w-3.5 h-3.5" />
            #1 TRENDING WORLDWIDE
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4">
            <span className="text-foreground">The </span>
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Macarena
            </span>
            <br />
            <span className="text-foreground">Is Back</span>
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Play the Macarena Piano Tiles game and win 0.5 SOL! Tap the tiles as they fall, survive the full song, and claim your reward.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => gameRef.current?.openGame()}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-lg"
            >
              🎮 Play & Win 0.5 SOL
            </button>
            <button
              onClick={() => setShowHowToPlay(true)}
              className="flex items-center gap-2 bg-card border border-border hover:border-primary/40 text-foreground font-medium px-8 py-3.5 rounded-full transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-primary" />
              How to Play
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 text-xs text-muted">
            <span>
              🎵 <span className="font-semibold text-foreground">3:44</span> Song
            </span>
            <span className="w-1 h-1 bg-border rounded-full" />
            <span>
              ❤️ <span className="font-semibold text-foreground">3</span> Lives
            </span>
            <span className="w-1 h-1 bg-border rounded-full" />
            <span>
              💰 <span className="font-semibold text-foreground">0.5 SOL</span> Reward
            </span>
          </div>
        </div>
      </section>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black/95 z-40 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-black/50">
              <h2 className="text-xl font-black text-white">How to Play</h2>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <h3 className="text-sm font-black text-pink-400 mb-2">🎮 GAMEPLAY</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Tap the colored tiles as they fall down the screen. You have 3 lanes (left, middle, right). Hit each tile in the glowing hit zone at the bottom for points.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-black text-purple-400 mb-2">⌨️ CONTROLS</h3>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• <span className="font-bold">Mouse/Touch:</span> Click on lanes</li>
                  <li>• <span className="font-bold">Arrow Keys:</span> ← ↓ →</li>
                  <li>• <span className="font-bold">Keyboard:</span> A/D, S/F, L/K</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-black text-cyan-400 mb-2">❤️ LIVES & DIFFICULTY</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  You start with 3 lives. Miss 3 tiles and it's game over. The game gets progressively harder and faster as the song plays. Speed increases from 1x to 2.5x by the end.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-black text-yellow-400 mb-2">🏆 WINNING & REWARDS</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Complete the entire 3:44 Macarena song without losing all 3 lives to win! You'll earn 0.5 SOL. After winning, enter your Solana wallet address to claim your reward.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-black text-green-400 mb-2">⭐ SCORING</h3>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• <span className="text-yellow-400 font-bold">PERFECT:</span> 150 pts</li>
                  <li>• <span className="text-green-400 font-bold">GREAT:</span> 100 pts</li>
                  <li>• <span className="text-blue-400 font-bold">GOOD:</span> 50 pts</li>
                  <li>• <span className="font-bold">Combo Bonus:</span> +20 pts every 10 hits</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-black text-pink-400 mb-2">💡 TIPS</h3>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Focus on the hit zone (glowing area at bottom)</li>
                  <li>• Keep your combo going for bonus points</li>
                  <li>• The song gets much harder after 2 minutes</li>
                  <li>• Practice makes perfect!</li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 bg-black/50">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:scale-105 transition-transform"
              >
                Got It! Let's Play
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Component */}
      <MacarenaGame ref={gameRef} />
    </>
  );
}
