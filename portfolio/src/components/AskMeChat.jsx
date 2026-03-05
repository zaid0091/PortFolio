/**
 * AskMeChat.jsx — AI chat widget powered by Groq
 *
 * Presentation responsibilities only:
 *   - Render the FAB (floating action button) and panel
 *   - Manage local UI state (open/closed, input value)
 *   - Delegate all API calls to groqChat service
 *
 * Business logic lives in: src/services/groqChat.js
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { streamChatResponse } from '../services/mistralChat.js';

// Suggestion chips shown before the user types anything
const SUGGESTION_CHIPS = [
  'What are your skills?',
  'Tell me about your experience',
  'What projects have you built?',
  'Are you open to work?',
];

// Initial greeting shown when the chat opens for the first time
const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    "Hi! I'm Zaid's AI assistant. Ask me anything about his skills, experience, or projects.",
  id: 'welcome',
};

/**
 * Renders simple markdown-ish content into React elements.
 * Supports: **bold**, `inline code`, and bullet lines starting with "- ".
 * Kept intentionally minimal — no third-party parser needed.
 */
function MessageContent({ text }) {
  const lines = text.split('\n');

  return (
    <div className="askme-content">
      {lines.map((line, i) => {
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={i} className="askme-bullet">
              <span className="askme-bullet-dot">▸</span>
              <span>{formatInline(line.slice(2))}</span>
            </div>
          );
        }
        if (line === '') return <div key={i} className="askme-spacer" />;
        return <p key={i}>{formatInline(line)}</p>;
      })}
    </div>
  );
}

/**
 * Converts **bold** and `code` markers within a single line to React elements.
 */
function formatInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export default function AskMeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  // Tracks the conversation turns (role + content) for the API context window
  const conversationRef = useRef([]);

  // Scroll to the latest message whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus the input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setErrorMessage('');
      setInput('');

      const userMessage = { role: 'user', content: trimmed, id: `u-${Date.now()}` };
      const assistantId = `a-${Date.now()}`;

      // Append user message and an empty assistant bubble immediately
      setMessages((prev) => [
        ...prev,
        userMessage,
        { role: 'assistant', content: '', id: assistantId, streaming: true },
      ]);

      setIsStreaming(true);

      // History for API (exclude welcome message, only real turns)
      const history = conversationRef.current;

      try {
        let accumulated = '';

        for await (const chunk of streamChatResponse(history, trimmed)) {
          accumulated += chunk;
          // Update the streaming bubble in-place — avoids adding new nodes on each chunk
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: accumulated } : m
            )
          );
        }

        // Mark streaming complete
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false } : m
          )
        );

        // Persist turn to context window for follow-up questions
        conversationRef.current = [
          ...history,
          { role: 'user', content: trimmed },
          { role: 'assistant', content: accumulated },
        ];
      } catch (err) {
        // Remove the empty assistant bubble and show inline error
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setErrorMessage(err.message || 'Something went wrong. Please try again.');
      } finally {
        setIsStreaming(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [isStreaming]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleChipClick = (chip) => {
    sendMessage(chip);
  };

  // Only show suggestions if the user hasn't sent anything yet
  const showSuggestions = messages.length === 1 && !isStreaming;

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="askme-fab"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'}`} aria-hidden="true" />
        <span className="askme-fab-label">{isOpen ? 'Close' : 'Ask AI'}</span>
      </button>

      {/* Chat Panel */}
      <div
        className={`askme-panel ${isOpen ? 'askme-panel--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="AI Chat with Zaid's assistant"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="askme-header">
          <div className="askme-header-left">
            <div className="askme-avatar" aria-hidden="true">
              <i className="fas fa-robot" />
              <span className="askme-online-dot" title="Online" />
            </div>
            <div>
              <div className="askme-header-title">Zaid's AI</div>
              <div className="askme-header-sub">Powered by Mistral · mistral-small</div>
            </div>
          </div>
          <button
            className="askme-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </div>

        {/* Messages */}
        <div
          className="askme-messages"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`askme-msg askme-msg--${msg.role}`}
            >
              {msg.role === 'assistant' && (
                <div className="askme-msg-avatar" aria-hidden="true">
                  <i className="fas fa-robot" />
                </div>
              )}

              <div
                className={`askme-msg-bubble ${msg.streaming ? 'askme-msg-bubble--streaming' : ''
                  }`}
              >
                {msg.streaming && msg.content === '' ? (
                  /* Typing indicator before first chunk arrives */
                  <div className="askme-typing-dots" aria-label="Typing">
                    <span /><span /><span />
                  </div>
                ) : (
                  <>
                    <MessageContent text={msg.content} />
                    {msg.streaming && (
                      <span className="askme-cursor" aria-hidden="true" />
                    )}
                  </>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="askme-msg-avatar" aria-hidden="true">
                  <i className="fas fa-user" />
                </div>
              )}
            </div>
          ))}

          {/* Inline API error */}
          {errorMessage && (
            <div className="askme-msg askme-msg--assistant" role="alert">
              <div className="askme-msg-avatar" aria-hidden="true">
                <i className="fas fa-robot" />
              </div>
              <div
                className="askme-msg-bubble"
                style={{ borderColor: '#e53e3e', background: '#fff5f5', color: '#c53030' }}
              >
                <i className="fas fa-exclamation-triangle" aria-hidden="true" />{' '}
                {errorMessage}
              </div>
            </div>
          )}

          {/* Invisible scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion chips — visible only before first user message */}
        {showSuggestions && (
          <div className="askme-suggestions" role="list" aria-label="Suggested questions">
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                role="listitem"
                className="askme-suggestion-chip"
                onClick={() => handleChipClick(chip)}
                disabled={isStreaming}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input row */}
        <form className="askme-input-row" onSubmit={handleSubmit} noValidate>
          <label htmlFor="askme-input" className="sr-only">
            Message Zaid's AI
          </label>
          <input
            id="askme-input"
            ref={inputRef}
            className="askme-input"
            type="text"
            placeholder="Ask about Zaid..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            maxLength={500}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className="askme-send-btn"
            disabled={isStreaming || !input.trim()}
            aria-label="Send message"
          >
            {isStreaming ? (
              <i className="fas fa-circle-notch fa-spin" aria-hidden="true" />
            ) : (
              <i className="fas fa-paper-plane" aria-hidden="true" />
            )}
          </button>
        </form>
      </div>
    </>
  );
}
