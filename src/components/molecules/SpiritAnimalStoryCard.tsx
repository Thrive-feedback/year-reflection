import { forwardRef } from "react";
import type { AnimalRecommendation } from "../../lib/gemini";
import { getAnimalImage } from "../../lib/gemini";

interface SpiritAnimalStoryCardProps {
  animalResult: AnimalRecommendation;
  userName?: string;
  lang?: "en" | "th";
  version?: 1 | 2;
}

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
        backgroundColor: "#f5f3ef", // Soft warm background
        backgroundImage:
          "radial-gradient(circle at 50% 0%, #ffffff 0%, #f5f3ef 70%)",
        padding: "80px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Outfit', sans-serif",
        color: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          border: "2px solid rgba(0,0,0,0.03)",
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
          }}
        >
          {currentDate} Your Personality
        </div>
        {userName && (
          <div style={{ fontSize: "36px", color: "#0a0a0a", fontWeight: 500 }}>
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
              backgroundColor: "#E6E2D6", // Slightly darker than bg
              transform: "scale(0.95) translateY(20px)",
            }}
          />
          <img
            src={getAnimalImage(animalResult.animal)}
            alt={animalResult.animal}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "40px",
              boxShadow: "0 24px 48px -12px rgba(0,0,0,0.15)",
              transform: "rotate(-2deg)",
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
            {animalResult.title}
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
            padding: "48px",
            backgroundColor: "rgba(255,255,255,0.6)",
            borderRadius: "32px",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px 64px",
            }}
          >
            {Object.entries(animalResult.stats).map(([key, value]) => (
              <div key={key}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    fontSize: "24px",
                    fontWeight: 600,
                    textTransform: "capitalize",
                    color: "#404040",
                  }}
                >
                  <span>{key}</span>
                  <span>{value}%</span>
                </div>
                <div
                  style={{
                    height: "12px",
                    backgroundColor: "rgba(0,0,0,0.05)",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${value}%`,
                      backgroundColor: "#0a0a0a",
                      borderRadius: "999px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "64px",
          textAlign: "center",
          fontSize: "24px",
          color: "#a3a3a3",
          zIndex: 1,
        }}
      >
        floatnarue / year-reflection
      </div>
    </div>
  );
});

SpiritAnimalStoryCard.displayName = "SpiritAnimalStoryCard";
