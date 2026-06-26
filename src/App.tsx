import { useState, useCallback, useRef, useEffect } from 'react';
import { Menu, Download } from 'lucide-react';
import { ChatBubble } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';
import { HistoryPanel } from './components/HistoryPanel';
import { ThemeToggle } from './components/ThemeToggle';
import { useChat } from './hooks/useChat';
import { useTheme } from './hooks/useTheme';
import { useHistory } from './hooks/useHistory';
import type { ChatMessage } from './lib/types';

export default function App() {
  const { messages, loading, processQuery, clearChat } = useChat();
  const { dark, toggle } = useTheme();
  const { history, addToHistory, clearHistory } = useHistory();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [rates, setRates] = useState<{ usd: number; eur: number } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    import('./engine/currency').then(({ fetchRates }) => {
      fetchRates().then((r) => {
        setRates({ usd: r.TRY, eur: r.TRY / (r.EUR ? r.USD / r.EUR : 1) });
      }).catch(() => {});
    });
  }, []);

  useEffect(() => {
    messages.forEach(addToHistory);
  }, [messages, addToHistory]);

  const handleSend = useCallback((text: string) => {
    processQuery(text);
  }, [processQuery]);

  const handleHistorySelect = useCallback((msg: ChatMessage) => {
    if (msg.content) {
      processQuery(msg.content);
    }
    setHistoryOpen(false);
  }, [processQuery]);

  const handleExport = useCallback(async () => {
    const { toPng } = await import('html-to-image');
    const el = document.getElementById('chat-messages');
    if (!el) return;
    try {
      const dataUrl = await toPng(el);
      const link = document.createElement('a');
      link.download = `fincalc-export-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {}
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b border-(--border) bg-(--surface) px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHistoryOpen((h) => !h)}
            className="p-2 rounded-lg hover:bg-(--border) transition-colors"
          >
            <Menu size={18} />
          </button>
          <h1 className="text-lg font-bold">
            FinCalc <span className="text-(--primary)">AI</span>
          </h1>
        </div>

        {rates && (
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <span>USD/TRY: <strong className="text-(--primary)">{rates.usd.toFixed(2)}</strong></span>
            <span>EUR/TRY: <strong className="text-(--primary)">{rates.eur.toFixed(2)}</strong></span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="p-2 rounded-lg hover:bg-(--border) transition-colors" title="Export as PNG">
            <Download size={18} />
          </button>
          <ThemeToggle dark={dark} onToggle={toggle} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <HistoryPanel
          history={history}
          onSelect={handleHistorySelect}
          onClear={clearHistory}
          open={historyOpen}
        />

        <main className="flex-1 flex flex-col min-w-0">
          <div id="chat-messages" className="flex-1 overflow-y-auto space-y-4 py-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-center px-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">FinCalc AI</h2>
                  <p className="text-sm text-gray-500 max-w-md">
                    Finansal sorularınızı Türkçe veya İngilizce yazın veya söyleyin.
                    Örn: "500.000 TL faizle 3 yıl" veya "30.000 TL maaştan ne kalır?"
                  </p>
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {loading && (
              <div className="flex justify-start px-4">
                <div className="bg-(--surface) border border-(--border) rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-(--primary) animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-(--primary) animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-(--primary) animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <ChatInput onSend={handleSend} onClear={clearChat} onTranscript={() => {}} loading={loading} />
        </main>
      </div>
    </div>
  );
}
