import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Mic, Send, Trash2 } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
  onClear: () => void;
  onTranscript: (text: string) => void;
  loading: boolean;
}

export function ChatInput({ onSend, onClear, onTranscript, loading }: Props) {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!text.trim() || loading) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onClear();
    }
  };

  const toggleMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Web Speech API not supported');
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setText(t);
      onTranscript(t);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  return (
    <div className="border-t border-(--border) bg-(--surface) p-4">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın veya sesle anlatın..."
            rows={1}
            className="w-full resize-none rounded-xl border border-(--border) bg-(--bg) px-4 py-3 text-sm outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary) transition-colors"
            style={{ minHeight: 44, maxHeight: 120 }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
            }}
          />
        </div>

        <button
          onClick={toggleMic}
          className={`p-3 rounded-xl transition-colors ${
            listening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-(--surface) border border-(--border) text-(--fg) hover:bg-(--border)'
          }`}
          title={listening ? 'Durdur' : 'Sesle anlat'}
        >
          <Mic size={18} />
        </button>

        <button
          onClick={handleSend}
          disabled={!text.trim() || loading}
          className="p-3 rounded-xl bg-(--primary) text-white hover:bg-(--primary-dark) disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>

        <button
          onClick={onClear}
          className="p-3 rounded-xl bg-(--surface) border border-(--border) text-(--fg) hover:bg-(--border) transition-colors"
          title="Temizle (Ctrl+L)"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
