import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TrackerRecord, ChatMessage } from '../types';

interface ToastState {
  show: boolean;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'error';
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
  deleteTrackerRecord: (id: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  toast: ToastState | null;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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
  const [motherName, setMotherNameState] = useState<string>(() => {
    return localStorage.getItem('mn_motherName') || 'ماما سارة';
  });
  const [childName, setChildNameState] = useState<string>(() => {
    return localStorage.getItem('mn_childName') || 'عمر';
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('mn_favorites');
    return saved ? JSON.parse(saved) : ['screaming', 'noncompliance'];
  });
  const [trackerRecords, setTrackerRecords] = useState<TrackerRecord[]>(() => {
    const saved = localStorage.getItem('mn_trackerRecords');
    return saved ? JSON.parse(saved) : SAMPLE_RECORDS;
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('mn_chatMessages');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '0',
            role: 'assistant',
            content: 'أهلاً بكِ يا ماما! 💜 أنا هنا عشان أساعدك في أي سؤال عن سلوك طفلك وطرق التعامل العلمية. اسأليني بحرية!',
            timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          },
        ];
  });
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    localStorage.setItem('mn_motherName', motherName);
  }, [motherName]);

  useEffect(() => {
    localStorage.setItem('mn_childName', childName);
  }, [childName]);

  useEffect(() => {
    localStorage.setItem('mn_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('mn_trackerRecords', JSON.stringify(trackerRecords));
  }, [trackerRecords]);

  useEffect(() => {
    localStorage.setItem('mn_chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const setMotherName = (name: string) => setMotherNameState(name);
  const setChildName = (name: string) => setChildNameState(name);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
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

  const deleteTrackerRecord = (id: string) => {
    setTrackerRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const hideToast = () => setToast(null);

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
        deleteTrackerRecord,
        chatMessages,
        addChatMessage,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
