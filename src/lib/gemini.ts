import { GoogleGenAI } from '@google/genai';
import type { Reflection } from '../App';

const ANIMALS = [
  "Dog",
  "Dolphin",
  "Sloth",
  "Cat",
  "Rabbit",
  "Deer",
  "Lion",
  "Bull",
  "Horse",
  "Hawk",
  "Owl",
  "Panda",
  "Ant",
  "Fox",
  "Tortoise",
  "Red Panda",
  "Capybara",
  "Axolotl",
  "Quokka",
  "Sea Otter"
] as const;
type Animal = typeof ANIMALS[number];

export interface AnimalRecommendation {
  animal: Animal;
  version1En: string;
  version1Th: string;
  version2En: string;
  version2Th: string;
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
    throw new Error('Gemini API key is required');
  }

  if (!reflections || reflections.length === 0) {
    throw new Error('No reflections provided');
  }

  // Trim and validate API key to prevent header encoding issues
  const cleanApiKey = apiKey.trim();

  // Check for non-ASCII characters in API key
  if (!/^[\x00-\x7F]*$/.test(cleanApiKey)) {
    throw new Error('API key contains invalid characters');
  }

  const ai = new GoogleGenAI({
    apiKey: cleanApiKey,
  });

  // Format reflections for the prompt
  const reflectionSummary = reflections
    .map((r, idx) => {
      return `${idx + 1}. Topic: ${r.topic}\n   Reflection: ${r.text}\n   Rating: ${r.rating}/5`;
    })
    .join('\n\n');

  const prompt = `Based on these year reflections from a person, choose ONE animal from this list that best represents them: ${ANIMALS.join(', ')}.

Reflections:
${reflectionSummary}

Analyze their personality, achievements, challenges, and growth throughout the year. Then:
1. Think what animal represent user char in this year.
2. Create 4 DIFFERENT versions of explanations:
   - Version 1 (English): One perspective/angle explaining why this animal represents them
   - Version 1 (Thai): Same perspective as Version 1 English, but in Thai
   - Version 2 (English): A DIFFERENT perspective/angle explaining the same animal choice
   - Version 2 (Thai): Same perspective as Version 2 English, but in Thai
3. Each explanation should be detailed and meaningful (approximately 600 characters each)
4. Make sure Version 1 and Version 2 offer different insights or focus on different aspects

Respond in this EXACT format:
Animal: [animal name exactly as shown in the list]
Version1_EN: [detailed English explanation from first perspective, around 600 characters]
Version1_TH: [same perspective in Thai, around 600 characters]
Version2_EN: [detailed English explanation from different perspective, around 600 characters]
Version2_TH: [same perspective in Thai, around 600 characters]

Make the explanations thoughtful, specific to their reflections, and inspiring.`;

  const config = {
    temperature: 0.7,
    thinkingConfig: {
      thinkingBudget: 0,
    },
  };

  const model = 'gemini-flash-lite-latest';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  try {
    let fullResponse = '';
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

    // Parse the response
    const animalMatch = fullResponse.match(/Animal:\s*(.+?)(?:\n|$)/i);
    const v1EnMatch = fullResponse.match(/Version1_EN:\s*(.+?)(?=\nVersion1_TH:|$)/is);
    const v1ThMatch = fullResponse.match(/Version1_TH:\s*(.+?)(?=\nVersion2_EN:|$)/is);
    const v2EnMatch = fullResponse.match(/Version2_EN:\s*(.+?)(?=\nVersion2_TH:|$)/is);
    const v2ThMatch = fullResponse.match(/Version2_TH:\s*(.+?)$/is);

    if (!animalMatch || !v1EnMatch || !v1ThMatch || !v2EnMatch || !v2ThMatch) {
      console.error('Gemini response:', fullResponse);
      throw new Error('Failed to parse Gemini response. Please try again.');
    }

    const animalName = animalMatch[1].trim();
    let version1En = v1EnMatch[1].trim();
    let version1Th = v1ThMatch[1].trim();
    let version2En = v2EnMatch[1].trim();
    let version2Th = v2ThMatch[1].trim();

    // Find matching animal from the list (case-insensitive)
    const animal = ANIMALS.find(a => a.toLowerCase() === animalName.toLowerCase());

    if (!animal) {
      throw new Error(`Invalid animal selected: ${animalName}`);
    }

    // Trim to max 700 chars if too long (allowing some flexibility beyond 600)
    if (version1En.length > 700) version1En = version1En.substring(0, 697) + '...';
    if (version1Th.length > 700) version1Th = version1Th.substring(0, 697) + '...';
    if (version2En.length > 700) version2En = version2En.substring(0, 697) + '...';
    if (version2Th.length > 700) version2Th = version2Th.substring(0, 697) + '...';

    return {
      animal,
      version1En,
      version1Th,
      version2En,
      version2Th,
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

/**
 * Get emoji for an animal
 */
export function getAnimalEmoji(animal: Animal): string {
  const emojiMap: Record<Animal, string> = {
    "Dog": '🐕',
    "Dolphin": '🐬',
    "Sloth": '🦥',
    "Cat": '🐱',
    "Rabbit": '🐰',
    "Deer": '🦌',
    "Lion": '🦁',
    "Bull": '🐂',
    "Horse": '🐴',
    "Hawk": '🦅',
    "Owl": '🦉',
    "Panda": '🐼',
    "Ant": '🐜',
    "Fox": '🦊',
    "Tortoise": '🐢',
    "Red Panda": '🦝',
    "Capybara": '🦫',
    "Axolotl": '🦎',
    "Quokka": '🐿️',
    "Sea Otter": '🦦',
  };
  return emojiMap[animal] || '🐾';
}

/**
 * Get image path for an animal
 */
export function getAnimalImage(animal: Animal): string {
  return `/images/animals/${animal}.jpeg`;
}
