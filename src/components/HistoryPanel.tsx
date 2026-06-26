import type { ChatMessage } from '../lib/types';
import { Clock, Trash2 } from 'lucide-react';

interface Props {
  history: ChatMessage[];
  onSelect: (msg: ChatMessage) => void;
  onClear: () => void;
  open: boolean;
}

export function HistoryPanel({ history, onSelect, onClear, open }: Props) {
  if (!open) return null;

  const results = history.filter((m) => m.role === 'result' && m.result);

  return (
    <div className="w-72 border-r border-(--border) bg-(--surface) overflow-y-auto flex flex-col">
      <div className="p-3 border-b border-(--border) flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Clock size={16} />
          Geçmiş
        </div>
        <button onClick={onClear} className="p-1 hover:bg-(--border) rounded transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {results.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-8">Henüz hesaplama yok</p>
        )}
        {results.map((msg) => (
          <button
            key={msg.id}
            onClick={() => onSelect(msg)}
            className="w-full text-left p-2 rounded-lg text-xs hover:bg-(--border) transition-colors"
          >
            <span className="font-medium">
              {msg.result?.type === 'compound_interest' && '💰 Bileşik Faiz'}
              {msg.result?.type === 'mortgage' && '🏠 Konut Kredisi'}
              {msg.result?.type === 'tax_tr' && '📊 Vergi'}
              {msg.result?.type === 'currency' && '💱 Döviz'}
            </span>
            <span className="block text-gray-500 truncate mt-0.5">{msg.content}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
