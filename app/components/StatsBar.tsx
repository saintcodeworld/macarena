"use client";

import { TrendingUp, Users, Play, Flame } from "lucide-react";

const stats = [
  {
    icon: Play,
    label: "Total Views",
    value: "14.2M",
    change: "+342%",
  },
  {
    icon: Users,
    label: "Community",
    value: "89.4K",
    change: "+128%",
  },
  {
    icon: TrendingUp,
    label: "Trending Rank",
    value: "#1",
    change: "Worldwide",
  },
  {
    icon: Flame,
    label: "Viral Score",
    value: "98.7",
    change: "🔥 On Fire",
  },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
          <div className="text-2xl font-black text-foreground">{stat.value}</div>
          <div className="text-xs text-accent font-semibold mt-1">
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  );
}
