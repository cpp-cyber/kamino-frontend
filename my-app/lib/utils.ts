import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Column } from "@tanstack/react-table";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUptime(uptime: number): React.ReactNode {
  if (!uptime || uptime === 0) return "N/A";
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export function formatBytes(bytes: number) {
  if (!bytes || bytes === 0 || isNaN(bytes)) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Calculate resource utilization percentage
export function calculateUtilization(used: number, total: number): number {
  if (!used || !total || total === 0 || isNaN(used) || isNaN(total)) return 0;
  return Math.round((used / total) * 100);
}

export const formatRelativeTime = (dateString: string) => {
  try {
    // Parse UTC timestamp and convert to local time
    const date = new Date(
      dateString.endsWith("Z") ? dateString : dateString + "Z",
    );
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    // Convert to different time units
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return years === 1 ? "1 year ago" : `${years} years ago`;
    } else if (months > 0) {
      return months === 1 ? "1 month ago" : `${months} months ago`;
    } else if (weeks > 0) {
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    } else if (days > 0) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else {
      return seconds <= 30 ? "Just now" : `${seconds} seconds ago`;
    }
  } catch {
    return dateString; // Return original string if parsing fails
  }
};

export const formatDateTime = (dateString: string) => {
  try {
    // Parse UTC timestamp and convert to local time
    const date = new Date(
      dateString.endsWith("Z") ? dateString : dateString + "Z",
    );
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return dateString; // Return original string if parsing fails
  }
};

// Common sorting functions for table columns
export const createDateSortingFn = () => {
  return (
    rowA: { original: Record<string, unknown> },
    rowB: { original: Record<string, unknown> },
    columnId: string,
  ) => {
    const aValue = rowA.original[columnId] as string;
    const bValue = rowB.original[columnId] as string;

    if (!aValue || !bValue) {
      if (!aValue && !bValue) return 0;
      return !aValue ? 1 : -1;
    }

    const aDate = new Date(aValue.endsWith("Z") ? aValue : aValue + "Z");
    const bDate = new Date(bValue.endsWith("Z") ? bValue : bValue + "Z");
    return bDate.getTime() - aDate.getTime(); // Newest first by default
  };
};

export const createAlphabeticalSortingFn = () => {
  return (
    rowA: { original: Record<string, unknown> },
    rowB: { original: Record<string, unknown> },
    columnId: string,
  ) => {
    const aValue = String(rowA.original[columnId] || "").toLowerCase();
    const bValue = String(rowB.original[columnId] || "").toLowerCase();
    return aValue.localeCompare(bValue);
  };
};

// Parse group names from newline-separated text
export function parseGroupNamesFromText(text: string): string[] {
  return text
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

// Group name validation based on LDAP naming restrictions (RFC 2253)
export interface GroupNameValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateGroupName(name: string): GroupNameValidationResult {
  const errors: string[] = [];

  // Check if empty
  if (!name || name.trim().length === 0) {
    errors.push("Group name is required");
    return { isValid: false, errors };
  }

  const trimmedName = name.trim();

  // Check maximum length (63 bytes/characters)
  if (new TextEncoder().encode(trimmedName).length > 63) {
    errors.push("Group name must not exceed 63 bytes");
  }

  // Check for allowed characters only: letters, numbers, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmedName)) {
    errors.push(
      "Group name can only contain letters, numbers, hyphens, and underscores",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate multiple group names and return results for each
export function validateGroupNames(
  names: string[],
): { name: string; validation: GroupNameValidationResult }[] {
  return names.map((name) => ({
    name,
    validation: validateGroupName(name),
  }));
}

// Filter out invalid characters as user types
export function filterGroupNameInput(input: string): string {
  // Only allow letters, numbers, hyphens, and underscores
  let filtered = input.replace(/[^a-zA-Z0-9_-]/g, "");

  // Limit to 63 bytes
  const encoder = new TextEncoder();
  while (encoder.encode(filtered).length > 63 && filtered.length > 0) {
    filtered = filtered.slice(0, -1);
  }

  return filtered;
}

// Username validation based on legacy client support requirements
export interface UsernameValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateUsername(username: string): UsernameValidationResult {
  const errors: string[] = [];

  // Check if empty
  if (!username || username.trim().length === 0) {
    errors.push("Username is required");
    return { isValid: false, errors };
  }

  const trimmedUsername = username.trim();

  // Check maximum length (20 characters)
  if (trimmedUsername.length > 20) {
    errors.push("Username must not exceed 20 characters");
  }

  // Check for alphanumeric only (letters and numbers)
  if (!/^[a-zA-Z0-9]+$/.test(trimmedUsername)) {
    errors.push("Username can only contain letters and numbers");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate multiple usernames and return results for each
export function validateUsernames(
  usernames: string[],
): { username: string; validation: UsernameValidationResult }[] {
  return usernames.map((username) => ({
    username,
    validation: validateUsername(username),
  }));
}

// Filter out invalid characters as user types for usernames
export function filterUsernameInput(input: string): string {
  // Only allow alphanumeric characters (letters and numbers)
  let filtered = input.replace(/[^a-zA-Z0-9]/g, "");

  // Limit to 20 characters
  if (filtered.length > 20) {
    filtered = filtered.slice(0, 20);
  }

  return filtered;
}

// Password validation
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  // Check if empty
  if (!password || password.length === 0) {
    errors.push("Password is required");
    return { isValid: false, errors };
  }

  // Check maximum length (128 characters)
  if (password.length > 128) {
    errors.push("Password must not exceed 128 characters");
  }

  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    errors.push("Password must contain at least one letter");
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Filter password input to enforce character limit
export function filterPasswordInput(input: string): string {
  // Limit to 128 characters
  if (input.length > 128) {
    return input.slice(0, 128);
  }
  return input;
}

// Table utility functions
export const createSortingToggleHandler = (
  column: Column<unknown, unknown>,
) => {
  return () => column.toggleSorting(column.getIsSorted() === "asc");
};

export const getSortDirection = (
  column: Column<unknown, unknown>,
): false | "asc" | "desc" => {
  return column.getIsSorted();
};

// Helper function to format pod names by replacing underscores with spaces and capitalizing
export function formatPodName(name: string): string {
  if (!name) return name;
  return name
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
