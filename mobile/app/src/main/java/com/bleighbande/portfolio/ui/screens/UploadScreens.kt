package com.bleighbande.portfolio.ui.screens

import android.content.Context
import android.net.Uri
import android.provider.OpenableColumns
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.UploadFile
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bleighbande.portfolio.ui.components.*
import com.bleighbande.portfolio.ui.theme.*
import com.bleighbande.portfolio.ui.viewmodel.ProfileViewModel
import java.io.File
import java.io.FileOutputStream

@Composable
fun UploadScreen(
    viewModel: ProfileViewModel,
    onBack: () -> Unit,
    onProcessing: () -> Unit
) {
    val context = LocalContext.current
    var selectedUri by remember { mutableStateOf<Uri?>(null) }
    var selectedName by remember { mutableStateOf<String?>(null) }
    var selectedSize by remember { mutableStateOf<Long?>(null) }
    var clientError by remember { mutableStateOf<String?>(null) }

    val uploadState = viewModel.uploadState

    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri ->
        uri ?: return@rememberLauncherForActivityResult
        val info = context.getFileInfo(uri)
        if (info == null) { clientError = "Could not read file"; return@rememberLauncherForActivityResult }
        val (name, size) = info
        if (!name.lowercase().endsWith(".pdf")) { clientError = "Only PDF files are accepted"; return@rememberLauncherForActivityResult }
        if (size > 10 * 1024 * 1024) { clientError = "File is too large (max 10 MB)"; return@rememberLauncherForActivityResult }
        selectedUri = uri
        selectedName = name
        selectedSize = size
        clientError = null
    }

    LaunchedEffect(uploadState.jobStatus) {
        if (uploadState.jobStatus == "pending" || uploadState.jobStatus == "text_extracting" ||
            uploadState.jobStatus == "text_done"   || uploadState.jobStatus == "ai_extracting") {
            onProcessing()
        }
    }

    Scaffold(topBar = { AppTopBar(title = "Import CV", onBack = onBack) }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 20.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            LedgerCard {
                Text("How it works", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(12.dp))
                listOf(
                    "📄" to "Upload your PDF CV or résumé",
                    "🔍" to "We extract text and analyse structure",
                    "✏️" to "You review and correct the extracted data",
                    "✓"  to "Confirm and sync to your portfolio"
                ).forEachIndexed { i, (icon, text) ->
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.padding(vertical = 4.dp)) {
                        Text(icon, fontSize = 16.sp)
                        Text(text, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }

            // Drop zone
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .border(
                        width = 1.5.dp,
                        color = if (selectedUri != null) Amber400 else MaterialTheme.colorScheme.outlineVariant,
                        shape = RoundedCornerShape(12.dp)
                    )
                    .clickable { launcher.launch("application/pdf") },
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Icon(
                        Icons.Default.UploadFile,
                        contentDescription = null,
                        modifier = Modifier.size(48.dp),
                        tint = if (selectedUri != null) Amber400 else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f)
                    )
                    if (selectedUri != null) {
                        Text(selectedName ?: "file.pdf", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Medium, color = Amber400)
                        Text(
                            formatBytes(selectedSize ?: 0),
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    } else {
                        Text("Tap to choose a PDF", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Medium)
                        Text("PDF only · Max 10 MB", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center)
                    }
                }
            }

            clientError?.let {
                Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.error)
            }
            uploadState.error?.let {
                Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.error)
            }

            PrimaryButton(
                text = "Upload & Extract",
                isLoading = uploadState.isUploading,
                enabled = selectedUri != null && clientError == null,
                onClick = {
                    val uri = selectedUri ?: return@PrimaryButton
                    val file = uri.toTempFile(context) ?: return@PrimaryButton
                    viewModel.uploadDocument(file)
                }
            )

            OutlinedButton(
                onClick = onBack,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp)
            ) { Text("Skip — fill in manually") }
        }
    }
}

