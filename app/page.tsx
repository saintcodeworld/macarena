import VideoGrid from "./components/VideoGrid";
import Ticker from "./components/Ticker";
import StatsBar from "./components/StatsBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Ticker />
      <Hero />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <StatsBar />

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-foreground">
                🔥 Viral Trending Videos
              </h2>
              <p className="text-sm text-muted mt-1">
                The Macarena soundtrack over the current world events — pure internet gold
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/20">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              LIVE • 33 Videos
            </span>
          </div>
          <VideoGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
