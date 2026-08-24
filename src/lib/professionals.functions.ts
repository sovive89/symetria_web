import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

const professionalColumns =
  "id, full_name, specialty, registry, bio, city, state, avatar_url, instagram, services, gallery, availability, price_from, rating, reviews_count, verified";

export const listProfessionals = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("professionals")
    .select(professionalColumns)
    .order("rating", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getProfessional = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const [professional, reviews] = await Promise.all([
      supabase.from("professionals").select(professionalColumns).eq("id", data.id).maybeSingle(),
      supabase
        .from("reviews")
        .select("id, author_name, rating_service, rating_communication, rating_experience, comment, created_at")
        .eq("professional_id", data.id)
        .order("created_at", { ascending: false }),
    ]);
    if (professional.error) throw new Error(professional.error.message);
    return { professional: professional.data, reviews: reviews.data ?? [] };
  });
