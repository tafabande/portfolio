package com.bleighbande.portfolio.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import com.bleighbande.portfolio.ui.components.*
import com.bleighbande.portfolio.ui.viewmodel.ProfileViewModel

val SUGGESTED_SKILLS = listOf(
    "Python","JavaScript","TypeScript","Java","C","C++","Kotlin","Bash",
    "Cisco","Huawei","Mikrotik","TCP/IP","OSPF","BGP","LTE","5G","Wireshark","GNS3",
    "React","Vue","Node.js","Express","Django","Flask","FastAPI",
    "AWS","Azure","Docker","Kubernetes","Linux","Git","CI/CD",
    "MySQL","PostgreSQL","MongoDB","SQLite","Redis",
    "HTML","CSS","SQL","MATLAB","R"
)

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SkillsScreen(
    viewModel: ProfileViewModel,
    onBack: () -> Unit
) {
    val state = viewModel.uiState
    var input by remember { mutableStateOf("") }
    val focusRequester = remember { FocusRequester() }

    val suggestions = remember(input) {
        if (input.length < 2) emptyList()
        else SUGGESTED_SKILLS.filter {
            it.contains(input, ignoreCase = true) &&
            state.skills.none { s -> s.name.equals(it, ignoreCase = true) }
        }.take(6)
    }

    Scaffold(topBar = { AppTopBar(title = "Skills", onBack = onBack) }) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding).padding(horizontal = 20.dp),
            contentPadding = PaddingValues(vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                // Input row
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedTextField(
                        value = input,
                        onValueChange = { input = it },
                        label = { Text("Add skill") },
                        placeholder = { Text("Python, Cisco, React…") },
                        modifier = Modifier.weight(1f).focusRequester(focusRequester),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                        keyboardActions = KeyboardActions(onDone = {
                            if (input.isNotBlank()) { viewModel.addSkill(input.trim()); input = "" }
                        }),
                        shape = androidx.compose.foundation.shape.RoundedCornerShape(8.dp)
                    )
                    Button(
                        onClick = { if (input.isNotBlank()) { viewModel.addSkill(input.trim()); input = "" } },
                        modifier = Modifier.height(56.dp)
                    ) { Text("Add") }
                }
            }

            // Suggestions
            if (suggestions.isNotEmpty()) {
                item {
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("Suggestions", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        androidx.compose.foundation.layout.FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            suggestions.forEach { suggestion ->
                                SuggestionChip(
                                    onClick = { viewModel.addSkill(suggestion); input = "" },
                                    label = { Text(suggestion) }
                                )
                            }
                        }
                    }
                }
            }

            if (state.skills.isNotEmpty()) {
                item {
                    Text(
                        "${state.skills.size} skills".uppercase(),
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                item {
                    androidx.compose.foundation.layout.FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        state.skills.forEach { skill ->
                            SkillChip(
                                name = skill.name,
                                onRemove = { viewModel.deleteSkill(skill.id) }
                            )
                        }
                    }
                }
            } else {
                item {
                    EmptyState(
                        icon = "⚡",
                        title = "No skills yet",
                        subtitle = "Type a skill name above and tap Add."
                    )
                }
            }
        }
    }
}
