import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: any) {
  const detail = error.response?.data?.detail;
  if (!detail) return error.message || "Something went wrong";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d: any) => d.msg || d.text || JSON.stringify(d)).join(", ");
  }
  if (typeof detail === "object") {
    return detail.msg || detail.text || JSON.stringify(detail);
  }
  return String(detail);
}
