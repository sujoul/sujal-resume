import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type JourneyEntry = Tables<"journey_entries">;
export type MediaItem = Tables<"media_items">;

export async function getPublishedPortfolio() {
  const [journeyResult, mediaResult] = await Promise.all([
    supabase.from("journey_entries").select("*").eq("published", true).order("sort_order"),
    supabase.from("media_items").select("*").eq("published", true).order("sort_order"),
  ]);
  if (journeyResult.error) throw journeyResult.error;
  if (mediaResult.error) throw mediaResult.error;
  return { journey: journeyResult.data, media: mediaResult.data };
}
