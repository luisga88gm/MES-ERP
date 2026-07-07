/**
/**
 * Global Design System Tokens & Industrial Theme Specification
 * Palette: Industrial Dark
 */

export const themeTokens = {
  colors: {
    background: "bg-slate-950",
    surface: "bg-slate-900",
    surfaceElevated: "bg-slate-900/90",
    surfaceGlass: "bg-slate-900/60 backdrop-blur-md border-slate-800",
    border: "border-slate-800",
    borderHighlight: "border-slate-700",
    textPrimary: "text-slate-100",
    textSecondary: "text-slate-400",
    textMuted: "text-slate-500",
    
    // Status Industrial Semáforo
    statusSuccess: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      border: "border-emerald-500/40",
      solid: "bg-emerald-500"
    },
    statusWarning: {
      bg: "bg-amber-500/20",
      text: "text-amber-400",
      border: "border-amber-500/40",
      solid: "bg-amber-500"
    },
    statusError: {
      bg: "bg-rose-500/20",
      text: "text-rose-400",
      border: "border-rose-500/40",
      solid: "bg-rose-500"
    },
    statusInfo: {
      bg: "bg-cyan-500/20",
      text: "text-cyan-400",
      border: "border-cyan-500/40",
      solid: "bg-cyan-500"
    }
  },
  
  components: {
    card: "bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-slate-100 transition-all duration-200",
    input: "bg-slate-950/80 border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder:text-slate-500 rounded-lg transition-all",
    buttonPrimary: "bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg shadow-sm transition-all active:scale-[0.98]",
  }
};
