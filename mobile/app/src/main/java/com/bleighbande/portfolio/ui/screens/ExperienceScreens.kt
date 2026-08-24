package com.bleighbande.portfolio.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.bleighbande.portfolio.data.model.Experience
import com.bleighbande.portfolio.ui.components.*
import com.bleighbande.portfolio.ui.viewmodel.ProfileViewModel

@Composable
fun ExperienceScreen(
    viewModel: ProfileViewModel,
    onBack: () -> Unit,
    onAdd: () -> Unit
) {
    val state = viewModel.uiState
    Scaffold(
        topBar = { AppTopBar(title = "Experience", onBack = onBack) },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onAdd,
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary
            ) { Icon(Icons.Default.Add, contentDescription = "Add experience") }
        }
    ) { padding ->
        if (state.experience.isEmpty()) {
            Box(Modifier.fillMaxSize().padding(padding)) {
                EmptyState("💼", "No experience yet", "Add your work history, internships, or freelance work.", "Add experience", onAdd)
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(padding).padding(horizontal = 20.dp),
                contentPadding = PaddingValues(vertical = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(state.experience, key = { it.id }) { exp ->
                    EntryCard(
                        title = exp.position ?: "Position",
                        subtitle = exp.company + if (!exp.location.isNullOrBlank()) " · ${exp.location}" else "",
                        dateRange = exp.dateRange,
                        description = exp.description,
                        onDelete = { viewModel.deleteExperience(exp.id) }
                    )
                }
            }
        }
    }
}

@Composable
fun AddExperienceScreen(
    viewModel: ProfileViewModel,
    onBack: () -> Unit,
    onSaved: () -> Unit
) {
    val state = viewModel.uiState
    var position by remember { mutableStateOf("") }
    var company by remember { mutableStateOf("") }
    var startDate by remember { mutableStateOf("") }
    var endDate by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }

    Scaffold(topBar = { AppTopBar(title = "Add Experience", onBack = onBack) }) { padding ->
        Column(
            modifier = Modifier.fillMaxSize().padding(padding).padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                AppTextField(value = position, onValueChange = { position = it }, label = "Job title", placeholder = "Network Intern", modifier = Modifier.weight(1f))
                AppTextField(value = company, onValueChange = { company = it }, label = "Company", placeholder = "ABC Telecom", modifier = Modifier.weight(1f))
            }
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                AppTextField(value = startDate, onValueChange = { startDate = it }, label = "Start", placeholder = "Jun 2025", modifier = Modifier.weight(1f))
                AppTextField(value = endDate, onValueChange = { endDate = it }, label = "End", placeholder = "Present", modifier = Modifier.weight(1f))
            }
            AppTextField(value = location, onValueChange = { location = it }, label = "Location", placeholder = "Harare, Zimbabwe")
            AppTextField(value = description, onValueChange = { description = it }, label = "Description", placeholder = "Key responsibilities…", singleLine = false, maxLines = 4)
            PrimaryButton(
                text = "Save",
                isLoading = state.isLoading,
                onClick = {
                    viewModel.addExperience(
                        Experience(
                            company = company, position = position.ifBlank { null },
                            startDate = startDate.ifBlank { null }, endDate = endDate.ifBlank { null },
                            location = location.ifBlank { null }, description = description.ifBlank { null }
                        ),
                        onSuccess = onSaved
                    )
                }
            )
        }
    }
}
