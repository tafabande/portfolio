package com.bleighbande.portfolio.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bleighbande.portfolio.data.model.*
import com.bleighbande.portfolio.ui.components.StatusDot
import com.bleighbande.portfolio.ui.theme.*
import com.bleighbande.portfolio.ui.viewmodel.ProfileViewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: ProfileViewModel,
    onEditProfile: () -> Unit,
    onEducation: () -> Unit,
    onExperience: () -> Unit,
    onSkills: () -> Unit,
    onProjects: () -> Unit,
    onUpload: () -> Unit
) {
    val state = viewModel.uiState
    val isOnline = viewModel.isServerOnline
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    LaunchedEffect(state.error, state.successMessage) {
        state.error?.let {
            snackbarHostState.showSnackbar(it, duration = SnackbarDuration.Short)
            viewModel.clearMessage()
        }
        state.successMessage?.let {
            snackbarHostState.showSnackbar(it, duration = SnackbarDuration.Short)
            viewModel.clearMessage()
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Portfolio Builder",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            StatusDot(isOnline)
                            Text(
                                text = if (isOnline == true) "Connected" else if (isOnline == false) "Offline" else "Checking…",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                },
                actions = {
                    IconButton(onClick = { viewModel.loadAll() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(vertical = 16.dp)
        ) {
            // ── Profile hero card ───────────────────────────────────────────────
            item {
                AnimatedVisibility(
                    visible = true,
                    enter = fadeIn() + slideInVertically()
                ) {
                    ProfileHeroCard(
                        name = state.profile.fullName,
                        email = state.profile.email,
                        location = state.profile.location,
                        bio = state.profile.bio,
                        onClick = onEditProfile
                    )
                }
            }

            // ── Stats row ───────────────────────────────────────────────────────
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard("Education", state.education.size.toString(), "🎓", Modifier.weight(1f))
                    StatCard("Experience", state.experience.size.toString(), "💼", Modifier.weight(1f))
                    StatCard("Skills", state.skills.size.toString(), "⚡", Modifier.weight(1f))
                    StatCard("Projects", state.projects.size.toString(), "🔧", Modifier.weight(1f))
                }
            }

            // ── Navigation grid ─────────────────────────────────────────────────
            item {
                Text(
                    text = "Profile sections".uppercase(),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.padding(bottom = 4.dp)
                )
            }
            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    NavTile(
                        icon = Icons.Default.School,
                        title = "Education",
                        subtitle = "${state.education.size} entries",
                        onClick = onEducation
                    )
                    NavTile(
                        icon = Icons.Default.Work,
                        title = "Experience",
                        subtitle = "${state.experience.size} positions",
                        onClick = onExperience
                    )
                    NavTile(
                        icon = Icons.Default.Code,
                        title = "Skills",
                        subtitle = "${state.skills.size} skills",
                        onClick = onSkills
                    )
                    NavTile(
                        icon = Icons.Default.FolderOpen,
                        title = "Projects",
                        subtitle = "${state.projects.size} projects",
                        onClick = onProjects
                    )
                }
            }

            // ── Import CV ───────────────────────────────────────────────────────
            item {
                Text(
                    text = "Import".uppercase(),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.padding(bottom = 4.dp, top = 8.dp)
                )
            }
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onUpload() },
                    shape = RoundedCornerShape(12.dp),
                    color = AmberSubtle,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Amber400.copy(alpha = 0.3f))
                ) {
                    Row(
                        modifier = Modifier.padding(20.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Text("📄", fontSize = 28.sp)
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                "Import from CV",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.SemiBold,
                                color = Amber300
                            )
                            Text(
                                "Upload a PDF and we'll extract your info automatically",
                                style = MaterialTheme.typography.bodySmall,
                                color = Amber400.copy(alpha = 0.8f)
                            )
                        }
                        Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Amber400)
                    }
                }
            }

            // ── GitHub Authorization Card ───────────────────────────────────────
            item {
                Text(
                    text = "GitHub Authorization".uppercase(),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.padding(bottom = 4.dp, top = 8.dp)
                )
            }
            item {
                val auth = state.authStatus
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    color = MaterialTheme.colorScheme.surface,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "GitHub: @${auth.username}",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.SemiBold
                                )
                                Text(
                                    text = "Target: ${auth.repoOwner}/${auth.repoName} (main)",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(50),
                                color = if (auth.linked) SignalGreen.copy(alpha = 0.15f) else AmberSubtle
                            ) {
                                Text(
                                    text = if (auth.linked) "✓ Authorized" else "Unlinked",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = if (auth.linked) SignalGreen else Amber400,
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                )
                            }
                        }
                    }
                }
            }

            // ── Analytics Summary Card ──────────────────────────────────────────
            item {
                Text(
                    text = "Live Telemetry & Views".uppercase(),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.padding(bottom = 4.dp, top = 4.dp)
                )
            }
            item {
                val analytics = state.analytics
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard("Views", analytics.totalViews.toString(), "👁", Modifier.weight(1f))
                    StatCard("Visitors", analytics.uniqueVisitors.toString(), "👤", Modifier.weight(1f))
                    StatCard("CV Opens", analytics.cvOpens.toString(), "📄", Modifier.weight(1f))
                    StatCard("Clicks", analytics.projectClicks.toString(), "🔗", Modifier.weight(1f))
                }
            }

            // ── Sync button ─────────────────────────────────────────────────────
            item {
                var syncLoading by remember { mutableStateOf(false) }
                var lastSha by remember { mutableStateOf<String?>(null) }

                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = {
                            syncLoading = true
                            viewModel.syncPortfolio { success, msg, ghResult ->
                                syncLoading = false
                                if (ghResult?.published == true) {
                                    lastSha = ghResult.commitSha
                                }
                                scope.launch {
                                    val feedback = if (ghResult?.published == true)
                                        "✓ Synced & Auto-Committed to GitHub (${ghResult.commitSha})!"
                                    else if (success) "✓ $msg"
                                    else "✕ $msg"
                                    snackbarHostState.showSnackbar(feedback)
                                }
                            }
                        },
                        modifier = Modifier.fillMaxWidth().height(52.dp),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                    ) {
                        if (syncLoading) {
                            CircularProgressIndicator(Modifier.size(18.dp), strokeWidth = 2.dp, color = MaterialTheme.colorScheme.onPrimary)
                        } else {
                            Icon(Icons.Default.Sync, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Publish & Commit to GitHub", fontWeight = FontWeight.Bold)
                        }
                    }
                    if (lastSha != null) {
                        Text(
                            text = "✓ GitHub Commit SHA: $lastSha",
                            style = MaterialTheme.typography.labelMedium,
                            color = SignalGreen
                        )
                    }
                }
            }


            item { Spacer(Modifier.height(32.dp)) }
        }
    }
}

