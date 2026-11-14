window.PvMotion = {
  press: { type: "spring", stiffness: 500, damping: 30 },
  panel: { type: "spring", stiffness: 500, damping: 34 },
  sheet: { type: "spring", stiffness: 420, damping: 42 },
  disclose: { type: "spring", stiffness: 480, damping: 40, mass: 0.6 },
  chevron: { type: "spring", stiffness: 700, damping: 46, mass: 0.5 },
  dissolveIn: { duration: 0.18, ease: [0.23, 1, 0.32, 1] },
  dissolveOut: { duration: 0.14, ease: [0.4, 0, 1, 1] },
  exit: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  scrim: { duration: 0.24, ease: [0, 0, 0.2, 1] },
  tap: { entry: 0.98, row: 0.99, control: 0.95 },
  nudge: -4
};
