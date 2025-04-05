import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function objectToUrlParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return; // Skip undefined and null values
    }

    if (Array.isArray(value)) {
      // Handle arrays by adding multiple entries with the same key
      value.forEach((item) => {
        searchParams.append(`${key}[]`, item.toString());
      });
    } else if (typeof value === "boolean") {
      // Convert boolean to string
      searchParams.append(key, value.toString());
    } else {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
