package com.bleighbande.portfolio.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.bleighbande.portfolio.ui.components.*
import com.bleighbande.portfolio.ui.viewmodel.ProfileViewModel

@Composable
fun ProfileEditScreen(
    viewModel: ProfileViewModel,
    onBack: () -> Unit
) {
    val state = viewModel.uiState
    val profile = state.profile

    var firstName by remember(profile.firstName) { mutableStateOf(profile.firstName ?: "") }
    var lastName  by remember(profile.lastName)  { mutableStateOf(profile.lastName  ?: "") }
    var email     by remember(profile.email)     { mutableStateOf(profile.email     ?: "") }
    var phone     by remember(profile.phone)     { mutableStateOf(profile.phone     ?: "") }
    var location  by remember(profile.location)  { mutableStateOf(profile.location  ?: "") }
    var bio       by remember(profile.bio)       { mutableStateOf(profile.bio       ?: "") }

    var firstNameError by remember { mutableStateOf(false) }

    Scaffold(
        topBar = { AppTopBar(title = "Personal Info", onBack = onBack) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 20.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Spacer(Modifier.height(8.dp))

            SectionHeader("Contact")

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                AppTextField(
                    value = firstName,
                    onValueChange = { firstName = it; firstNameError = false },
                    label = "First name *",
                    placeholder = "Bleigh",
                    isError = firstNameError,
                    errorMessage = "Required",
                    modifier = Modifier.weight(1f)
                )
                AppTextField(
                    value = lastName,
                    onValueChange = { lastName = it },
                    label = "Last name",
                    placeholder = "Bande",
                    modifier = Modifier.weight(1f)
                )
            }

            AppTextField(
                value = email,
                onValueChange = { email = it },
                label = "Email",
                placeholder = "you@example.com"
            )
            AppTextField(
                value = phone,
                onValueChange = { phone = it },
                label = "Phone",
                placeholder = "+263 7X XXX XXXX"
            )
            AppTextField(
                value = location,
                onValueChange = { location = it },
                label = "Location",
                placeholder = "Gweru, Zimbabwe"
            )

            SectionHeader("Bio")

            AppTextField(
                value = bio,
                onValueChange = { bio = it },
                label = "Professional summary",
                placeholder = "A short paragraph about you…",
                singleLine = false,
                maxLines = 6
            )

            Spacer(Modifier.height(8.dp))

            PrimaryButton(
                text = "Save profile",
                isLoading = state.isLoading,
                onClick = {
                    if (firstName.isBlank()) { firstNameError = true; return@PrimaryButton }
                    viewModel.updateProfile(firstName, lastName, email, phone, location, bio) {
                        onBack()
                    }
                }
            )
            Spacer(Modifier.height(32.dp))
        }
    }
}
