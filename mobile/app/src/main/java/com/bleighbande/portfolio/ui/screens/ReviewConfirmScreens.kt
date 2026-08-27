package com.bleighbande.portfolio.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bleighbande.portfolio.data.model.ExtractedProfile
import com.bleighbande.portfolio.ui.components.*
import com.bleighbande.portfolio.ui.theme.SignalGreen
import com.bleighbande.portfolio.ui.theme.SignalAmber
import com.bleighbande.portfolio.ui.theme.SignalRed
import com.bleighbande.portfolio.ui.viewmodel.ProfileViewModel

// ── Review ────────────────────────────────────────────────────────────────────
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ReviewScreen(
    viewModel: ProfileViewModel,
    onBack: () -> Unit,
    onConfirm: () -> Unit
) {
    val state = viewModel.uploadState
    val profile = state.extractedProfile
    val confidence = state.confidence

    Scaffold(topBar = { AppTopBar(title = "Review Extraction", onBack = onBack) }) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 20.dp),
            contentPadding = PaddingValues(vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                LedgerCard {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("🔍", fontSize = 20.sp)
                        Column {
                            Text("Check extracted data", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                            Text("Confidence scores show how certain extraction was", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }

            if (profile == null) {
                item {
                    EmptyState("🤔", "No data extracted", "The document may not have enough readable text. Try a different PDF.")
                }
            } else {
                // Personal
                item {
                    SectionHeader("Personal information")
                    ReviewCard {
                        profile.personal?.let { p ->
                            ReviewField("Name", listOfNotNull(p.firstName, p.lastName).joinToString(" "), confidence["name"])
                            ReviewField("Email", p.email, confidence["email"])
                            ReviewField("Phone", p.phone, confidence["phone"])
                            ReviewField("Location", p.location, confidence["location"])
                        } ?: Text("No personal info found", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }

                // Education
                item {
                    SectionHeader("Education")
                    ReviewCard {
                        if (profile.education.isNullOrEmpty()) {
                            Text("No education found", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        } else {
                            profile.education.forEachIndexed { i, e ->
                                if (i > 0) HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.outlineVariant)
                                Text(e.institution ?: "—", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
                                Text("${e.qualification ?: ""} ${e.field ?: ""}".trim(), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text("${e.startDate ?: ""} – ${e.endDate ?: ""}".trim(' ', '–', ' '), style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary.copy(alpha = 0.7f))
                            }
                        }
                    }
                }

                // Experience
                item {
                    SectionHeader("Experience")
                    ReviewCard {
                        if (profile.experience.isNullOrEmpty()) {
                            Text("No experience found", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        } else {
                            profile.experience.forEachIndexed { i, e ->
                                if (i > 0) HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.outlineVariant)
                                Text(e.position ?: e.company ?: "—", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
                                Text(e.company ?: "", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text("${e.startDate ?: ""} – ${e.endDate ?: ""}".trim(), style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary.copy(alpha = 0.7f))
                            }
                        }
                    }
                }

                // Skills
                item {
                    SectionHeader("Skills")
                    ReviewCard {
                        if (profile.skills.isNullOrEmpty()) {
                            Text("No skills found", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        } else {
                            FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                profile.skills.forEach { SkillChip(it.name) }
                            }
                        }
                    }
                }

                item {
                    PrimaryButton(
                        text = "Confirm & import",
                        onClick = {
                            viewModel.confirmExtraction { onConfirm() }
                        }
                    )
                }

                item {
                    OutlinedButton(
                        onClick = onBack,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp)
                    ) { Text("← Back") }
                }
            }

            item { Spacer(Modifier.height(32.dp)) }
        }
    }
}

@Composable
private fun ReviewCard(content: @Composable ColumnScope.() -> Unit) {
    LedgerCard { content() }
}

@Composable
private fun ReviewField(label: String, value: String?, confidence: Int?) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(label.uppercase(), style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(
                text = value?.ifBlank { "—" } ?: "—",
                style = MaterialTheme.typography.bodyMedium,
                color = if (value.isNullOrBlank()) MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f) else MaterialTheme.colorScheme.onSurface
            )
        }
        if (confidence != null) {
            val (color, label2) = when {
                confidence >= 80 -> SignalGreen to "High"
                confidence >= 60 -> SignalAmber to "Mid"
                else             -> SignalRed   to "Low"
            }
            Surface(
                shape = RoundedCornerShape(50),
                color = color.copy(alpha = 0.12f)
            ) {
                Text(
                    text = "$confidence%",
                    style = MaterialTheme.typography.labelSmall,
                    color = color,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                )
            }
        }
    }
}

// ── Confirm ───────────────────────────────────────────────────────────────────
@Composable
fun ConfirmScreen(
    viewModel: ProfileViewModel,
    onGoHome: () -> Unit
) {
    var syncLoading by remember { mutableStateOf(false) }
    var syncResult  by remember { mutableStateOf<String?>(null) }
    var syncSuccess by remember { mutableStateOf(false) }

    Scaffold(topBar = { AppTopBar(title = "Done") }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Surface(
                shape = androidx.compose.foundation.shape.CircleShape,
                color = SignalGreen.copy(alpha = 0.12f),
                modifier = Modifier.size(88.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text("✓", fontSize = 36.sp, color = SignalGreen)
                }
            }

            Spacer(Modifier.height(24.dp))

            Text(
                "Profile confirmed!",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(Modifier.height(8.dp))
            Text(
                "Your profile is saved. Sync it to your portfolio or continue editing.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )

            Spacer(Modifier.height(32.dp))

            PrimaryButton(
                text = if (syncSuccess) "✓ Synced!" else "Sync to portfolio",
                isLoading = syncLoading,
                enabled = !syncSuccess,
                onClick = {
                    syncLoading = true
                    viewModel.syncPortfolio { ok, msg, _ ->
                        syncLoading = false
                        syncResult  = msg
                        syncSuccess = ok
                    }
                }
            )

            syncResult?.let {
                Spacer(Modifier.height(12.dp))
                Text(
                    text = it,
                    style = MaterialTheme.typography.labelSmall,
                    color = if (syncSuccess) SignalGreen else MaterialTheme.colorScheme.error,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )
            }

            Spacer(Modifier.height(12.dp))

            OutlinedButton(
                onClick = onGoHome,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp)
            ) { Text("← Back to home") }

            Spacer(Modifier.height(48.dp))
        }
    }
}