// ── Processing screen ─────────────────────────────────────────────────────────
@Composable
fun ProcessingScreen(
    viewModel: ProfileViewModel,
    onBack: () -> Unit,
    onReview: () -> Unit
) {
    val state = viewModel.uploadState

    LaunchedEffect(state.jobStatus) {
        if (state.jobStatus == "needs_review") {
            kotlinx.coroutines.delay(800)
            onReview()
        }
    }

    Scaffold(topBar = { AppTopBar(title = "Processing", onBack = onBack) }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 20.dp, vertical = 24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            LedgerCard {
                Column(verticalArrangement = Arrangement.spacedBy(0.dp)) {
                    listOf(
                        "uploaded"        to "File uploaded",
                        "text_extracting" to "Extracting text",
                        "text_done"       to "Text extracted",
                        "ai_extracting"   to "Analysing content",
                        "needs_review"    to "Ready for review"
                    ).forEachIndexed { i, (key, label) ->
                        val status = state.jobStatus
                        val stageOrder = listOf("uploaded","text_extracting","text_done","ai_extracting","needs_review")
                        val curIdx = stageOrder.indexOf(status).coerceAtLeast(0)
                        val thisIdx = i
                        val stageDone   = thisIdx < curIdx || status == "needs_review"
                        val stageActive = thisIdx == curIdx && status != "needs_review"

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            // Stage indicator
                            Surface(
                                shape = androidx.compose.foundation.shape.CircleShape,
                                color = when {
                                    stageDone   -> Amber400
                                    stageActive -> AmberSubtle
                                    else        -> MaterialTheme.colorScheme.surfaceVariant
                                },
                                modifier = Modifier.size(32.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    if (stageActive) {
                                        CircularProgressIndicator(
                                            modifier = Modifier.size(18.dp),
                                            strokeWidth = 2.dp,
                                            color = Amber400
                                        )
                                    } else {
                                        Text(
                                            if (stageDone) "✓" else "${i + 1}",
                                            style = MaterialTheme.typography.labelMedium,
                                            color = if (stageDone) Carbon900 else MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }
                            }
                            Text(
                                text = label,
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = if (stageActive) FontWeight.SemiBold else FontWeight.Normal,
                                color = when {
                                    stageDone   -> MaterialTheme.colorScheme.onSurface
                                    stageActive -> Amber400
                                    else        -> MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
                                }
                            )
                        }
                        if (i < 4) HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                    }
                }
            }

            if (state.error != null) {
                LedgerCard {
                    Text("Extraction failed", style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.error, fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.height(8.dp))
                    Text(state.error, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(Modifier.height(16.dp))
                    PrimaryButton(text = "Retry", onClick = { viewModel.retryExtraction() })
                }
            }
        }
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

private fun Context.getFileInfo(uri: Uri): Pair<String, Long>? {
    return try {
        contentResolver.query(uri, null, null, null, null)?.use { cursor ->
            val nameIdx = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
            val sizeIdx = cursor.getColumnIndex(OpenableColumns.SIZE)
            cursor.moveToFirst()
            val name = cursor.getString(nameIdx)
            val size = cursor.getLong(sizeIdx)
            Pair(name, size)
        }
    } catch (e: Exception) { null }
}

private fun Uri.toTempFile(context: Context): File? {
    return try {
        val inputStream = context.contentResolver.openInputStream(this) ?: return null
        val tempFile = File.createTempFile("upload_", ".pdf", context.cacheDir)
        FileOutputStream(tempFile).use { out -> inputStream.copyTo(out) }
        tempFile
    } catch (e: Exception) { null }
}

private fun formatBytes(bytes: Long): String {
    if (bytes < 1024) return "$bytes B"
    if (bytes < 1024 * 1024) return "%.1f KB".format(bytes / 1024.0)
    return "%.1f MB".format(bytes / (1024.0 * 1024.0))
}
