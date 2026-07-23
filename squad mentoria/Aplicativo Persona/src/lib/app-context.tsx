"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

type Screen = "home" | "processing" | "results" | "fullscreen" | "favorites";

interface AppState {
  screen: Screen;
  uploadedImage: string | null;
  resultImages: string[];
  favorites: string[];
  fullscreenImage: string | null;
  fullscreenIndex: number | null;
  setScreen: (screen: Screen) => void;
  setUploadedImage: (img: string | null) => void;
  setResultImages: (imgs: string[]) => void;
  toggleFavorite: (img: string) => void;
  openFullscreen: (img: string, index: number) => void;
  closeFullscreen: () => void;
  resetApp: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("home");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resultImages, setResultImages] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("persona-favorites");
        return stored ? JSON.parse(stored) : [];
      } catch { /* ignore */ }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("persona-favorites", JSON.stringify(favorites));
    } catch { /* ignore */ }
  }, [favorites]);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const toggleFavorite = useCallback((img: string) => {
    setFavorites((prev) =>
      prev.includes(img) ? prev.filter((f) => f !== img) : [...prev, img]
    );
  }, []);

  const openFullscreen = useCallback((img: string, index: number) => {
    setFullscreenImage(img);
    setFullscreenIndex(index);
    setScreen("fullscreen");
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenImage(null);
    setFullscreenIndex(null);
    setScreen("results");
  }, []);

  const resetApp = useCallback(() => {
    setScreen("home");
    setUploadedImage(null);
    setResultImages([]);
    setFullscreenImage(null);
    setFullscreenIndex(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        screen,
        uploadedImage,
        resultImages,
        favorites,
        fullscreenImage,
        fullscreenIndex,
        setScreen,
        setUploadedImage,
        setResultImages,
        toggleFavorite,
        openFullscreen,
        closeFullscreen,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}