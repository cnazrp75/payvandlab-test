window.PvMotion = {
  press: { type: "spring", stiffness: 500, damping: 30 },
  panel: { type: "spring", stiffness: 500, damping: 34 },
  sheet: { type: "spring", stiffness: 420, damping: 42 },
  exit: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  scrim: { duration: 0.24, ease: [0, 0, 0.2, 1] },
  tap: { entry: 0.98, row: 0.99, control: 0.95 },
  nudge: -4
};
