package com.bleighbande.portfolio.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// Space Grotesk — display/headlines
// Inter — body
// JetBrains Mono — labels, mono
// (loaded via downloadable fonts in res/font — see Type.kt notes)

// Using system fonts as fallback for buildable APK without font assets
val SpaceGrotesk = FontFamily.Default   // Replace with Font(R.font.space_grotesk_*) when font files added
val InterFamily  = FontFamily.Default
val JetBrainsMono = FontFamily.Monospace

val AppTypography = Typography(
    // Display — hero headings
    displayLarge = TextStyle(
        fontFamily = SpaceGrotesk,
        fontWeight = FontWeight.Bold,
        fontSize = 48.sp,
        lineHeight = 52.sp,
        letterSpacing = (-1.5).sp
    ),
    displayMedium = TextStyle(
        fontFamily = SpaceGrotesk,
        fontWeight = FontWeight.Bold,
        fontSize = 36.sp,
        lineHeight = 40.sp,
        letterSpacing = (-1).sp
    ),
    displaySmall = TextStyle(
        fontFamily = SpaceGrotesk,
        fontWeight = FontWeight.SemiBold,
        fontSize = 28.sp,
        lineHeight = 32.sp,
        letterSpacing = (-0.5).sp
    ),
    // Headlines — section titles
    headlineLarge = TextStyle(
        fontFamily = SpaceGrotesk,
        fontWeight = FontWeight.Bold,
        fontSize = 24.sp,
        lineHeight = 28.sp,
        letterSpacing = (-0.3).sp
    ),
    headlineMedium = TextStyle(
        fontFamily = SpaceGrotesk,
        fontWeight = FontWeight.SemiBold,
        fontSize = 20.sp,
        lineHeight = 24.sp,
    ),
    headlineSmall = TextStyle(
        fontFamily = SpaceGrotesk,
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
        lineHeight = 22.sp,
    ),
    // Title — card headers
    titleLarge = TextStyle(
        fontFamily = SpaceGrotesk,
        fontWeight = FontWeight.Medium,
        fontSize = 16.sp,
        lineHeight = 20.sp,
    ),
    titleMedium = TextStyle(
        fontFamily = InterFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 15.sp,
        lineHeight = 20.sp,
    ),
    titleSmall = TextStyle(
        fontFamily = InterFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 13.sp,
        lineHeight = 18.sp,
    ),
    // Body
    bodyLarge = TextStyle(
        fontFamily = InterFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 15.sp,
        lineHeight = 24.sp,
    ),
    bodyMedium = TextStyle(
        fontFamily = InterFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
    ),
    bodySmall = TextStyle(
        fontFamily = InterFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 13.sp,
        lineHeight = 18.sp,
    ),
    // Labels — mono telemetry, tags
    labelLarge = TextStyle(
        fontFamily = JetBrainsMono,
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.8.sp
    ),
    labelMedium = TextStyle(
        fontFamily = JetBrainsMono,
        fontWeight = FontWeight.Normal,
        fontSize = 11.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.6.sp
    ),
    labelSmall = TextStyle(
        fontFamily = JetBrainsMono,
        fontWeight = FontWeight.Normal,
        fontSize = 10.sp,
        lineHeight = 14.sp,
        letterSpacing = 1.sp
    ),
)
