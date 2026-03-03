"use client";

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { Music, Trophy, X, Zap, Heart } from "lucide-react";

const NUM_LANES = 3;
const BPM = 140;
const BEAT_INTERVAL = 60000 / BPM; // ~428ms per beat

interface Tile {
  id: number;
  lane: number;
  y: number;
  beatTime: number;
}

// ---------- BEAT MAP ----------
// Full Make Macarena Great Again instrumental (~224s, ~140 BPM = ~428ms per beat).
// Enhanced beat map with better music synchronization and aggressive difficulty scaling
function generateBeatMap(): [number, number][] {
  const beats: [number, number][] = [];
  let prevLane = -1;

  const addBeat = (t: number) => {
    let lane: number;
    let attempt = 0;
    do {
      lane = Math.floor(Math.abs(Math.sin(t * 0.0073 + beats.length * 1.7 + attempt * 2.3)) * NUM_LANES);
      attempt++;
    } while (lane === prevLane && attempt < 3);
    prevLane = lane;
    beats.push([t, lane]);
  };

  // Phase 1: Intro (0-16s) — gentle warmup, every beat
  for (let t = 2000; t < 16000; t += BEAT_INTERVAL) addBeat(t);

  // Phase 2: Verse 1 (16-40s) — every beat + occasional off-beats
  for (let t = 16000; t < 40000; t += BEAT_INTERVAL) {
    addBeat(t);
    if (Math.sin(t * 0.005) > 0.6) addBeat(t + BEAT_INTERVAL / 2);
  }

  // Phase 3: Chorus 1 (40-72s) — every beat + frequent off-beats
  for (let t = 40000; t < 72000; t += BEAT_INTERVAL) {
    addBeat(t);
    if (Math.sin(t * 0.004) > 0.3) addBeat(t + BEAT_INTERVAL / 2);
  }

  // Phase 4: Verse 2 (72-104s) — dense, some triplets
  for (let t = 72000; t < 104000; t += BEAT_INTERVAL) {
    addBeat(t);
    addBeat(t + BEAT_INTERVAL / 2);
    if (Math.sin(t * 0.003) > 0.5) addBeat(t + BEAT_INTERVAL / 3);
  }

  // Phase 5: Chorus 2 (104-140s) — very dense with double beats
  for (let t = 104000; t < 140000; t += BEAT_INTERVAL * 0.75) {
    addBeat(t);
    if (Math.sin(t * 0.006) > 0.2) addBeat(t + BEAT_INTERVAL * 0.375);
  }

  // Phase 6: Bridge (140-170s) — rapid fire with syncopation
  for (let t = 140000; t < 170000; t += BEAT_INTERVAL * 0.6) {
    addBeat(t);
    if (Math.sin(t * 0.007) > 0.4) addBeat(t + BEAT_INTERVAL * 0.3);
  }

  // Phase 7: Final Chorus (170-210s) — insane density with bursts
  for (let t = 170000; t < 210000; t += BEAT_INTERVAL * 0.5) {
    addBeat(t);
    if (Math.sin(t * 0.008) > 0.3) addBeat(t + BEAT_INTERVAL * 0.25);
    // Add occasional triple bursts
    if (Math.random() > 0.7) {
      addBeat(t + BEAT_INTERVAL * 0.125);
      addBeat(t + BEAT_INTERVAL * 0.25);
    }
  }

  // Phase 8: Outro (210-222s) — cool down but still challenging
  for (let t = 210000; t < 222000; t += BEAT_INTERVAL * 0.8) {
    addBeat(t);
  }

  // Sort & dedupe close beats
  beats.sort((a, b) => a[0] - b[0]);
  const filtered: [number, number][] = [beats[0]];
  for (let i = 1; i < beats.length; i++) {
    if (beats[i][0] - filtered[filtered.length - 1][0] >= 80) {
      filtered.push(beats[i]);
    }
  }
  return filtered;
}

const BEAT_MAP = generateBeatMap();
const SONG_DURATION = 224000;
const HIT_ZONE_TOP = 76;
const HIT_ZONE_BOTTOM = 92;
const MAX_LIVES = 3;

