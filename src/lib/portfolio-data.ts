import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type JourneyEntry = Tables<"journey_entries">;
export type MediaItem = Tables<"media_items">;
export type JourneyDraft = TablesInsert<"journey_entries">;
export type MediaDraft = TablesInsert<"media_items">;

export async function getPublishedPortfolio() {
  const [journeyResult, mediaResult] = await Promise.all([
    supabase.from("journey_entries").select("*").eq("published", true).order("sort_order"),
    supabase.from("media_items").select("*").eq("published", true).order("sort_order"),
  ]);
  if (journeyResult.error) throw journeyResult.error;
  if (mediaResult.error) throw mediaResult.error;
  return { journey: journeyResult.data, media: mediaResult.data };
}

export async function getAdminPortfolio() {
  const [journeyResult, mediaResult] = await Promise.all([
    supabase.from("journey_entries").select("*").order("sort_order"),
    supabase.from("media_items").select("*").order("sort_order"),
  ]);
  if (journeyResult.error) throw journeyResult.error;
  if (mediaResult.error) throw mediaResult.error;
  return { journey: journeyResult.data, media: mediaResult.data };
}

export function mediaUrl(item: MediaItem) {
  if (item.external_url) return item.external_url;
  if (!item.storage_path) return "";
  return supabase.storage.from("journey-media").createSignedUrl(item.storage_path, 3600);
}

export async function uploadMedia(file: File, onProgress?: (progress: number) => void) {
  onProgress?.(10);
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("journey-media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  onProgress?.(100);
  return path;
}

export async function saveJourney(id: string | null, draft: JourneyDraft) {
  const result = id
    ? await supabase.from("journey_entries").update(draft as TablesUpdate<"journey_entries">).eq("id", id)
    : await supabase.from("journey_entries").insert(draft);
  if (result.error) throw result.error;
}

export async function saveMedia(id: string | null, draft: MediaDraft) {
  if (draft.is_profile_photo) {
    const clear = await supabase.from("media_items").update({ is_profile_photo: false }).eq("is_profile_photo", true);
    if (clear.error) throw clear.error;
  }
  const result = id
    ? await supabase.from("media_items").update(draft as TablesUpdate<"media_items">).eq("id", id)
    : await supabase.from("media_items").insert(draft);
  if (result.error) throw result.error;
}

export async function removeJourney(id: string) {
  const { error } = await supabase.from("journey_entries").delete().eq("id", id);
  if (error) throw error;
}

export async function removeMedia(item: MediaItem) {
  if (item.storage_path) {
    const { error } = await supabase.storage.from("journey-media").remove([item.storage_path]);
    if (error) throw error;
  }
  const { error } = await supabase.from("media_items").delete().eq("id", item.id);
  if (error) throw error;
}