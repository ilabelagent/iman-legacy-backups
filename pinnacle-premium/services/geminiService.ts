
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { InvestmentType, Sentiment } from "../types";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("API_KEY environment variable not set. Gemini API calls will be mocked or will fail.");
}

export const getCategoryFromSymbol = (symbol: string): InvestmentType => {
    // Simple heuristic, a real implementation would be more robust
    const stockLike = ["AAPL", "GOOG", "TSLA", "NVDA", "AI"];
    const reitLike = ["O", "SPG", "VNQ"];
    if (stockLike.includes(symbol.toUpperCase())) return 'stocks';
    if (reitLike.includes(symbol.toUpperCase())) return 'reits';
    if (symbol.toUpperCase() === 'GOLD' || symbol.toUpperCase() === 'XAU') return 'commodities';
    return 'crypto';
}

const getCategoryContext = (category: InvestmentType | null): string => {
    switch (category) {
        case 'crypto': return 'as a cryptocurrency asset.';
        case 'stocks': return 'as a publicly traded stock.';
        case 'reits': return 'as a Real Estate Investment Trust (REIT).';
        case 'commodities': return 'as a commodity.';
        case 'defi': return 'as a Decentralized Finance (DeFi) protocol.';
        case 'nft': return 'as a Non-Fungible Token (NFT) project or collection.';
        case 'mining': return 'as a crypto mining or staking opportunity.';
        default: return 'as a financial asset.';
    }
}

export async function getInvestmentAnalysis(asset: string, category: InvestmentType | null): Promise<string> {
  if (!ai) {
    return Promise.resolve(`API Key not configured. Unable to analyze ${asset}.
---
This is a mock response. In a real environment, this would be a detailed analysis from the Gemini API.

### Summary
${asset} shows potential for growth based on recent market trends.

### Potential Strengths
- Strong market position.
- Innovative technology.

### Potential Risks
- Market volatility remains a key concern.
- Regulatory changes could also impact performance.

### Long-term Outlook
The long-term outlook is cautiously optimistic, pending macroeconomic factors.
    `);
  }

  try {
    const categoryContext = getCategoryContext(category);
    const prompt = `
      You are a professional financial analyst providing insights for an investment platform.
      Do not provide financial advice. Your analysis should be objective and informative.
      
      Please provide a concise investment analysis for the following asset: "${asset}".
      Consider it ${categoryContext}
      
      Structure your response in the following format, using Markdown for clarity:
      
      ### Summary
      A brief overview of the asset and its current market position.
      
      ### Potential Strengths
      List 2-3 key potential upsides or strengths.
      
      ### Potential Risks
      List 2-3 key potential risks or weaknesses.
      
      ### Long-term Outlook
      A brief concluding thought on its long-term potential.
    `;

    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to retrieve analysis from Gemini API.");
  }
}

export async function getInvestmentThesis(assetSymbol: string, assetName: string): Promise<string> {
    if (!ai) return Promise.resolve(`This is a mock investment thesis for ${assetName}. A thesis provides a concise, high-level argument for an investment. For example, an investment in a leading AI chip manufacturer might be based on the thesis that artificial intelligence will be a dominant, long-term technological trend.`);
    
    try {
        const prompt = `
            You are a senior investment strategist. Generate a concise, one-paragraph investment thesis for holding ${assetName} (${assetSymbol}).
            Frame it from a long-term, strategic perspective. Do not give financial advice.
            Focus on the "why" behind the investment. For example, "An investment in [Company] is a bet on the long-term secular trend of..."
        `;
        const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
        return response.text;
    } catch (error) {
        console.error("Gemini thesis generation failed:", error);
        throw new Error("Failed to generate thesis.");
    }
}

export async function getMarketSentiment(assetSymbol: string): Promise<Sentiment> {
    if (!ai) return Promise.resolve('Neutral');

    try {
        const prompt = `Based on the latest market news, social media chatter, and technical analysis indicators for ${assetSymbol}, what is the current market sentiment?`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sentiment: {
                            type: Type.STRING,
                            enum: ['Bullish', 'Neutral', 'Bearish'],
                        },
                    },
                },
            }
        });
        const json = JSON.parse(response.text);
        return json.sentiment as Sentiment;
    } catch (error) {
        console.error(`Gemini sentiment analysis failed for ${assetSymbol}:`, error);
        return 'Neutral'; // Return default on error
    }
}

export async function parseScenarioQuery(query: string): Promise<{symbol: string, changePercent: number}[]> {
    if (!ai) return Promise.resolve([{ symbol: 'BTC', changePercent: -10 }]);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Parse the following user query and extract the financial assets and their percentage changes. Return ONLY a valid JSON array.
            If an asset goes up, the percentage is positive. If it goes down, falls, or drops, it is negative.
            
            Query: "${query}"`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            symbol: { type: Type.STRING },
                            changePercent: { type: Type.NUMBER }
                        },
                        required: ['symbol', 'changePercent']
                    }
                }
            }
        });

        const result = JSON.parse(response.text);
        if (Array.isArray(result)) {
            return result;
        }
        throw new Error("Parsed result is not an array.");

    } catch (error) {
        console.error(`Gemini scenario parsing failed for query "${query}":`, error);
        throw new Error("Failed to parse scenario.");
    }
}

export function startChat(): Chat | null {
    if (!ai) return null;
    
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a friendly and helpful AI assistant for "Pinnacle Premium Exchange", a cutting-edge investment platform.
- Your goal is to assist users, answer their questions about the platform, financial markets, and investment concepts.
- You are NOT a financial advisor. You MUST NOT give financial advice, recommendations, or price predictions. Always include a disclaimer if a user asks for advice, e.g., "As an AI, I cannot provide financial advice. Please consult with a qualified professional."
- If a user expresses a desire to speak with a human, an agent, or an admin, you MUST respond with this EXACT phrase and nothing else: 'An admin has been notified and will reach out to you shortly.'
- Keep your answers concise and easy to understand.`
        }
    });
}
