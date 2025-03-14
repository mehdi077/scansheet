import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// this is to get the url of the file 
export function useStorageUrl(storageId: Id<"_storage"> | undefined) {
  return useQuery(api.storage.getUrl, storageId ? { storageId } : "skip");
}
