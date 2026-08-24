# Portfolio Android App — Kotlin / Jetpack Compose

A native Android application for building and managing your professional portfolio.
Connects to the **CV Ingestion App** backend (`../ingestion-app/`) running on `localhost:3737`.

## Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Language    | Kotlin                              |
| UI          | Jetpack Compose + Material 3        |
| Navigation  | Navigation Compose                  |
| Networking  | Retrofit 2 + OkHttp                 |
| Architecture| MVVM + Repository                   |
| Min SDK     | API 26 (Android 8.0)                |
| Target SDK  | API 35 (Android 15)                 |

## Project structure

```
app/src/main/java/com/bleighbande/portfolio/
├── MainActivity.kt
├── data/
│   ├── api/          PortfolioApi.kt   (Retrofit interface)
│   ├── model/        Models.kt         (data classes)
│   └── repository/   ProfileRepository.kt
├── ui/
│   ├── components/   Components.kt     (shared Compose components)
│   ├── navigation/   NavGraph.kt       (12 routes)
│   ├── screens/
│   │   ├── HomeScreen.kt
│   │   ├── ProfileEditScreen.kt
│   │   ├── EducationScreens.kt
│   │   ├── ExperienceScreens.kt
│   │   ├── SkillsScreen.kt
│   │   ├── ProjectsScreens.kt
│   │   ├── UploadScreens.kt          (upload + processing pipeline)
│   │   └── ReviewConfirmScreens.kt
│   ├── theme/
│   │   ├── Color.kt
│   │   ├── ColorScheme.kt
│   │   ├── Type.kt
│   │   └── Theme.kt
│   └── viewmodel/    ProfileViewModel.kt
```

## Getting started

### Prerequisites
- [Android Studio Koala](https://developer.android.com/studio) or newer
- Android device or emulator (API 26+)
- Backend server running (`node server.js` in `../ingestion-app/`)

### Run

1. **Open** `mobile/` folder in Android Studio (`File → Open`)
2. **Wait** for Gradle sync to complete
3. **Start the backend** in a terminal:
   ```
   cd ../ingestion-app
   node server.js
   ```
4. **For emulator**: the default `BASE_URL` is `http://10.0.2.2:3737/` (loopback mapping)
5. **For physical device**: edit `app/build.gradle.kts`:
   ```kotlin
   buildConfigField("String", "BASE_URL", "\"http://<YOUR_PC_IP>:3737/\"")
   ```
6. **Run** the app with ▶ in Android Studio

## Screens

| Screen        | Description                                        |
|---------------|----------------------------------------------------|
| Home          | Dashboard — profile hero, stats, nav tiles, sync   |
| Profile Edit  | Personal info form                                 |
| Education     | List + Add qualification                          |
| Experience    | List + Add work history                           |
| Skills        | Tag-based input with suggestions                  |
| Projects      | List + Add project with tech chips                |
| Upload        | PDF file picker + client validation               |
| Processing    | Live pipeline stages with polling                 |
| Review        | Extracted data with confidence scores             |
| Confirm       | Success state + portfolio sync trigger            |

## Design

Dark Warm Carbon theme matching the portfolio's `design.md` design system:
- Background: `oklch(14% 0.008 55)` → `#141210`
- Accent:     `oklch(68% 0.20 48)` → `#E8922A` (Signal Amber)
- Typography: Space Grotesk (headings) · Inter (body) · JetBrains Mono (labels)
