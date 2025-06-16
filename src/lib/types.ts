
export interface ActionItem {
  actionItem: string;
  assignee: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  citations?: string;
  timestamp: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string; // ISO string
  status: 'upcoming' | 'live' | 'completed';
  summaryPreview?: string;
  transcript?: string;
  fullSummary?: string;
  actionItems?: ActionItem[];
  chatHistory?: ChatMessage[];
  recordingUrl?: string; // Placeholder for actual recording
}
