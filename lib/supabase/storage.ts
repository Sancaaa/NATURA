import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function resolveSupabaseAssetUrl(value?: string | null): Promise<string | null> {
  if (!value) return null;
  if (!isSupabaseConfigured) return value;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (!trimmed.includes("/storage/v1/object/")) return trimmed;

  try {
    const url = new URL(trimmed);
    const match = url.pathname.match(/\/storage\/v1\/object\/(?:public\/)?([^/]+)\/(.+)$/i);
    if (!match) return trimmed;

    const [, bucket, key] = match;
    const decodedKey = decodeURIComponent(key);
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(decodedKey, 60 * 60 * 24);

    if (error || !data?.signedUrl) return trimmed;
    return data.signedUrl;
  } catch {
    return trimmed;
  }
}
