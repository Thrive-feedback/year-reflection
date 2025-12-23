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

  const config = {
    temperature: 0.7,
    responseMimeType: "application/json",
  };

  const model = "gemini-flash-lite-latest";

  // JSON schema structure for the prompt
  const jsonStructure = JSON.stringify(
    {
      animal: "One of: Capybara, RiverOtter, Owl, Beaver",
      title: "string",
      version1En: "string (Archetype Title: Explanation)",
      version1Th: "string (Archetype Title: Explanation)",
      version2En: "string (Archetype Title: Explanation)",
      version2Th: "string (Archetype Title: Explanation)",
      stats: {
        execution: "number (0-100)",
        strategy: "number (0-100)",
        resilience: "number (0-100)",
        connection: "number (0-100)",
      },
    },
    null,
    2
  );

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
4. Assign a score (0-100) for each of these traits: Execution, Strategy, Resilience, Connection.

- Version 1 (English): Focus on their ROLE and IMPACT in the team.
- Version 1 (Thai): Thai translation of Version 1.
- Version 2 (English): Focus on their PERSONALITY and VIBE.
- Version 2 (Thai): Thai translation of Version 2.

Each explanation should be punchy, cute, and shareable (approx 300-400 characters).

Respond with a JSON object strictly following this structure:
${jsonStructure}`;

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

    let parsedResult: any;
    try {
      parsedResult = JSON.parse(fullResponse);
    } catch (e) {
      console.error("Failed to parse JSON response:", fullResponse);
      throw new Error("AI returned invalid JSON.");
    }

    // Validate animal
    const animalName = parsedResult.animal;
    const animal = ANIMALS.find(
      (a) => a.toLowerCase() === animalName.toLowerCase()
    );

    if (!animal) {
      throw new Error(`Invalid animal selected: ${animalName}`);
    }

    return {
      animal,
      title: parsedResult.title || `The ${animal}`,
      version1En: parsedResult.version1En,
      version1Th: parsedResult.version1Th,
      version2En: parsedResult.version2En,
      version2Th: parsedResult.version2Th,
      stats: {
        execution: parsedResult.stats.execution,
        strategy: parsedResult.stats.strategy,
        resilience: parsedResult.stats.resilience,
        connection: parsedResult.stats.connection,
      },
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
