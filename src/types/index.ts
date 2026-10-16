export interface BehaviorStep {
  number: number;
  title: string;
  description: string;
}

export interface Behavior {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  audioScript: string;
  audioDuration: string;
  audioUrl?: string;
  steps: BehaviorStep[];
}

export interface TrackerRecord {
  id: string;
  date: string;
  behavior: string;
  time: string;
  cause: string;
  duration: string;
  severity: number;
  result: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
