import { forwardRef } from "react";
import type { AnimalRecommendation } from "../../lib/gemini";
import { getAnimalImage } from "../../lib/gemini";
import { Zap, BookOpen, Heart, Users } from "lucide-react";

interface SpiritAnimalStoryCardProps {
  animalResult: AnimalRecommendation;
  userName?: string;
  lang?: "en" | "th";
  version?: 1 | 2;
}

const ANIMAL_THAI_NAMES: Record<string, string> = {
  Capybara: "พี่กะปิสุดชิลล์",
  RiverOtter: "นากน้อยจอมซน",
  Owl: "พี่ฮูกตาโต",
  Beaver: "บีเวอร์นักสร้าง",
};

const STAT_CONFIG: Record<
  string,
  { icon: any; color: string; gradient: string }
> = {
  actions: {
    icon: Zap,
    color: "#f59e0b",
    gradient: "linear-gradient(90deg, #f59e0b, #fbbf24)",
  },
  lessons: {
    icon: BookOpen,
    color: "#6366f1",
    gradient: "linear-gradient(90deg, #6366f1, #818cf8)",
  },
  wellness: {
    icon: Heart,
    color: "#10b981",
    gradient: "linear-gradient(90deg, #10b981, #34d399)",
  },
  relationship: {
    icon: Users,
    color: "#f43f5e",
    gradient: "linear-gradient(90deg, #f43f5e, #fb7185)",
  },
};

const STAT_THAI_NAMES: Record<string, string> = {
  actions: "ลงมือทำ",
  lessons: "บทเรียน",
  wellness: "สุขภาพ",
  relationship: "ความสัมพันธ์",
};

export const SpiritAnimalStoryCard = forwardRef<
  HTMLDivElement,
  SpiritAnimalStoryCardProps
>(({ animalResult, userName, lang = "en", version = 1 }, ref) => {
  const currentDate = new Date().getFullYear();

  // Select text based on language and version
  const description =
    lang === "en"
      ? version === 1
        ? animalResult.version1En
        : animalResult.version2En
      : version === 1
      ? animalResult.version1Th
      : animalResult.version2Th;

  // Extract the title part (before the colon) and the body
  const [, ...bodyParts] = description.split(":");
  const bodyText = bodyParts.join(":").trim(); // Rejoin in case there were other colons
  // const displayTitle = titlePart.trim(); // Unused, we use animalResult.title

  // Color theme based on animal (optional, can be expanded)
  // const themeColor = "#0a0a0a"; // Default black
  // const accentColor = "#a3a3a3"; // Default gray

  return (
    <div
      ref={ref}
      style={{
        width: "1080px",
        height: "1920px",
        backgroundColor: "#fafafa", // Slightly cleaner white
        backgroundImage: "linear-gradient(to bottom, #f3f4f6, #ffffff)",
        padding: "80px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Outfit', sans-serif",
        color: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* --- Website-themed Background Elements --- */}
      {/* Ambient Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-5%",
          left: "-10%",
          width: "60%",
          height: "40%",
          borderRadius: "50%",
          backgroundColor: "rgba(168, 85, 247, 0.15)", // Purple
          filter: "blur(120px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "-10%",
          width: "50%",
          height: "50%",
          borderRadius: "50%",
          backgroundColor: "rgba(45, 212, 191, 0.1)", // Teal
          filter: "blur(140px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "55%",
          height: "45%",
          borderRadius: "50%",
          backgroundColor: "rgba(244, 63, 94, 0.1)", // Rose
          filter: "blur(130px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-5%",
          right: "0%",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          backgroundColor: "rgba(251, 191, 36, 0.12)", // Gold/Yellow
          filter: "blur(110px)",
        }}
      />

      {/* Noise overlay texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative Snow Dots */}
      {[...Array(32)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${12 + Math.random() * 16}px`,
            height: `${12 + Math.random() * 16}px`,
            backgroundColor: "rgba(0, 0, 0, 0.025)",
            borderRadius: "50%",
            pointerEvents: "none",
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Festive Stars */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`star-${i}`}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${16 + Math.random() * 24}px`,
            color: "rgba(251, 191, 36, 0.2)",
            pointerEvents: "none",
          }}
        >
          ✨
        </div>
      ))}

      {/* Decorative background circles (original) */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          border: "2px solid rgba(0,0,0,0.02)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "1100px",
          height: "1100px",
          borderRadius: "50%",
          border: "2px solid rgba(0,0,0,0.03)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "64px", zIndex: 1 }}>
        <div
          style={{
            fontSize: "32px",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#737373",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <span>✨</span> {currentDate} Your Personality <span>✨</span>
        </div>
        {userName && (
          <div
            style={{
              fontSize: "44px",
              color: "#171717",
              fontWeight: 800,
              fontFamily: "'Fraunces', serif",
            }}
          >
            {userName}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "48px",
          zIndex: 1,
        }}
      >
        {/* Animal Image */}
        <div
          style={{
            position: "relative",
            width: "600px",
            height: "600px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              backgroundColor: "rgba(168, 85, 247, 0.08)", // Purple base glow
              transform: "scale(1.1) translateY(10px)",
              filter: "blur(40px)",
            }}
          />
          <img
            src={getAnimalImage(animalResult.animal)}
            alt={animalResult.animal}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%", // Circular for more "avatar/spiritual" look
              boxShadow: "0 32px 64px -16px rgba(168, 85, 247, 0.25)",
              border: "12px solid white",
              position: "relative",
              zIndex: 2,
            }}
          />
        </div>

        {/* Title & Description */}
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <div
            style={{
              fontSize: "72px",
              fontFamily: "'Fraunces', serif",
              color: "#0a0a0a",
              marginBottom: "24px",
              lineHeight: 1.1,
            }}
          >
            {lang === "th"
              ? ANIMAL_THAI_NAMES[animalResult.animal] || animalResult.title
              : animalResult.title}
          </div>
          <div
            style={{
              fontSize: "36px",
              lineHeight: "1.5",
              color: "#404040",
              maxWidth: "800px",
              margin: "0 auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {bodyText || description}
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            width: "100%",
            marginTop: "auto",
            padding: "56px",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            borderRadius: "48px",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            boxShadow: "0 32px 64px -16px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "48px 80px",
            }}
          >
            {Object.entries(animalResult.stats).map(([key, value]) => {
              const config = STAT_CONFIG[key] || {
                icon: Zap,
                color: "#404040",
                gradient: "linear-gradient(90deg, #404040, #737373)",
              };
              const Icon = config.icon;

              return (
                <div key={key} style={{ position: "relative" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          backgroundColor: `${config.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: config.color,
                        }}
                      >
                        <Icon size={24} strokeWidth={2.5} />
                      </div>
                      <span
                        style={{
                          fontSize: "26px",
                          fontWeight: 700,
                          color: "#171717",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {lang === "th" ? STAT_THAI_NAMES[key] || key : key}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "28px",
                        fontWeight: 800,
                        color: config.color,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {value}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "14px",
                      backgroundColor: "rgba(0,0,0,0.04)",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${value}%`,
                        background: config.gradient,
                        borderRadius: "999px",
                        boxShadow: `0 0 12px ${config.color}40`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "64px",
          textAlign: "center",
          fontSize: "28px",
          color: "#737373",
          zIndex: 1,
          fontWeight: 600,
          letterSpacing: "0.05em",
        }}
      >
        ❄ Season's Reflections • Thrive ❄
      </div>
    </div>
  );
});

SpiritAnimalStoryCard.displayName = "SpiritAnimalStoryCard";
