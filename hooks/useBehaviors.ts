import { useContext } from 'react';
import { BehaviorContext } from '@/contexts/BehaviorContext';

export function useBehaviors() {
  const ctx = useContext(BehaviorContext);
  if (!ctx) throw new Error('useBehaviors must be used within BehaviorProvider');
  return ctx;
}
