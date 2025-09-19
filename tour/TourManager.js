// tour/index.js
import { driver } from "driver.js";
import { getSteps } from "./steps";

const KEY = "hasSeenTour";

export function startTour(translate) {
  const tourDriver = driver({
    animate: true,
    showProgress: true,
    stageBackground: "rgba(255,165,0,0.3)",
    steps: getSteps(translate), // <— hier reinreichen
    onDestroyed: () => localStorage.setItem(KEY, "true"),
  });
  tourDriver.drive();
}

export function restartTour(translate) {
  localStorage.removeItem(KEY);
  startTour(translate);
}

export function maybeStartTour(translate) {
  if (typeof window === "undefined") return;
  const seen = localStorage.getItem(KEY);
  if (seen === "true") return;

  const tourDriver = driver({
    showProgress: true,
    allowClose: true,
    overlayOpacity: 0.55,
    stagePadding: 16,
    stageRadius: 14,
    overlayColor: "rgba(9, 29, 93, 0.55)",
    popoverClass: "mm-tour",
    steps: getSteps(translate), // <— auch hier
    onDestroyed: () => localStorage.setItem(KEY, "true"),
  });

  tourDriver.drive();
  
}
