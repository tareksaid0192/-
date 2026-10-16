import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Behavior } from '../types';
import { INITIAL_BEHAVIORS } from '../constants/behaviors';
import {
  fetchBehaviorsFromSupabase,
  upsertBehaviorToSupabase,
  deleteBehaviorFromSupabase,
  seedBehaviorsToSupabase,
  checkSupabaseHealth,
  SupabaseHealth,
} from '../services/behaviorService';

interface BehaviorContextType {
  behaviors: Behavior[];
  isLoading: boolean;
  isSyncing: boolean;
  supabaseHealth: SupabaseHealth | null;
  addBehavior: (behavior: Behavior) => Promise<{ success: boolean; error?: string }>;
  updateBehavior: (behavior: Behavior) => Promise<{ success: boolean; error?: string }>;
  deleteBehavior: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshFromSupabase: () => Promise<void>;
  seedToSupabase: () => Promise<{ success: boolean; message: string }>;
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [supabaseHealth, setSupabaseHealth] = useState<SupabaseHealth | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mn_behaviors', JSON.stringify(behaviors));
  }, [behaviors]);

  // Check Supabase health and fetch on mount
  const refreshFromSupabase = useCallback(async () => {
    setIsSyncing(true);
    try {
      const health = await checkSupabaseHealth();
      setSupabaseHealth(health);

      const result = await fetchBehaviorsFromSupabase();
      if (result.behaviors && result.behaviors.length > 0) {
        setBehaviors(result.behaviors);
      }
    } catch (err) {
      console.warn('Error syncing with Supabase:', err);
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFromSupabase();
  }, [refreshFromSupabase]);

  const addBehavior = async (behavior: Behavior): Promise<{ success: boolean; error?: string }> => {
    // 1. Optimistically update local state
    setBehaviors((prev) => [behavior, ...prev]);

    // 2. Persist to Supabase
    setIsSyncing(true);
    const { success, error } = await upsertBehaviorToSupabase(behavior, 0);
    setIsSyncing(false);

    if (!success && error) {
      console.warn('[Supabase] Add error:', error);
      return { success: false, error };
    }
    return { success: true };
  };

  const updateBehavior = async (behavior: Behavior): Promise<{ success: boolean; error?: string }> => {
    setBehaviors((prev) =>
      prev.map((b) => (b.id === behavior.id ? behavior : b))
    );

    setIsSyncing(true);
    const { success, error } = await upsertBehaviorToSupabase(behavior);
    setIsSyncing(false);

    if (!success && error) {
      console.warn('[Supabase] Update error:', error);
      return { success: false, error };
    }
    return { success: true };
  };

  const deleteBehavior = async (id: string): Promise<{ success: boolean; error?: string }> => {
    setBehaviors((prev) => prev.filter((b) => b.id !== id));

    setIsSyncing(true);
    const { success, error } = await deleteBehaviorFromSupabase(id);
    setIsSyncing(false);

    if (!success && error) {
      console.warn('[Supabase] Delete error:', error);
      return { success: false, error };
    }
    return { success: true };
  };

  const seedToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    setIsSyncing(true);
    const res = await seedBehaviorsToSupabase(behaviors.length > 0 ? behaviors : INITIAL_BEHAVIORS);
    setIsSyncing(false);

    if (res.success) {
      await refreshFromSupabase();
      return {
        success: true,
        message: `تم رفع وتحديث ${res.inserted} سلوكاً بنجاح إلى جدول behaviors في Supabase!`,
      };
    } else {
      return {
        success: false,
        message: `فشل الرفع إلى Supabase: ${res.error}`,
      };
    }
  };

  const resetToDefaults = () => {
    setBehaviors(INITIAL_BEHAVIORS);
  };

  return (
    <BehaviorContext.Provider
      value={{
        behaviors,
        isLoading,
        isSyncing,
        supabaseHealth,
        addBehavior,
        updateBehavior,
        deleteBehavior,
        refreshFromSupabase,
        seedToSupabase,
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