const LANE_COLORS = [
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-600",
  "from-cyan-400 to-blue-600",
];
const LANE_BG = [
  "bg-pink-500",
  "bg-violet-500",
  "bg-cyan-400",
];
const LANE_GLOW = [
  "shadow-pink-500/50",
  "shadow-violet-500/50",
  "shadow-cyan-400/50",
];

const MMGAGameComponent = forwardRef<{ openGame: () => void }, {}>(function MMGAGame(_, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [beatPulse, setBeatPulse] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [flashLane, setFlashLane] = useState<number | null>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [hitFx, setHitFx] = useState<{ id: number; lane: number; type: string } | null>(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletSubmitted, setWalletSubmitted] = useState(false);

  useImperativeHandle(ref, () => ({
    openGame: () => setIsOpen(true),
  }));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const gameStartRef = useRef(0);
  const tileIdRef = useRef(0);
  const spawnedUpToRef = useRef(0);
  const tilesRef = useRef<Tile[]>([]);
  const livesRef = useRef(MAX_LIVES);
  const gsRef = useRef<"idle" | "playing" | "won" | "lost">("idle");
  const comboRef = useRef(0);
  const scoreRef = useRef(0);

  useEffect(() => { tilesRef.current = tiles; }, [tiles]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { gsRef.current = gameState; }, [gameState]);
  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const stopGame = useCallback((result: "won" | "lost") => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setGameState(result);
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(MAX_LIVES);
    setSpeed(1);
    setProgress(0);
    setTiles([]);
    setFlashLane(null);
    setHitFx(null);
    tileIdRef.current = 0;
    spawnedUpToRef.current = 0;
    livesRef.current = MAX_LIVES;
    tilesRef.current = [];
    comboRef.current = 0;
    scoreRef.current = 0;

    if (!audioRef.current) {
      audioRef.current = new Audio("/macarena.mp3");
    }
    audioRef.current.currentTime = 0;
    audioRef.current.volume = 0.75;
    audioRef.current.play().catch(() => {});

    gameStartRef.current = performance.now();
    setGameState("playing");

    const loop = (now: number) => {
      if (gsRef.current !== "playing") return;

      const elapsed = now - gameStartRef.current;

      // Speed: increases by 0.5x every 10 seconds
      const elapsedSeconds = elapsed / 1000;
      const currentSpeed = 1 + (Math.floor(elapsedSeconds / 10) * 0.5);
      setSpeed(currentSpeed);
      setProgress(Math.min(100, (elapsed / SONG_DURATION) * 100));
      
      // Update difficulty level based on speed
      const newLevel = Math.floor((currentSpeed - 1) / 0.5) + 1;
      setDifficultyLevel(newLevel);
      
      // Beat pulse effect for visual synchronization
      const currentBeat = Math.floor(elapsed / BEAT_INTERVAL);
      if (currentBeat !== Math.floor((elapsed - 16) / BEAT_INTERVAL)) {
        setBeatPulse(true);
        setTimeout(() => setBeatPulse(false), 100);
      }

      // Spawn tiles
      const travelMs = 1600 / currentSpeed;
      while (spawnedUpToRef.current < BEAT_MAP.length) {
        const [beatTime, lane] = BEAT_MAP[spawnedUpToRef.current];
        if (elapsed >= beatTime - travelMs) {
          tilesRef.current = [...tilesRef.current, {
            id: tileIdRef.current++,
            lane,
            y: -8,
            beatTime,
          }];
          spawnedUpToRef.current++;
        } else {
          break;
        }
      }

      // Move tiles
      const step = 0.18 * currentSpeed;
      const updated: Tile[] = [];
      let lost = 0;
      for (const tile of tilesRef.current) {
        const newY = tile.y + step;
        if (newY > 100) {
          lost++;
          continue;
        }
        updated.push({ ...tile, y: newY });
      }

      if (lost > 0) {
        livesRef.current = Math.max(0, livesRef.current - lost);
        setLives(livesRef.current);
        comboRef.current = 0;
        setCombo(0);
        if (livesRef.current <= 0) {
          tilesRef.current = updated;
          setTiles(updated);
          stopGame("lost");
          return;
        }
      }

      tilesRef.current = updated;
      setTiles(updated);

      // Win check
      if (spawnedUpToRef.current >= BEAT_MAP.length && updated.length === 0) {
        stopGame("won");
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [stopGame]);

  const handleLaneClick = useCallback((lane: number) => {
    if (gsRef.current !== "playing") return;

    const hittable = tilesRef.current
      .filter((t) => t.lane === lane && t.y >= HIT_ZONE_TOP - 5 && t.y <= HIT_ZONE_BOTTOM)
      .sort((a, b) => b.y - a.y);

    if (hittable.length > 0) {
      const hit = hittable[0];
      tilesRef.current = tilesRef.current.filter((t) => t.id !== hit.id);
      setTiles([...tilesRef.current]);

      const center = (HIT_ZONE_TOP + HIT_ZONE_BOTTOM) / 2;
      const dist = Math.abs(hit.y - center);
      let label = "PERFECT";
      let pts = 150;
      if (dist > 5) { label = "GREAT"; pts = 100; }
      if (dist > 9) { label = "GOOD"; pts = 50; }

      const newCombo = comboRef.current + 1;
      const comboBonus = Math.floor(newCombo / 10) * 20;
      const total = pts + comboBonus;

      scoreRef.current += total;
      setScore(scoreRef.current);
      comboRef.current = newCombo;
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));

      setFlashLane(lane);
      setHitFx({ id: hit.id, lane, type: label });
      setTimeout(() => { setFlashLane(null); setHitFx(null); }, 200);
    }
  }, []);

  useEffect(() => {
    const keyMap: Record<string, number> = {
      ArrowLeft: 0, a: 0, A: 0, d: 0, D: 0,
      ArrowDown: 1, s: 1, S: 1, f: 1, F: 1,
      ArrowRight: 2, l: 2, L: 2, k: 2, K: 2,
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key in keyMap) {
        e.preventDefault();
        handleLaneClick(keyMap[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleLaneClick]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, []);

  const handleClose = () => {
    if (gameState === "playing") stopGame("lost");
    setGameState("idle");
    setIsOpen(false);
    setWalletAddress("");
    setWalletSubmitted(false);
  };

  const handleWalletSubmit = () => {
    if (walletAddress.trim().length < 32) {
      alert("Please enter a valid Solana wallet address");
      return;
    }
    setWalletSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2 font-bold text-sm z-50 group hover:scale-105"
      >
        <Music className="w-5 h-5 group-hover:animate-bounce" />
        <span className="hidden sm:inline">MMGA Tiles</span>
        <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full text-[10px] font-black">
          WIN {speed >= 3.5 ? "1.0" : "0.5"} SOL
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2">
      <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden" style={{ height: "min(95vh, 750px)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-black/50 shrink-0">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-purple-400" />
            <h2 className="text-base font-black text-white">MMGA Tiles</h2>
            <span className="bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded-full text-[9px] font-black border border-yellow-400/30">
              {speed >= 3.5 ? "1.0" : "0.5"} SOL
            </span>
          </div>
          <button onClick={handleClose} className="text-gray-600 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Idle Screen */}
        {gameState === "idle" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-3">🎹</div>
            <h3 className="text-xl font-black text-white mb-1">Piano Tiles Challenge</h3>
            <p className="text-gray-500 mb-5 text-xs max-w-[280px]">
              Tap the tiles as they reach the zone. Only 3 lives — miss 3 and you're out.
              Survive the full MMGA to claim 0.5 SOL!
            </p>
            <div className="flex gap-2 mb-4">
              {["←", "↓", "→"].map((arrow, i) => (
                <div key={i} className={`w-16 h-16 rounded-xl bg-gradient-to-b ${LANE_COLORS[i]} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                  {arrow}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 text-red-400 text-xs font-bold mb-1">
              <Heart className="w-3 h-3 fill-red-400" /> <Heart className="w-3 h-3 fill-red-400" /> <Heart className="w-3 h-3 fill-red-400" /> Only 3 lives!
            </div>
            <p className="text-pink-400/70 text-[10px] font-bold mb-5 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Speed increases throughout the song
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-transform shadow-xl"
            >
              PLAY
            </button>
          </div>
        )}

        {/* Result Screen */}
        {(gameState === "won" || gameState === "lost") && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            {gameState === "won" && !walletSubmitted ? (
              <>
                <Trophy className="w-16 h-16 text-yellow-400 mb-2 animate-bounce" />
                <h3 className="text-2xl font-black text-yellow-400 mb-1">YOU WON!</h3>
                <p className="text-white text-sm mb-4">You've earned <span className="text-yellow-400 font-black">{speed >= 3.5 ? "1.0 SOL" : "0.5 SOL"}</span></p>
                <div className="bg-gray-900/80 rounded-xl p-4 mb-5 w-full max-w-[260px] border border-gray-800 text-sm">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-500">Score</span>
                    <span className="text-white font-bold">{score.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-500">Max Combo</span>
                    <span className="text-purple-400 font-bold">{maxCombo}x</span>
                  </div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-500">Top Speed</span>
                    <span className="text-pink-400 font-bold">{speed.toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-cyan-400 font-bold">{Math.floor(progress)}%</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-4">Enter your Solana wallet address to receive your reward:</p>
                <input
                  type="text"
                  placeholder="Enter Solana wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full max-w-[260px] px-3 py-2 mb-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleWalletSubmit}
                  className={`w-full max-w-[260px] px-6 py-3 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-transform shadow-xl mb-2 ${
                    speed >= 3.5 
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black" 
                      : "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  }`}
                >
                  CLAIM {speed >= 3.5 ? "1.0 SOL" : "0.5 SOL"}
                </button>
                <button
                  onClick={startGame}
                  className="w-full max-w-[260px] bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors"
                >
                  Play Again
                </button>
              </>
            ) : walletSubmitted ? (
              <>
                <div className="text-5xl mb-3 animate-bounce">✨</div>
                <h3 className="text-2xl font-black text-green-400 mb-2">REWARD SENT!</h3>
                <p className="text-gray-400 text-xs mb-4">You've earned <span className="text-yellow-400 font-black">{speed >= 3.5 ? "1.0 SOL" : "0.5 SOL"}</span></p>
                <p className="text-white text-[10px] font-mono bg-gray-900 px-3 py-2 rounded-lg mb-4 break-all max-w-[260px]">
                  {walletAddress}
                </p>
                <p className="text-gray-500 text-xs">Check your wallet in a few moments!</p>
                <div className="mt-3 text-center">
                  <span className={`text-xs font-bold ${
                    speed >= 3.5 ? "text-yellow-400" : "text-gray-400"
                  }`}>
                    {speed >= 3.5 ? "🏆 MASTER MODE COMPLETED" : "✨ STANDARD MODE COMPLETED"}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl mb-2">💀</div>
                <h3 className="text-2xl font-black text-red-400 mb-1">GAME OVER</h3>
                <p className="text-gray-500 text-xs mb-4">You ran out of lives. Try again!</p>
                <div className="bg-gray-900/80 rounded-xl p-4 mb-5 w-full max-w-[260px] border border-gray-800 text-sm">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-500">Score</span>
                    <span className="text-white font-bold">{score.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-500">Max Combo</span>
                    <span className="text-purple-400 font-bold">{maxCombo}x</span>
                  </div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-500">Top Speed</span>
                    <span className="text-pink-400 font-bold">{speed.toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-cyan-400 font-bold">{Math.floor(progress)}%</span>
                  </div>
                </div>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-transform shadow-xl"
                >
                  TRY AGAIN
                </button>
              </>
            )}
          </div>
        )}

        {/* Playing */}
        {gameState === "playing" && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* HUD */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-black/60 text-[11px] border-b border-gray-800/50 shrink-0">
              <div className="text-white font-bold">{score.toLocaleString()}</div>
              <div className="text-purple-400 font-bold">{combo}x</div>
              <div className="flex items-center gap-0.5 text-pink-400 font-bold">
                <Zap className="w-3 h-3" />{speed.toFixed(1)}x
              </div>
              <div className={`text-xs font-bold transition-all duration-100 ${
                beatPulse ? "text-cyan-400 scale-110" : "text-gray-400"
              }`}>
                Level {difficultyLevel}
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                  <Heart key={i} className={`w-3.5 h-3.5 ${i < lives ? "text-red-500 fill-red-500" : "text-gray-700"}`} />
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="h-0.5 bg-gray-900 shrink-0">
              <div className={`h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 transition-all duration-200 ${
                beatPulse ? "shadow-lg shadow-cyan-400/50" : ""
              }`} style={{ width: `${progress}%` }} />
            </div>

            {/* Game Board */}
            <div className="flex-1 relative select-none overflow-hidden bg-gray-950 min-h-0">
              {/* Lanes */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: NUM_LANES }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 relative cursor-pointer transition-colors duration-75 ${
                      flashLane === i ? "bg-white/[0.08]" : ""
                    } ${i < NUM_LANES - 1 ? "border-r border-gray-800/40" : ""}`}
                    onClick={() => handleLaneClick(i)}
                  />
                ))}
              </div>

              {/* Hit zone */}
              <div
                className={`absolute left-0 right-0 pointer-events-none transition-all duration-100 ${
                  beatPulse ? "bg-white/[0.08]" : ""
                }`}
                style={{ top: `${HIT_ZONE_TOP}%`, height: `${HIT_ZONE_BOTTOM - HIT_ZONE_TOP}%` }}
              >
                <div className={`absolute inset-0 border-y border-white/10 transition-all duration-100 ${
                  beatPulse ? "bg-white/[0.08] border-white/20" : "bg-white/[0.03]"
                }`} />
                <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-cyan-400/40 transition-all duration-100 ${
                  beatPulse ? "from-pink-500/80 via-purple-500/80 to-cyan-400/80" : ""
                }`} />
              </div>

              {/* Hit FX */}
              {hitFx && (
                <div
                  className="absolute pointer-events-none z-20 animate-ping"
                  style={{
                    left: `${(hitFx.lane / NUM_LANES) * 100 + 100 / NUM_LANES / 2}%`,
                    top: `${(HIT_ZONE_TOP + HIT_ZONE_BOTTOM) / 2}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span className={`text-xs font-black ${hitFx.type === "PERFECT" ? "text-yellow-400" : hitFx.type === "GREAT" ? "text-green-400" : "text-blue-400"}`}>
                    {hitFx.type}
                  </span>
                </div>
              )}

              {/* Tiles */}
              {tiles.map((tile) => (
                <div
                  key={tile.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${(tile.lane / NUM_LANES) * 100}%`,
                    top: `${tile.y}%`,
                    width: `${100 / NUM_LANES}%`,
                  }}
                >
                  <div className={`mx-0.5 h-12 rounded-md bg-gradient-to-b ${LANE_COLORS[tile.lane]} shadow-md ${LANE_GLOW[tile.lane]} flex items-center justify-center border border-white/10 transition-all duration-100 ${
                    beatPulse ? "scale-105 brightness-125" : ""
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile buttons */}
            <div className="flex border-t border-gray-800 shrink-0 sm:hidden">
              {Array.from({ length: NUM_LANES }).map((_, i) => (
                <button
                  key={i}
                  onPointerDown={() => handleLaneClick(i)}
                  className={`flex-1 h-14 ${LANE_BG[i]} active:brightness-150 transition-all flex items-center justify-center text-white font-black text-xl ${i < NUM_LANES - 1 ? "border-r border-white/10" : ""}`}
                >
                  {["←", "↓", "→"][i]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default MMGAGameComponent;
