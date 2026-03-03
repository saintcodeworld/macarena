"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Play, Flame } from "lucide-react";

export default function StatsBar() {
  const [totalViews, setTotalViews] = useState(14200000); // 14.2M initial views
  const [community, setCommunity] = useState(89400); // 89.4K initial community

  // Format number for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  // Organic growth simulation
  useEffect(() => {
    const growthInterval = setInterval(() => {
      setTotalViews(prev => {
        const growthRate = Math.random() * 0.003 + 0.001; // 0.1% to 0.4% growth
        const additionalViews = Math.floor(prev * growthRate);
        return prev + additionalViews;
      });
      
      setCommunity(prev => {
        const growthRate = Math.random() * 0.002 + 0.0005; // 0.05% to 0.25% growth
        const additionalMembers = Math.floor(prev * growthRate);
        return prev + additionalMembers;
      });
    }, Math.random() * 4000 + 1000); // Random interval between 1-5 seconds

    return () => clearInterval(growthInterval);
  }, []);

  const stats = [
    {
      icon: Play,
      label: "Total Views",
      value: formatNumber(totalViews),
      change: "+" + Math.floor(Math.random() * 200 + 300) + "%",
    },
    {
      icon: Users,
      label: "Community",
      value: formatNumber(community),
      change: "+" + Math.floor(Math.random() * 100 + 100) + "%",
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
      value: (Math.random() * 2 + 97).toFixed(1),
      change: "🔥 On Fire",
    },
  ];
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
