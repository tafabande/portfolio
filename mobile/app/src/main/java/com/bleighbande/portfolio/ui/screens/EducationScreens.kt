package com.bleighbande.portfolio.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.bleighbande.portfolio.data.model.Education
import com.bleighbande.portfolio.ui.components.*
import com.bleighbande.portfolio.ui.viewmodel.ProfileViewModel

// ── Education list ────────────────────────────────────────────────────────────
@Composable
fun EducationScreen(
    viewModel: ProfileViewModel,
    onBack: () -> Unit,
    onAdd: () -> Unit
) {
    val state = viewModel.uiState
    Scaffold(
        topBar = { AppTopBar(title = "Education", onBack = onBack) },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onAdd,
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary
            ) { Icon(Icons.Default.Add, contentDescription = "Add education") }
        }
    ) { padding ->
        if (state.education.isEmpty()) {
            Box(Modifier.fillMaxSize().padding(padding)) {
                EmptyState(
                    icon = "🎓",
                    title = "No education yet",
                    subtitle = "Add your qualifications — university, college, certifications.",
                    actionLabel = "Add education",
                    onAction = onAdd
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(padding).padding(horizontal = 20.dp),
                contentPadding = PaddingValues(vertical = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(state.education, key = { it.id }) { edu ->
                    EntryCard(
                        title = edu.institution,
                        subtitle = edu.displayTitle,
                        dateRange = edu.dateRange,
                        description = edu.description,
                        onDelete = { viewModel.deleteEducation(edu.id) }
                    )
                }
            }
        }
    }
}

// ── Add education form ────────────────────────────────────────────────────────
@Composable
fun AddEducationScreen(
    viewModel: ProfileViewModel,
    onBack: () -> Unit,
    onSaved: () -> Unit
) {
    val state = viewModel.uiState
    var institution by remember { mutableStateOf("") }
    var qualification by remember { mutableStateOf("") }
    var field by remember { mutableStateOf("") }
    var startDate by remember { mutableStateOf("") }
    var endDate by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var instError by remember { mutableStateOf(false) }

    Scaffold(topBar = { AppTopBar(title = "Add Education", onBack = onBack) }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Spacer(Modifier.height(8.dp))

            AppTextField(
                value = institution, onValueChange = { institution = it; instError = false },
                label = "Institution *", placeholder = "University of Zimbabwe",
                isError = instError, errorMessage = "Required"
            )
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                AppTextField(
                    value = qualification, onValueChange = { qualification = it },
                    label = "Qualification", placeholder = "BSc Engineering",
                    modifier = Modifier.weight(1f)
                )
                AppTextField(
                    value = field, onValueChange = { field = it },
                    label = "Field", placeholder = "Telecom",
                    modifier = Modifier.weight(1f)
                )
            }
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                AppTextField(
                    value = startDate, onValueChange = { startDate = it },
                    label = "Start", placeholder = "2022",
                    modifier = Modifier.weight(1f)
                )
                AppTextField(
                    value = endDate, onValueChange = { endDate = it },
                    label = "End", placeholder = "2026",
                    modifier = Modifier.weight(1f)
                )
            }
            AppTextField(
                value = description, onValueChange = { description = it },
                label = "Description", placeholder = "Coursework, achievements…",
                singleLine = false, maxLines = 4
            )

            PrimaryButton(
                text = "Save",
                isLoading = state.isLoading,
                onClick = {
                    if (institution.isBlank()) { instError = true; return@PrimaryButton }
                    viewModel.addEducation(
                        Education(
                            institution = institution,
                            qualification = qualification.ifBlank { null },
                            field = field.ifBlank { null },
                            startDate = startDate.ifBlank { null },
                            endDate = endDate.ifBlank { null },
                            description = description.ifBlank { null }
                        ),
                        onSuccess = onSaved
                    )
                }
            )
        }
    }
}
