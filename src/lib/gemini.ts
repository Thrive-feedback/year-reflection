import { GoogleGenAI } from "@google/genai";
import type { Reflection } from "../App";

const ANIMALS = ["Capybara", "RiverOtter", "Owl", "Beaver"] as const;
type Animal = (typeof ANIMALS)[number];

export interface AnimalRecommendation {
  animal: Animal;
  title: string;
  version1En: string;
  version1Th: string;
  version2En: string;
  version2Th: string;
  stats: {
    execution: number;
    strategy: number;
    resilience: number;
    connection: number;
  };
}

/**
 * Analyzes user's year reflections and suggests which animal best represents them
 * @param reflections - Array of user's reflections
 * @param apiKey - Gemini API key
 * @returns Animal recommendation with reason (max 200 chars)
 */
export async function getAnimalRecommendation(
  reflections: Reflection[],
  apiKey: string
): Promise<AnimalRecommendation> {
  if (!apiKey) {
    throw new Error("Gemini API key is required");
  }

  if (!reflections || reflections.length === 0) {
    throw new Error("No reflections provided");
  }

  const cleanApiKey = apiKey.trim();

  if (!/^[\x00-\x7F]*$/.test(cleanApiKey)) {
    throw new Error("API key contains invalid characters");
  }

  const ai = new GoogleGenAI({
    apiKey: cleanApiKey,
  });

  const reflectionSummary = reflections
    .map((r, idx) => {
      return `${idx + 1}. Topic: ${r.topic}\n   Reflection: ${r.text}`;
    })
    .join("\n\n");

  const prompt = `Based on these year reflections from a person, choose ONE animal from this list that best represents them in an "Office Ecosystem" context: ${ANIMALS.join(
    ", "
  )}.

Reflections:
${reflectionSummary}

THE CONCEPT: "The Reflection Styles"
Analyze their text to see how they handled stress, wins, and teamwork. We want to assign them a reflection style archetype using an animal.

Archetypes (Choose ONE of these 4):
1. Capybara -> "The Zen Reflection": Peaceful introspection. They are looking back at the year and feeling good about maintaining their inner peace.
2. RiverOtter -> "The Memory Collector": Nostalgia and connection. They are looking back on the people and the moments, not just the work.
3. Owl -> "The Big Picture": Strategic hindsight. They aren't looking at code; they are looking at the patterns of the year. Connecting the dots.
4. Beaver -> "The Achievement Review": Pride in output. They aren't building right now; they are admiring the massive list of things they finished.

TASK:
1. Analyze the reflections for personality, achievements, challenges, and teamwork style.
2. Pick the ONE animal that best fits.
3. Create 4 output versions. ALL versions must start with the Archetype Title (e.g. "The <Title>: ...").
4. Assign a score (0-100) for each of these traits:
   - Execution (Getting things done)
   - Strategy (Planning/Learning)
   - Resilience (Handling stress)
   - Connection (People focus)

- Version 1 (English): Focus on their ROLE and IMPACT in the team.
- Version 1 (Thai): Thai translation of Version 1.
- Version 2 (English): Focus on their PERSONALITY and VIBE.
- Version 2 (Thai): Thai translation of Version 2.

Each explanation should be punchy, cute, and shareable (approx 300-400 characters).

Respond in this EXACT format:
Animal: [animal name exactly as shown in the list: Capybara, RiverOtter, Owl, or Beaver]
Stats: [Execution:0-100], [Strategy:0-100], [Resilience:0-100], [Connection:0-100]
Version1_EN: [Archetype Title]: [Explanation]
Version1_TH: [Archetype Title in Thai]: [Explanation]
Version2_EN: [Archetype Title]: [Explanation]
Version2_TH: [Archetype Title in Thai]: [Explanation]`;

  const config = {
    temperature: 0.7,
    thinkingConfig: {
      thinkingBudget: 0,
    },
  };

  const model = "gemini-flash-lite-latest";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  try {
    let fullResponse = "";
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    for await (const chunk of response) {
      if (chunk.text) {
        fullResponse += chunk.text;
      }
    }

    const animalMatch = fullResponse.match(/Animal:\s*(.+?)(?:\n|$)/i);
    const statsMatch = fullResponse.match(
      /Stats:\s*\[Execution:(\d+)\],\s*\[Strategy:(\d+)\],\s*\[Resilience:(\d+)\],\s*\[Connection:(\d+)\]/i
    );
    const v1EnMatch = fullResponse.match(
      /Version1_EN:\s*(.+?)(?=\nVersion1_TH:|$)/is
    );
    const v1ThMatch = fullResponse.match(
      /Version1_TH:\s*(.+?)(?=\nVersion2_EN:|$)/is
    );
    const v2EnMatch = fullResponse.match(
      /Version2_EN:\s*(.+?)(?=\nVersion2_TH:|$)/is
    );
    const v2ThMatch = fullResponse.match(/Version2_TH:\s*(.+)$/is);

    if (
      !animalMatch ||
      !v1EnMatch ||
      !v1ThMatch ||
      !v2EnMatch ||
      !v2ThMatch ||
      !statsMatch
    ) {
      console.error("Gemini response:", fullResponse);
      throw new Error("Failed to parse Gemini response. Please try again.");
    }

    const animalName = animalMatch[1].trim();
    const stats = {
      execution: parseInt(statsMatch[1]),
      strategy: parseInt(statsMatch[2]),
      resilience: parseInt(statsMatch[3]),
      connection: parseInt(statsMatch[4]),
    };
    let version1En = v1EnMatch[1].trim();
    let version1Th = v1ThMatch[1].trim();
    let version2En = v2EnMatch[1].trim();
    let version2Th = v2ThMatch[1].trim();

    // Find matching animal from the list (case-insensitive)
    const animal = ANIMALS.find(
      (a) => a.toLowerCase() === animalName.toLowerCase()
    );

    if (!animal) {
      throw new Error(`Invalid animal selected: ${animalName}`);
    }

    // Extract title from Version1_EN (Assumes "Title: Explanation" format)
    const titleMatch = version1En.match(/^(.+?):/);
    const title = titleMatch ? titleMatch[1].trim() : `The ${animal}`;

    // Trim to max 700 chars if too long (allowing some flexibility beyond 600)
    if (version1En.length > 700)
      version1En = version1En.substring(0, 697) + "...";
    if (version1Th.length > 700)
      version1Th = version1Th.substring(0, 697) + "...";
    if (version2En.length > 700)
      version2En = version2En.substring(0, 697) + "...";
    if (version2Th.length > 700)
      version2Th = version2Th.substring(0, 697) + "...";

    return {
      animal,
      title,
      version1En,
      version1Th,
      version2En,
      version2Th,
      stats,
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

/**
 * Get emoji for an animal
 */
export function getAnimalEmoji(animal: Animal): string {
  const emojiMap: Record<Animal, string> = {
    RiverOtter: "🦦",
    Owl: "🦉",
    Capybara: "🦫",
    Beaver: "🦫",
  };
  return emojiMap[animal] || "🐾";
}

/**
 * Get image path for an animal
 */
export function getAnimalImage(animal: Animal): string {
  return `/images/animals/${animal}.jpeg`;
}
