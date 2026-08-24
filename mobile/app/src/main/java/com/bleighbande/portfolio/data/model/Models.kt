package com.bleighbande.portfolio.data.model

import com.google.gson.annotations.SerializedName

// ── Profile ──────────────────────────────────────────────────────────────────
data class Profile(
    val id: Int = 1,
    @SerializedName("first_name") val firstName: String? = null,
    @SerializedName("last_name")  val lastName: String? = null,
    val email: String? = null,
    val phone: String? = null,
    val location: String? = null,
    val bio: String? = null,
    @SerializedName("created_at") val createdAt: String? = null,
    @SerializedName("updated_at") val updatedAt: String? = null
) {
    val fullName: String get() = listOfNotNull(firstName, lastName).joinToString(" ").ifBlank { "Your Name" }
}

data class ProfileRequest(
    @SerializedName("first_name") val firstName: String?,
    @SerializedName("last_name")  val lastName: String?,
    val email: String?,
    val phone: String?,
    val location: String?,
    val bio: String?
)

// ── Education ────────────────────────────────────────────────────────────────
data class Education(
    val id: String = "",
    val institution: String = "",
    val qualification: String? = null,
    val field: String? = null,
    @SerializedName("start_date") val startDate: String? = null,
    @SerializedName("end_date")   val endDate: String? = null,
    val description: String? = null
) {
    val dateRange: String get() = listOfNotNull(startDate, endDate).joinToString(" – ").ifBlank { "" }
    val displayTitle: String get() = listOfNotNull(qualification, field).joinToString(" in ").ifBlank { institution }
}

// ── Experience ───────────────────────────────────────────────────────────────
data class Experience(
    val id: String = "",
    val company: String = "",
    val position: String? = null,
    @SerializedName("start_date") val startDate: String? = null,
    @SerializedName("end_date")   val endDate: String? = null,
    val location: String? = null,
    val description: String? = null
) {
    val dateRange: String get() = listOfNotNull(startDate, endDate).joinToString(" – ").ifBlank { "" }
}

// ── Skills ───────────────────────────────────────────────────────────────────
data class Skill(
    val id: String = "",
    val name: String = "",
    val category: String? = null,
    val proficiency: String? = null
)

// ── Projects ─────────────────────────────────────────────────────────────────
data class Project(
    val id: String = "",
    val name: String = "",
    val description: String? = null,
    val technologies: List<String>? = null,
    val url: String? = null
)

// ── Documents ────────────────────────────────────────────────────────────────
data class Document(
    val id: String = "",
    @SerializedName("original_filename") val originalFilename: String = "",
    @SerializedName("processing_status") val processingStatus: String = "uploaded",
    @SerializedName("size_bytes") val sizeBytes: Long = 0L,
    @SerializedName("uploaded_at") val uploadedAt: String? = null
)

// ── Extraction Job ────────────────────────────────────────────────────────────
data class ExtractionJob(
    val id: String = "",
    @SerializedName("documentId") val documentId: String = "",
    val status: String = "pending",
    val method: String? = null,
    val profile: ExtractedProfile? = null,
    val confidence: Map<String, Int>? = null,
    val errorMessage: String? = null
)

data class ExtractedProfile(
    val personal: ExtractedPersonal? = null,
    val education: List<ExtractedEducation>? = null,
    val experience: List<ExtractedExperience>? = null,
    val skills: List<ExtractedSkill>? = null
)

data class ExtractedPersonal(
    val firstName: String? = null,
    val lastName: String? = null,
    val email: String? = null,
    val phone: String? = null,
    val location: String? = null,
    val bio: String? = null
)

data class ExtractedEducation(
    val institution: String? = null,
    val qualification: String? = null,
    val field: String? = null,
    val startDate: String? = null,
    val endDate: String? = null
)

data class ExtractedExperience(
    val company: String? = null,
    val position: String? = null,
    val startDate: String? = null,
    val endDate: String? = null
)

data class ExtractedSkill(
    val name: String = "",
    val category: String? = null
)

// ── API responses ─────────────────────────────────────────────────────────────
data class UploadResponse(
    val documentId: String,
    val jobId: String,
    val status: String,
    val message: String
)

data class SyncResponse(
    val success: Boolean,
    val outputPath: String?,
    val profile: Any?
)

data class ApiError(val error: String)
