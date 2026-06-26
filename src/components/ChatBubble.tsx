import type { ChatMessage } from '../lib/types';
import { ResultCard } from './ResultCard';

interface Props {
  message: ChatMessage;
}

export function ChatBubble({ message }: Props) {
  if (message.role === 'result' && message.result) {
    return (
      <div className="flex justify-start px-4">
        <div className="max-w-2xl w-full animate-fadeIn">
          <ResultCard result={message.result} />
        </div>
      </div>
    );
  }

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4`}>
      <div
        className={`max-w-lg rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? 'bg-(--primary) text-white rounded-br-md'
            : 'bg-(--surface) border border-(--border) rounded-bl-md'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
