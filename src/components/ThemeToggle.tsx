import { Moon, Sun } from 'lucide-react';

interface Props {
  dark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ dark, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-(--border) transition-colors"
      title={dark ? 'Açık tema' : 'Koyu tema'}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
