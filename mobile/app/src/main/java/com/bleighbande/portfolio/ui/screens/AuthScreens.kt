package com.bleighbande.portfolio.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.bleighbande.portfolio.ui.components.*
import com.bleighbande.portfolio.ui.viewmodel.ProfileViewModel

@Composable
fun LoginScreen(
    viewModel: ProfileViewModel,
    onLoginSuccess: () -> Unit,
    onNavigateRegister: () -> Unit
) {
    val state = viewModel.uiState
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var emailError by remember { mutableStateOf(false) }
    var passError by remember { mutableStateOf(false) }

    Scaffold(
        topBar = { AppTopBar(title = "Sign In") }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Welcome Back",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = "Sign in to manage your portfolio, CVs, and view live telemetry.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(32.dp))

            AppTextField(
                value = email,
                onValueChange = { email = it; emailError = false },
                label = "Email address",
                placeholder = "you@example.com",
                isError = emailError,
                errorMessage = "Email is required"
            )

            Spacer(Modifier.height(12.dp))

            OutlinedTextField(
                value = password,
                onValueChange = { password = it; passError = false },
                label = { Text("Password") },
                singleLine = true,
                isError = passError,
                visualTransformation = PasswordVisualTransformation(),
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.primary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant
                )
            )

            Spacer(Modifier.height(24.dp))

            PrimaryButton(
                text = "Sign In",
                isLoading = state.isLoading,
                onClick = {
                    if (email.isBlank()) { emailError = true; return@PrimaryButton }
                    if (password.isBlank()) { passError = true; return@PrimaryButton }
                    viewModel.loginUser(email, password, onSuccess = onLoginSuccess)
                }
            )

            Spacer(Modifier.height(16.dp))

            TextButton(onClick = onNavigateRegister) {
                Text("Don't have an account? Sign Up")
            }
        }
    }
}

@Composable
fun RegisterScreen(
    viewModel: ProfileViewModel,
    onRegisterSuccess: () -> Unit,
    onNavigateLogin: () -> Unit
) {
    val state = viewModel.uiState
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }

    Scaffold(
        topBar = { AppTopBar(title = "Create Account") }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Create Account",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = "Set up your account to own and manage your portfolio.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(24.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                AppTextField(
                    value = firstName,
                    onValueChange = { firstName = it },
                    label = "First name",
                    placeholder = "Bleigh",
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

            Spacer(Modifier.height(12.dp))

            AppTextField(
                value = email,
                onValueChange = { email = it },
                label = "Email address",
                placeholder = "you@example.com"
            )

            Spacer(Modifier.height(12.dp))

            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password (min 6 chars)") },
                singleLine = true,
                visualTransformation = PasswordVisualTransformation(),
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.primary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant
                )
            )

            Spacer(Modifier.height(24.dp))

            PrimaryButton(
                text = "Create Account",
                isLoading = state.isLoading,
                onClick = {
                    if (email.isNotBlank() && password.length >= 6) {
                        viewModel.registerUser(email, password, firstName, lastName, onSuccess = onRegisterSuccess)
                    }
                }
            )

            Spacer(Modifier.height(16.dp))

            TextButton(onClick = onNavigateLogin) {
                Text("Already have an account? Sign In")
            }
        }
    }
}
