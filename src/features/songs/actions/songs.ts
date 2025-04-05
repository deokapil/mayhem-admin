// actions for songs
// FILE: lib/actions/song-actions.ts
"use server";

import { getWithParams } from "@/lib/api-client";

import { songFilterType } from "../schemas/songs";

// Mock API endpoints

// Helper function for authenticated API requests
export const getSongsByFilter = async (filters: songFilterType) => {
  const rawInput = {
    title: "Imagine",
    genre: [3, 5],
    direction: "desc",
    active: true,
  };

  const response = await getWithParams("songs", rawInput);
  console.log(response);
};
