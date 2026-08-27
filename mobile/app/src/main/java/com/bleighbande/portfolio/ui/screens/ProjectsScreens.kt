package com.bleighbande.portfolio.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.OpenInBrowser
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.bleighbande.portfolio.data.model.Project
import com.bleighbande.portfolio.ui.components.*
import com.bleighbande.portfolio.ui.theme.SignalRed
import com.bleighbande.portfolio.ui.viewmodel.ProfileViewModel

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ProjectsScreen(
    viewModel: ProfileViewModel,
    onBack: () -> Unit,
    onAdd: () -> Unit
) {
    val state = viewModel.uiState
    val uriHandler = LocalUriHandler.current

    Scaffold(
        topBar = { AppTopBar(title = "Projects", onBack = onBack) },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onAdd,
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary
            ) { Icon(Icons.Default.Add, contentDescription = "Add project") }
        }
    ) { padding ->
        if (state.projects.isEmpty()) {
            Box(Modifier.fillMaxSize().padding(padding)) {
                EmptyState("🔧", "No projects yet", "Show off your side projects, open-source work, or academic projects.", "Add project", onAdd)
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(padding).padding(horizontal = 20.dp),
                contentPadding = PaddingValues(vertical = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(state.projects, key = { it.id }) { proj ->
                    LedgerCard {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(proj.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                                if (!proj.description.isNullOrBlank()) {
                                    Spacer(Modifier.height(6.dp))
                                    Text(proj.description, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 2)
                                }
                            }
                            Row {
                                if (!proj.url.isNullOrBlank()) {
                                    IconButton(onClick = { uriHandler.openUri(proj.url) }) {
                                        Icon(Icons.Default.OpenInBrowser, contentDescription = "Open", tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(18.dp))
                                    }
                                }
                                IconButton(onClick = { viewModel.deleteProject(proj.id) }) {
                                    Icon(Icons.Default.Delete, contentDescription = "Delete", tint = SignalRed.copy(alpha = 0.7f), modifier = Modifier.size(18.dp))
                                }
                            }
                        }
                        if (!proj.technologies.isNullOrEmpty()) {
                            Spacer(Modifier.height(10.dp))
                            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                            Spacer(Modifier.height(10.dp))
                            androidx.compose.foundation.layout.FlowRow(
                                horizontalArrangement = Arrangement.spacedBy(6.dp),
                                verticalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                proj.technologies.forEach { tech ->
                                    SuggestionChip(onClick = {}, label = { Text(tech, style = MaterialTheme.typography.labelSmall) })
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AddProjectScreen(
    viewModel: ProfileViewModel,
    onBack: () -> Unit,
    onSaved: () -> Unit
) {
    val state = viewModel.uiState
    var name by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var technologies by remember { mutableStateOf("") }
    var url by remember { mutableStateOf("") }

    Scaffold(topBar = { AppTopBar(title = "Add Project", onBack = onBack) }) { padding ->
        Column(
            modifier = Modifier.fillMaxSize().padding(padding).padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Spacer(Modifier.height(8.dp))
            AppTextField(value = name, onValueChange = { name = it }, label = "Project name *", placeholder = "Network Monitor Dashboard")
            AppTextField(value = description, onValueChange = { description = it }, label = "Description", placeholder = "What it does, what problem it solves…", singleLine = false, maxLines = 4)
            AppTextField(value = technologies, onValueChange = { technologies = it }, label = "Technologies", placeholder = "Python, Flask, React (comma-separated)")
            AppTextField(value = url, onValueChange = { url = it }, label = "URL", placeholder = "https://github.com/you/repo")
            PrimaryButton(
                text = "Save",
                isLoading = state.isLoading,
                onClick = {
                    if (name.isBlank()) return@PrimaryButton
                    viewModel.addProject(
                        Project(
                            name = name,
                            description = description.ifBlank { null },
                            technologies = technologies.split(",").map { it.trim() }.filter { it.isNotBlank() },
                            url = url.ifBlank { null }
                        ),
                        onSuccess = onSaved
                    )
                }
            )
        }
    }
}
