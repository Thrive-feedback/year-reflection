import { Button } from "../components/atoms/Button";
import { Sparkles, ArrowRight } from "lucide-react";

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-fade-in px-4 py-3 mt-12">
      {/* Visual Element */}
      <div className="relative group">
        <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full animate-pulse group-hover:bg-purple-500/30 transition-all duration-700" />
        <div className="relative glass-panel p-8 rounded-[3rem] border-white/60 shadow-2xl shadow-purple-500/10">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden animate-float">
            <img
              src="/images/logo/thrive_logo.png"
              alt="Thrive Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Hero Text */}
      <div className="space-y-6 max-w-lg">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-bold uppercase tracking-widest animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <Sparkles className="w-3 h-3" />
          <span>from thrive.team</span>
        </div>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-fraunces font-extrabold text-neutral-900 leading-[1.1] tracking-tight animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          What Kind of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            Spirit Animal
          </span>{" "}
          were you in 2025?
        </h1>
        <p
          className="text-lg text-neutral-500 font-medium leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          Reflect on your journey through 5 meaningful questions and let AI
          reveal your inner nature.
        </p>
      </div>

      {/* Action */}
      <div
        className="w-full max-w-sm animate-slide-up"
        style={{ animationDelay: "0.6s" }}
      >
        <Button
          onClick={onStart}
          iconRight={
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          }
          className="w-full h-16 text-lg bg-neutral-900 text-white hover:bg-neutral-800 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group border-none"
        >
          Begin Your Reflection
        </Button>
        <p className="mt-4 text-sm text-neutral-400 font-semibold tracking-wider uppercase">
          Takes about 2 minutes
        </p>
      </div>

      {/* Subtle Background Animal Silhouettes (Optional visual flair) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03] z-[-1]">
        <div
          className="absolute top-1/4 left-1/4 animate-float text-8xl"
          style={{ animationDelay: "1s" }}
        >
          🦉
        </div>
        <div
          className="absolute top-1/3 right-1/4 animate-float text-8xl"
          style={{ animationDelay: "3s", animationDuration: "8s" }}
        >
          🦦
        </div>
        <div
          className="absolute bottom-1/4 left-1/3 animate-float text-8xl"
          style={{ animationDelay: "5s", animationDuration: "10s" }}
        >
          🦫
        </div>
        <div
          className="absolute bottom-1/3 right-1/3 animate-float text-8xl"
          style={{ animationDelay: "2s", animationDuration: "7s" }}
        >
          🦦
        </div>
      </div>
    </div>
  );
}
