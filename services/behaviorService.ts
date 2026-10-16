import { supabase } from './supabaseClient';
import { BEHAVIORS, Behavior, BehaviorStep } from '@/constants/behaviors';

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

function dbToLocal(b: DBBehavior): Behavior {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    iconName: b.icon_name,
    color: b.color,
    audioDuration: b.audio_duration,
    audioScript: b.audio_script,
    audioUrl: b.audio_url ?? undefined,
    steps: b.steps,
  };
}

function localToDB(b: Partial<Behavior> & { order_index?: number }): Partial<DBBehavior> {
  return {
    ...(b.id !== undefined && { id: b.id }),
    ...(b.title !== undefined && { title: b.title }),
    ...(b.subtitle !== undefined && { subtitle: b.subtitle }),
    ...(b.iconName !== undefined && { icon_name: b.iconName }),
    ...(b.color !== undefined && { color: b.color }),
    ...(b.audioDuration !== undefined && { audio_duration: b.audioDuration }),
    ...(b.audioScript !== undefined && { audio_script: b.audioScript }),
    ...(b.audioUrl !== undefined && { audio_url: b.audioUrl }),
    ...(b.steps !== undefined && { steps: b.steps }),
    ...(b.order_index !== undefined && { order_index: b.order_index }),
  };
}

export async function fetchBehaviors(): Promise<Behavior[]> {
  const { data, error } = await supabase
    .from('behaviors')
    .select('*')
    .order('order_index', { ascending: true });

  if (error || !data || data.length === 0) {
    // Fallback to static data if DB not set up yet
    return BEHAVIORS;
  }
  return data.map(dbToLocal);
}

export async function seedBehaviors(): Promise<void> {
  const { count } = await supabase
    .from('behaviors')
    .select('*', { count: 'exact', head: true });

  if ((count ?? 0) > 0) return; // Already seeded

  const rows: DBBehavior[] = BEHAVIORS.map((b, i) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    icon_name: b.iconName,
    color: b.color,
    audio_duration: b.audioDuration,
    audio_script: b.audioScript,
    audio_url: null,
    steps: b.steps,
    order_index: i,
  }));

  await supabase.from('behaviors').insert(rows);
}

export async function upsertBehavior(behavior: Behavior, orderIndex: number): Promise<{ error: string | null }> {
  const row = localToDB({ ...behavior, order_index: orderIndex });
  const { error } = await supabase.from('behaviors').upsert([row], { onConflict: 'id' });
  return { error: error ? error.message : null };
}

export async function deleteBehavior(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('behaviors').delete().eq('id', id);
  return { error: error ? error.message : null };
}

export async function uploadAudio(
  behaviorId: string,
  fileUri: string,
  fileName: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const path = `audio/${behaviorId}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('behavior-audio')
      .upload(path, blob, { upsert: true, contentType: 'audio/mpeg' });

    if (uploadError) return { url: null, error: uploadError.message };

    const { data } = supabase.storage.from('behavior-audio').getPublicUrl(path);
    return { url: data.publicUrl, error: null };
  } catch (e: unknown) {
    return { url: null, error: e instanceof Error ? e.message : 'Upload failed' };
  }
}
