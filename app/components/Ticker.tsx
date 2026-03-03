"use client";

export default function Ticker() {
  const items = [
    "🔥 $MMGA TRENDING #1",
    "💰 MARKET CAP MOONING",
    "🎵 MMGA x WAR EDITS GOING VIRAL",
    "📈 33 VIRAL CLIPS AND COUNTING",
    "🌍 THE SOUND OF THE CURRENT ERA",
    "💎 DIAMOND HANDS ONLY",
    "🚀 TO THE MOON",
    "⚡ US vs IRAN — MMGA PLAYS ON",
    "🎶 MAKE MACARENA GREAT AGAIN!",
  ];

  const tickerContent = [...items, ...items].join("   •   ");

  return (
    <div className="w-full overflow-hidden bg-primary/10 border-y border-primary/20 py-2.5">
      <div className="animate-ticker whitespace-nowrap">
        <span className="text-sm font-bold text-primary tracking-wide">
          {tickerContent}
        </span>
      </div>
    </div>
  );
}
