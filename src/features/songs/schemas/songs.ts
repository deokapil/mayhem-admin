import { z } from "zod";

export const songSchema = z.object({
  id: z.number(),
  title: z.string().max(255),
  artist: z.string().max(255),
  length_in_seconds: z.string().max(255),
  year: z.number().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  path: z.string().max(255).optional(),
  direct_url: z.string().optional(),
  direct_url_expires_at: z.date().optional(),
  play_count: z.number().default(0),
  itunes_affiliate_url: z.string().max(255).optional(),
  itunes_artwork_url: z.string().max(255).optional(),
  active: z.boolean().default(true),
  before_archive_path: z.string().max(255).optional(),
  public_url: z.string().optional(),
});
