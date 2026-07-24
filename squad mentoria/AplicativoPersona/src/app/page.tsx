"use client";

import { AppProvider, useApp } from "@/lib/app-context";
import { AnimatePresence, motion } from "framer-motion";
import HomeScreen from "@/components/HomeScreen";
import ProcessingScreen from "@/components/ProcessingScreen";
import ResultsScreen from "@/components/ResultsScreen";
import FullscreenView from "@/components/FullscreenView";
import FavoritesScreen from "@/components/FavoritesScreen";

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" as const } },
};

function AppRouter() {
  const { screen } = useApp();

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <HomeScreen />
          </motion.div>
        )}
        {screen === "processing" && (
          <motion.div key="processing" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ProcessingScreen />
          </motion.div>
        )}
        {screen === "results" && (
          <motion.div key="results" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ResultsScreen />
          </motion.div>
        )}
        {screen === "fullscreen" && (
          <motion.div key="fullscreen" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <FullscreenView />
          </motion.div>
        )}
        {screen === "favorites" && (
          <motion.div key="favorites" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <FavoritesScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}