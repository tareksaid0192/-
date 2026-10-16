import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Behavior, BEHAVIORS } from '@/constants/behaviors';
import { fetchBehaviors, seedBehaviors } from '@/services/behaviorService';

interface BehaviorContextType {
  behaviors: Behavior[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export const BehaviorContext = createContext<BehaviorContextType | undefined>(undefined);

export function BehaviorProvider({ children }: { children: ReactNode }) {
  const [behaviors, setBehaviors] = useState<Behavior[]>(BEHAVIORS);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await seedBehaviors();
      const data = await fetchBehaviors();
      setBehaviors(data);
    } catch {
      setBehaviors(BEHAVIORS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  return (
    <BehaviorContext.Provider value={{ behaviors, isLoading, refresh }}>
      {children}
    </BehaviorContext.Provider>
  );
}
