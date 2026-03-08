/**
 * mistralChat.js — Mistral API integration (domain service, no UI)
 *
 * Responsibilities:
 *   - Build a system prompt from the owner's resume data
 *   - Stream a chat completion from Mistral's API
 *   - Expose a clean async-generator interface to consumers
 *
 * The component layer is responsible for UI; this layer is
 * responsible for all AI/API concerns.
 */

import { RESUME } from '../data/resumeData.js';

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// Model chosen for balanced speed, quality and cost
const MODEL = 'mistral-small-latest';

// Hard cap on context length to avoid runaway costs / rate limits
const MAX_HISTORY_MESSAGES = 10;

/**
 * Build a focused system prompt grounded in the owner's actual resume.
 * Keeping it concise reduces token usage and improves response quality.
 */
function buildSystemPrompt() {
    const skillsList = Object.entries(RESUME.skills)
        .map(([cat, items]) => `${cat}: ${items.join(', ')}`)
        .join(' | ');

    const experienceText = RESUME.experience
        .map(e => `${e.title} at ${e.company} (${e.date}): ${e.bullets.join('; ')}`)
        .join('\n');

    return `You are an AI assistant embedded in ${RESUME.name}'s personal portfolio website.
Your role is to answer questions about ${RESUME.name} accurately and helpfully.

## About ${RESUME.name}
- Title: ${RESUME.title}
- Location: ${RESUME.location}
- Email: ${RESUME.email}
- GitHub: https://${RESUME.github}
- LinkedIn: https://${RESUME.linkedin}
- Summary: ${RESUME.summary}

## Experience
${experienceText}

## Education
${RESUME.education.map(e => `${e.degree} — ${e.school} (${e.date}, GPA: ${e.gpa})`).join('\n')}

## Skills
${skillsList}

## Activities
${RESUME.activities.map(a => `${a.title} at ${a.org} (${a.date})`).join('\n')}

## Certifications
${RESUME.certifications.map(c => `${c.name} — ${c.provider}`).join('\n')}

## Rules
- Answer ONLY questions about ${RESUME.name}, his skills, experience, projects, or career.
- If asked something unrelated to ${RESUME.name} or software development, politely redirect.
- Keep answers concise (2–4 sentences unless more detail is asked for).
- Never fabricate facts not present in the information above.
- You can suggest the visitor contact ${RESUME.name} at ${RESUME.email} for deeper enquiries.
- Respond in a friendly, professional tone.`;
}

/**
 * Trims the message history to stay within the token budget.
 * Always keeps the system prompt; trims oldest user/assistant turns first.
 *
 * @param {Array<{role: string, content: string}>} history
 * @returns {Array<{role: string, content: string}>}
 */
function trimHistory(history) {
    // history here does NOT include the system message
    if (history.length <= MAX_HISTORY_MESSAGES) return history;
    return history.slice(history.length - MAX_HISTORY_MESSAGES);
}

/**
 * Streams a chat response from Mistral and yields text chunks.
 *
 * @param {Array<{role: 'user'|'assistant', content: string}>} conversationHistory
 *   All prior turns (not including system message).
 * @param {string} userMessage  The latest user message.
 * @yields {string} Progressive text chunks as they arrive from the stream.
 * @throws {Error} With a user-facing message on API or network failure.
 */
export async function* streamChatResponse(conversationHistory, userMessage) {
    const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;

    if (!apiKey) {
        throw new Error(
            'VITE_MISTRAL_API_KEY is not set. Add it to your .env file and restart the dev server.'
        );
    }

    const messages = [
        { role: 'system', content: buildSystemPrompt() },
        ...trimHistory(conversationHistory),
        { role: 'user', content: userMessage },
    ];

    const response = await fetch(MISTRAL_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: MODEL,
            messages,
            stream: true,
            max_tokens: 512,
            temperature: 0.6,
        }),
        // Abort if the API hangs for more than 30 seconds (Rule 67)
        signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
        // Avoid leaking raw API error bodies to the UI (Rule 185)
        const status = response.status;
        if (status === 401) throw new Error('Invalid Mistral API key. Please check your .env file.');
        if (status === 429) throw new Error('Rate limit reached. Please wait a moment and try again.');
        throw new Error(`Mistral API error (${status}). Please try again.`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let hasContent = false;

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6).trim();
                if (data === '[DONE]') {
                    if (!hasContent) throw new Error('Received empty response from AI.');
                    return;
                }

                try {
                    const parsed = JSON.parse(data);
                    const text = parsed.choices?.[0]?.delta?.content;
                    if (text) {
                        hasContent = true;
                        yield text;
                    }
                } catch {
                    // Malformed SSE chunk — skip silently, don't crash the stream
                }
            }
        }
        if (!hasContent) throw new Error('Received empty response from AI.');
    } finally {
        reader.releaseLock();
    }
}
