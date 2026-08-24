package com.bleighbande.portfolio.ui.theme

import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

val DarkColorScheme = darkColorScheme(
    primary          = Amber400,
    onPrimary        = Carbon900,
    primaryContainer = AmberSubtle,
    onPrimaryContainer = Amber300,

    secondary        = Carbon600,
    onSecondary      = InkPrimary,
    secondaryContainer = Carbon700,
    onSecondaryContainer = InkMuted,

    tertiary         = SignalGreen,
    onTertiary       = Carbon900,

    background       = Carbon900,
    onBackground     = InkPrimary,

    surface          = Carbon800,
    onSurface        = InkPrimary,
    surfaceVariant   = Carbon700,
    onSurfaceVariant = InkMuted,

    outline          = Carbon500,
    outlineVariant   = Carbon400,

    error            = SignalRed,
    onError          = Color.White,
    errorContainer   = Color(0xFF3A1010),
    onErrorContainer = SignalRed,
)

val LightColorScheme = lightColorScheme(
    primary          = LightAccent,
    onPrimary        = Color.White,
    primaryContainer = Color(0xFFFFEDD0),
    onPrimaryContainer = Color(0xFF4A2800),

    secondary        = LightSurface,
    onSecondary      = LightInk,
    secondaryContainer = LightSurface,
    onSecondaryContainer = LightMuted,

    background       = LightPaper,
    onBackground     = LightInk,

    surface          = LightSurface,
    onSurface        = LightInk,
    surfaceVariant   = Color(0xFFE8E3DA),
    onSurfaceVariant = LightMuted,

    outline          = LightRule,
    outlineVariant   = Color(0xFFEAE5DC),

    error            = Color(0xFFBA1A1A),
    onError          = Color.White,
)
