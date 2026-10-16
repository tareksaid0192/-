import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Behavior } from '../types';
import { INITIAL_BEHAVIORS } from '../constants/behaviors';

interface BehaviorContextType {
  behaviors: Behavior[];
  isLoading: boolean;
  addBehavior: (behavior: Behavior) => void;
  updateBehavior: (behavior: Behavior) => void;
  deleteBehavior: (id: string) => void;
  resetToDefaults: () => void;
}

const BehaviorContext = createContext<BehaviorContextType | undefined>(undefined);

export function BehaviorProvider({ children }: { children: ReactNode }) {
  const [behaviors, setBehaviors] = useState<Behavior[]>(() => {
    const saved = localStorage.getItem('mn_behaviors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_BEHAVIORS;
      }
    }
    return INITIAL_BEHAVIORS;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('mn_behaviors', JSON.stringify(behaviors));
  }, [behaviors]);

  const addBehavior = (behavior: Behavior) => {
    setBehaviors((prev) => [behavior, ...prev]);
  };

  const updateBehavior = (behavior: Behavior) => {
    setBehaviors((prev) =>
      prev.map((b) => (b.id === behavior.id ? behavior : b))
    );
  };

  const deleteBehavior = (id: string) => {
    setBehaviors((prev) => prev.filter((b) => b.id !== id));
  };

  const resetToDefaults = () => {
    setBehaviors(INITIAL_BEHAVIORS);
  };

  return (
    <BehaviorContext.Provider
      value={{
        behaviors,
        isLoading,
        addBehavior,
        updateBehavior,
        deleteBehavior,
        resetToDefaults,
      }}
    >
      {children}
    </BehaviorContext.Provider>
  );
}

export function useBehaviors() {
  const context = useContext(BehaviorContext);
  if (!context) {
    throw new Error('useBehaviors must be used within a BehaviorProvider');
  }
  return context;
}
