import React, { createContext, useState, ReactNode } from 'react';

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
  timestamp: Date;
}

interface AppContextType {
  motherName: string;
  childName: string;
  setMotherName: (name: string) => void;
  setChildName: (name: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  trackerRecords: TrackerRecord[];
  addTrackerRecord: (record: Omit<TrackerRecord, 'id' | 'date'>) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const SAMPLE_RECORDS: TrackerRecord[] = [
  {
    id: '1',
    date: '2026-10-10',
    behavior: 'نوبات صراخ',
    time: 'صباحاً',
    cause: 'رُفض له طلب',
    duration: '5-15 د',
    severity: 4,
    result: 'استجاب متأخراً',
  },
  {
    id: '2',
    date: '2026-10-11',
    behavior: 'عناد',
    time: 'ظهراً',
    cause: 'طُلب منه مهمة',
    duration: 'أقل من 5 د',
    severity: 3,
    result: 'هدأ بسرعة',
  },
  {
    id: '3',
    date: '2026-10-12',
    behavior: 'ضرب',
    time: 'مساءً',
    cause: 'لفت انتباه',
    duration: 'أقل من 5 د',
    severity: 5,
    result: 'لم يستجب',
  },
  {
    id: '4',
    date: '2026-10-13',
    behavior: 'نوبات صراخ',
    time: 'قبل النوم',
    cause: 'تعب/جوع',
    duration: '5-15 د',
    severity: 3,
    result: 'هدأ بسرعة',
  },
  {
    id: '5',
    date: '2026-10-14',
    behavior: 'رفض روتين',
    time: 'صباحاً',
    cause: 'طُلب منه مهمة',
    duration: 'أقل من 5 د',
    severity: 2,
    result: 'هدأ بسرعة',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [motherName, setMotherName] = useState('');
  const [childName, setChildName] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [trackerRecords, setTrackerRecords] = useState<TrackerRecord[]>(SAMPLE_RECORDS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'أهلاً بكِ يا ماما! 💜 أنا هنا عشان أساعدك في أي سؤال عن سلوك طفلك. اسأليني بحرية!',
      timestamp: new Date(),
    },
  ]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addTrackerRecord = (record: Omit<TrackerRecord, 'id' | 'date'>) => {
    const newRecord: TrackerRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setTrackerRecords((prev) => [...prev, newRecord]);
  };

  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  return (
    <AppContext.Provider
      value={{
        motherName,
        childName,
        setMotherName,
        setChildName,
        favorites,
        toggleFavorite,
        isFavorite,
        trackerRecords,
        addTrackerRecord,
        chatMessages,
        addChatMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