@Composable
private fun ProfileHeroCard(
    name: String,
    email: String?,
    location: String?,
    bio: String?,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column {
                    // Avatar initials
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(AmberSubtle),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = name.split(" ").take(2).mapNotNull { it.firstOrNull()?.toString() }.joinToString(""),
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                            color = Amber400
                        )
                    }
                }
                Icon(
                    Icons.Default.Edit,
                    contentDescription = "Edit",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier.size(18.dp)
                )
            }
            Spacer(Modifier.height(16.dp))
            Text(
                text = name,
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            if (email != null || location != null) {
                Spacer(Modifier.height(6.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    email?.let {
                        Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    location?.let {
                        Text("· $it", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
            if (!bio.isNullOrBlank()) {
                Spacer(Modifier.height(12.dp))
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                Spacer(Modifier.height(12.dp))
                Text(
                    text = bio,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 3
                )
            }
        }
    }
}

@Composable
private fun StatCard(label: String, value: String, icon: String, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(10.dp),
        color = MaterialTheme.colorScheme.surface,
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(icon, fontSize = 18.sp)
            Text(
                text = value,
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontSize = 9.sp
            )
        }
    }
}

@Composable
private fun NavTile(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(10.dp),
        color = MaterialTheme.colorScheme.surface,
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(22.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Medium)
                Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Icon(Icons.Default.ChevronRight, contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f),
                modifier = Modifier.size(18.dp))
        }
    }
}
