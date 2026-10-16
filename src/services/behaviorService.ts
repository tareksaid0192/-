import { supabase } from './supabaseClient';
import { Behavior, BehaviorStep } from '../types';
import { INITIAL_BEHAVIORS } from '../constants/behaviors';

export interface DBBehavior {
  id: string;
  title: string;
  subtitle: string;
  icon_name: string;
  color: string;
  audio_duration: string;
  audio_script: string;
  audio_url: string | null;
  steps: BehaviorStep[];
  order_index: number;
  created_at?: string;
}

export function dbToLocal(b: DBBehavior): Behavior {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    iconName: b.icon_name,
    color: b.color,
    audioDuration: b.audio_duration,
    audioScript: b.audio_script,
    audioUrl: b.audio_url ?? undefined,
    steps: Array.isArray(b.steps) ? b.steps : [],
  };
}

export function localToDB(b: Partial<Behavior> & { order_index?: number }): Partial<DBBehavior> {
  return {
    ...(b.id !== undefined && { id: b.id }),
    ...(b.title !== undefined && { title: b.title }),
    ...(b.subtitle !== undefined && { subtitle: b.subtitle }),
    ...(b.iconName !== undefined && { icon_name: b.iconName }),
    ...(b.color !== undefined && { color: b.color }),
    ...(b.audioDuration !== undefined && { audio_duration: b.audioDuration }),
    ...(b.audioScript !== undefined && { audio_script: b.audioScript }),
    ...(b.audioUrl !== undefined && { audio_url: b.audioUrl || null }),
    ...(b.steps !== undefined && { steps: b.steps }),
    ...(b.order_index !== undefined && { order_index: b.order_index }),
  };
}

export interface SupabaseHealth {
  connected: boolean;
  tableExists: boolean;
  message: string;
  count: number;
}

export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  try {
    const { count, error } = await supabase
      .from('behaviors')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return {
        connected: false,
        tableExists: error.code !== '42P01',
        message: error.message,
        count: 0,
      };
    }

    return {
      connected: true,
      tableExists: true,
      message: 'الاتصال بقاعدة بيانات Supabase يعمل بنجاح',
      count: count ?? 0,
    };
  } catch (err: unknown) {
    return {
      connected: false,
      tableExists: false,
      message: err instanceof Error ? err.message : 'فشل الاتصال بـ Supabase',
      count: 0,
    };
  }
}

export async function fetchBehaviorsFromSupabase(): Promise<{
  behaviors: Behavior[];
  source: 'supabase' | 'local';
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('behaviors')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.warn('[Supabase] Fetch error:', error.message);
      return { behaviors: [], source: 'local', error: error.message };
    }

    if (data && data.length > 0) {
      return {
        behaviors: data.map(dbToLocal),
        source: 'supabase',
        error: null,
      };
    }

    return { behaviors: [], source: 'supabase', error: null };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { behaviors: [], source: 'local', error: msg };
  }
}

export async function seedBehaviorsToSupabase(
  behaviorsToSeed: Behavior[] = INITIAL_BEHAVIORS
): Promise<{ success: boolean; error: string | null; inserted: number }> {
  try {
    const rows = behaviorsToSeed.map((b, i) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      icon_name: b.iconName,
      color: b.color,
      audio_duration: b.audioDuration,
      audio_script: b.audioScript,
      audio_url: b.audioUrl || null,
      steps: b.steps,
      order_index: i,
    }));

    const { error, data } = await supabase
      .from('behaviors')
      .upsert(rows, { onConflict: 'id' })
      .select();

    if (error) {
      return { success: false, error: error.message, inserted: 0 };
    }

    return { success: true, error: null, inserted: data ? data.length : rows.length };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to seed behaviors',
      inserted: 0,
    };
  }
}

export async function upsertBehaviorToSupabase(
  behavior: Behavior,
  orderIndex: number = 0
): Promise<{ success: boolean; error: string | null }> {
  try {
    const row = localToDB({ ...behavior, order_index: orderIndex });
    const { error } = await supabase
      .from('behaviors')
      .upsert([row], { onConflict: 'id' });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to save behavior',
    };
  }
}

export async function deleteBehaviorFromSupabase(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from('behaviors').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to delete behavior',
    };
  }
}

export async function uploadAudioToSupabase(
  behaviorId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `audio/${behaviorId}/${Date.now()}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('behavior-audio')
      .upload(path, file, {
        upsert: true,
        contentType: file.type || 'audio/mpeg',
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from('behavior-audio').getPublicUrl(path);
    return { url: data.publicUrl, error: null };
  } catch (e: unknown) {
    return {
      url: null,
      error: e instanceof Error ? e.message : 'فشل رفع الملف الصوتي',
    };
  }
}
