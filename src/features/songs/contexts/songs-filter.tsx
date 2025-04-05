"use client";

import React, { createContext, useContext, useState } from "react";
import { songFilterType } from "../schemas/songs";

// Create context for filter state
const FilterContext = createContext<songFilterType | undefined>(undefined);

// Initial filter values
const initialFilters = {
  title: "",
  artist: "",
  genre: "",
  eras: "",
  active: true,
  page: 1,
  limit: 50,
  sort: z.string().optional(),
  direction: z.enum(["asc", "desc"]),
};

// Filter Provider Component
export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

// Custom hook to use filters
export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
