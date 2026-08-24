# Design — Bleigh T.J Bande Portfolio

A locked design system for this portfolio, adhering to the Hallmark framework.

## Genre
Modern-minimal / Technical-Editorial

## Macrostructure Family
- **05 · Workbench & Engineering Dossier (Unibody & Ledger System)**: Continuous, unified canvas without card-in-card container fatigue or alternating background zebra-striping. High data density, clean hairline telemetry ledgers, engineered career chronology, and interactive ⌘K command palette.

## Unibody Principles
- **Continuous Canvas**: Single unified surface (`--color-paper`) across all sections; rhythm and whitespace (`padding: 5.5rem 0`) dictate page pacing rather than heavy container blocks.
- **Card-in-Card Elimination**: Sub-cards and nested bordered boxes are flattened into borderless ledger items with subtle hairline rules.
- **Understated Hairlines**: All dividers use low-contrast hairline rules (`1px solid var(--color-rule)`), letting typography and data hierarchy lead.

## Theme & OKLCH Tokens
```css
:root {
  /* Dark Canvas (Default Warm Carbon) */
  --color-paper: oklch(14% 0.008 55);
  --color-paper-2: oklch(17% 0.010 55);
  --color-paper-surface: oklch(20% 0.012 55);
  --color-paper-hover: oklch(24% 0.015 55);
  --color-ink: oklch(96% 0.005 55);
  --color-ink-muted: oklch(74% 0.012 55);
  --color-ink-dim: oklch(54% 0.015 55);
  --color-rule: oklch(26% 0.015 55);
  --color-rule-strong: oklch(38% 0.02 55);
  
  /* Signals & Accents (Signal Amber / Engineering Orange — Zero Blue / Purple) */
  --color-accent: oklch(68% 0.20 48);          /* Signal Amber-Orange */
  --color-accent-ink: oklch(12% 0.015 48);     /* High-contrast dark ink on bright accent */
  --color-accent-hover: oklch(74% 0.18 48);
  --color-accent-subtle: oklch(24% 0.05 48);
  --color-signal-green: oklch(74% 0.17 145);   /* Live Status / 200 OK */
  --color-signal-amber: oklch(76% 0.16 75);    /* Warning / In Progress */
  --color-signal-red: oklch(62.8% 0.225 29.2); /* Error / High Priority */
  --color-focus: oklch(70% 0.20 48);
  --color-overlay: oklch(10% 0.008 55 / 0.75);

  /* Geometry & Radii */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-full: 9999px;
  
  /* Transitions */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
}

[data-theme="light"] {
  /* Light Engineered Canvas */
  --color-paper: oklch(98.5% 0.004 55);
  --color-paper-2: oklch(95.5% 0.008 55);
  --color-paper-surface: oklch(92.5% 0.01 55);
  --color-paper-hover: oklch(89.5% 0.014 55);
  --color-ink: oklch(18% 0.015 55);
  --color-ink-muted: oklch(42% 0.015 55);
  --color-ink-dim: oklch(60% 0.012 55);
  --color-rule: oklch(86% 0.010 55);
  --color-rule-strong: oklch(72% 0.015 55);
  
  --color-accent: oklch(58% 0.21 48);
  --color-accent-ink: oklch(98.5% 0.004 55);
  --color-accent-hover: oklch(52% 0.21 48);
  --color-accent-subtle: oklch(93% 0.04 48);
  --color-signal-green: oklch(50% 0.17 145);
  --color-signal-amber: oklch(56% 0.17 75);
  --color-signal-red: oklch(52% 0.22 25);
  --color-focus: oklch(58% 0.21 48);
  --color-overlay: oklch(20% 0.008 55 / 0.6);
}
```

## Typography
- **Display**: Space Grotesk (500, 600, 700), normal roman style (no italic display headers).
- **Body**: Inter (400, 500, 600), line-height 1.6.
- **Mono**: JetBrains Mono (400, 500), tracking 0.04em, uppercase labels & telemetry.

## Layout & Space Discipline
- 4-point spacing grid.
- Hairline rules (`1px solid var(--color-rule)`), minimal shadows (depth from borders and contrast, not blur).
- Responsive viewports: 320px, 375px, 414px, 768px, 1024px, 1440px.
- Zero two-line buttons; `overflow-x: clip` on root html and body.

## Microinteractions
- ⌘K Command Palette for direct navigation, searching repos, theme toggling, and downloading CV.
- Accessible form state feedback for default, hover, focus-visible, active, disabled, loading, error, success.
- Live clock readout: `Gweru, Zimbabwe (CAT / UTC+2)`.
