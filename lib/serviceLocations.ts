"use client";

import { useState, useEffect, useCallback } from "react";
import { DEFAULT_APP_SETTINGS } from "./osmidaServices";

export const DEFAULT_NELLORE_LOCALITIES = [
  ...DEFAULT_APP_SETTINGS.service_zones,
];

const STORAGE_KEY = "osmida_service_locations";
const EVENT_NAME = "osmida_locations_updated";

/**
 * Synchronous local storage read for zero-layout-shift instant render.
 */
export function getStoredServiceLocations(): string[] {
  if (typeof window === "undefined") {
    return DEFAULT_NELLORE_LOCALITIES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((l): l is string => typeof l === "string" && l.trim().length > 0);
      }
    }
  } catch {}
  return DEFAULT_NELLORE_LOCALITIES;
}

/**
 * Broadcast updated service locations across all mounted components.
 */
export function broadcastLocationsUpdated(locations: string[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { locations } }));
    } catch {}
  }
}

/**
 * Universal React Hook to consume and react to dynamic service locations anywhere in the web app.
 */
export function useServiceLocations() {
  const [locations, setLocations] = useState<string[]>(() => getStoredServiceLocations());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/locations?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Pragma": "no-cache" },
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.locations) && data.locations.length > 0) {
        setLocations(data.locations);
        broadcastLocationsUpdated(data.locations);
      }
    } catch (err: any) {
      console.warn("Failed to fetch service locations:", err);
      setError(err?.message || "Failed to load locations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch on mount
    fetchLocations();

    // Listen for real-time updates dispatched by Admin or other components
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ locations: string[] }>;
      if (customEvent.detail?.locations && Array.isArray(customEvent.detail.locations)) {
        setLocations(customEvent.detail.locations);
      } else {
        const stored = getStoredServiceLocations();
        setLocations(stored);
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [fetchLocations]);

  // Admin mutation: Add location
  const addLocation = async (name: string): Promise<{ success: boolean; error?: string }> => {
    const clean = name.trim();
    if (!clean) return { success: false, error: "Location name cannot be empty" };
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: clean }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.locations)) {
        setLocations(data.locations);
        broadcastLocationsUpdated(data.locations);
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to add location" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Admin mutation: Edit / rename location
  const editLocation = async (oldName: string, newName: string): Promise<{ success: boolean; error?: string }> => {
    const cleanOld = oldName.trim();
    const cleanNew = newName.trim();
    if (!cleanOld || !cleanNew) return { success: false, error: "Both old and new names are required" };
    try {
      const res = await fetch("/api/locations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldLocation: cleanOld, newLocation: cleanNew }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.locations)) {
        setLocations(data.locations);
        broadcastLocationsUpdated(data.locations);
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to update location" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Admin mutation: Remove location
  const removeLocation = async (name: string): Promise<{ success: boolean; error?: string }> => {
    const clean = name.trim();
    if (!clean) return { success: false, error: "Location name cannot be empty" };
    try {
      const res = await fetch(`/api/locations?location=${encodeURIComponent(clean)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.locations)) {
        setLocations(data.locations);
        broadcastLocationsUpdated(data.locations);
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to remove location" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Admin mutation: Reset to standard Nellore defaults
  const resetToDefaults = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locations: DEFAULT_NELLORE_LOCALITIES }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.locations)) {
        setLocations(data.locations);
        broadcastLocationsUpdated(data.locations);
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to reset locations" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    locations,
    loading,
    error,
    refresh: fetchLocations,
    addLocation,
    editLocation,
    removeLocation,
    resetToDefaults,
  };
}
