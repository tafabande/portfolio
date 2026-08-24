package com.bleighbande.portfolio.ui.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.bleighbande.portfolio.data.model.*
import com.bleighbande.portfolio.data.repository.ProfileRepository
import com.bleighbande.portfolio.data.repository.Result
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.io.File

// ── UI state definitions ─────────────────────────────────────────────────────

data class ProfileUiState(
    val profile: Profile = Profile(),
    val education: List<Education> = emptyList(),
    val experience: List<Experience> = emptyList(),
    val skills: List<Skill> = emptyList(),
    val projects: List<Project> = emptyList(),
    val documents: List<Document> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null
)

data class UploadUiState(
    val isUploading: Boolean = false,
    val jobId: String? = null,
    val jobStatus: String = "idle",  // idle|pending|text_extracting|text_done|ai_extracting|needs_review|confirmed|failed
    val extractedProfile: ExtractedProfile? = null,
    val confidence: Map<String, Int> = emptyMap(),
    val error: String? = null
)

// ── ViewModel ────────────────────────────────────────────────────────────────

class ProfileViewModel : ViewModel() {
    private val repo = ProfileRepository()

    var uiState by mutableStateOf(ProfileUiState())
        private set

    var uploadState by mutableStateOf(UploadUiState())
        private set

    var isServerOnline by mutableStateOf<Boolean?>(null)
        private set

    private var pollJob: Job? = null

    init { loadAll() }

    // ── Load everything ───────────────────────────────────────────────────────

    fun loadAll() {
        viewModelScope.launch {
            uiState = uiState.copy(isLoading = true, error = null)
            checkServer()
            loadProfile()
            loadEducation()
            loadExperience()
            loadSkills()
            loadProjects()
            uiState = uiState.copy(isLoading = false)
        }
    }

    private suspend fun checkServer() {
        isServerOnline = when (repo.checkHealth()) {
            is Result.Success -> true
            else -> false
        }
    }

    private suspend fun loadProfile() {
        when (val r = repo.getProfile()) {
            is Result.Success -> uiState = uiState.copy(profile = r.data)
            is Result.Error   -> uiState = uiState.copy(error = r.message)
            else -> {}
        }
    }

    private suspend fun loadEducation() {
        when (val r = repo.getEducation()) {
            is Result.Success -> uiState = uiState.copy(education = r.data)
            else -> {}
        }
    }

    private suspend fun loadExperience() {
        when (val r = repo.getExperience()) {
            is Result.Success -> uiState = uiState.copy(experience = r.data)
            else -> {}
        }
    }

    private suspend fun loadSkills() {
        when (val r = repo.getSkills()) {
            is Result.Success -> uiState = uiState.copy(skills = r.data)
            else -> {}
        }
    }

    private suspend fun loadProjects() {
        when (val r = repo.getProjects()) {
            is Result.Success -> uiState = uiState.copy(projects = r.data)
            else -> {}
        }
    }

    // ── Profile update ────────────────────────────────────────────────────────

    fun updateProfile(
        firstName: String, lastName: String, email: String,
        phone: String, location: String, bio: String,
        onSuccess: () -> Unit
    ) {
        viewModelScope.launch {
            uiState = uiState.copy(isLoading = true)
            val req = ProfileRequest(
                firstName = firstName.trim().ifBlank { null },
                lastName  = lastName.trim().ifBlank { null },
                email     = email.trim().ifBlank { null },
                phone     = phone.trim().ifBlank { null },
                location  = location.trim().ifBlank { null },
                bio       = bio.trim().ifBlank { null }
            )
            when (val r = repo.updateProfile(req)) {
                is Result.Success -> {
                    uiState = uiState.copy(profile = r.data, isLoading = false, successMessage = "Profile saved")
                    onSuccess()
                }
                is Result.Error -> uiState = uiState.copy(isLoading = false, error = r.message)
                else -> {}
            }
        }
    }

    // ── Education CRUD ────────────────────────────────────────────────────────

    fun addEducation(edu: Education, onSuccess: () -> Unit) {
        viewModelScope.launch {
            when (val r = repo.createEducation(edu)) {
                is Result.Success -> {
                    loadEducation()
                    uiState = uiState.copy(successMessage = "Education added")
                    onSuccess()
                }
                is Result.Error -> uiState = uiState.copy(error = r.message)
                else -> {}
            }
        }
    }

    fun deleteEducation(id: String) {
        viewModelScope.launch {
            repo.deleteEducation(id)
            loadEducation()
        }
    }

    // ── Experience CRUD ───────────────────────────────────────────────────────

    fun addExperience(exp: Experience, onSuccess: () -> Unit) {
        viewModelScope.launch {
            when (val r = repo.createExperience(exp)) {
                is Result.Success -> {
                    loadExperience()
                    uiState = uiState.copy(successMessage = "Experience added")
                    onSuccess()
                }
                is Result.Error -> uiState = uiState.copy(error = r.message)
                else -> {}
            }
        }
    }

    fun deleteExperience(id: String) {
        viewModelScope.launch { repo.deleteExperience(id); loadExperience() }
    }

    // ── Skills ────────────────────────────────────────────────────────────────

    fun addSkill(name: String) {
        if (name.isBlank()) return
        if (uiState.skills.any { it.name.equals(name.trim(), ignoreCase = true) }) return
        viewModelScope.launch {
            when (repo.createSkill(Skill(name = name.trim()))) {
                is Result.Success -> loadSkills()
                is Result.Error   -> uiState = uiState.copy(error = "Couldn't add skill")
                else -> {}
            }
        }
    }

    fun deleteSkill(id: String) {
        viewModelScope.launch { repo.deleteSkill(id); loadSkills() }
    }

    // ── Projects ──────────────────────────────────────────────────────────────

    fun addProject(proj: Project, onSuccess: () -> Unit) {
        viewModelScope.launch {
            when (repo.createProject(proj)) {
                is Result.Success -> { loadProjects(); onSuccess() }
                is Result.Error   -> uiState = uiState.copy(error = "Couldn't add project")
                else -> {}
            }
        }
    }

    fun deleteProject(id: String) {
        viewModelScope.launch { repo.deleteProject(id); loadProjects() }
    }

    // ── PDF Upload + polling ──────────────────────────────────────────────────

    fun uploadDocument(file: File) {
        viewModelScope.launch {
            uploadState = uploadState.copy(isUploading = true, error = null, jobStatus = "uploading")
            when (val r = repo.uploadDocument(file)) {
                is Result.Success -> {
                    uploadState = uploadState.copy(
                        isUploading = false,
                        jobId = r.data.jobId,
                        jobStatus = "pending"
                    )
                    startPolling(r.data.jobId)
                }
                is Result.Error -> {
                    uploadState = uploadState.copy(isUploading = false, error = r.message, jobStatus = "failed")
                }
                else -> {}
            }
        }
    }

    private fun startPolling(jobId: String) {
        pollJob?.cancel()
        pollJob = viewModelScope.launch {
            var attempts = 0
            while (attempts < 60) {
                delay(2000)
                attempts++
                when (val r = repo.getJob(jobId)) {
                    is Result.Success -> {
                        val job = r.data
                        uploadState = uploadState.copy(jobStatus = job.status)
                        when (job.status) {
                            "needs_review" -> {
                                uploadState = uploadState.copy(
                                    extractedProfile = job.profile,
                                    confidence = job.confidence ?: emptyMap()
                                )
                                pollJob?.cancel()
                                return@launch
                            }
                            "failed" -> {
                                uploadState = uploadState.copy(error = job.errorMessage ?: "Extraction failed")
                                pollJob?.cancel()
                                return@launch
                            }
                        }
                    }
                    is Result.Error -> {
                        uploadState = uploadState.copy(error = r.message)
                        pollJob?.cancel()
                        return@launch
                    }
                    else -> {}
                }
            }
            uploadState = uploadState.copy(error = "Processing timed out", jobStatus = "failed")
        }
    }

    fun retryExtraction() {
        val jobId = uploadState.jobId ?: return
        viewModelScope.launch {
            uploadState = uploadState.copy(jobStatus = "pending", error = null)
            repo.retryJob(jobId)
            startPolling(jobId)
        }
    }

    fun confirmExtraction(onSuccess: () -> Unit) {
        val jobId = uploadState.jobId ?: return
        viewModelScope.launch {
            repo.confirmJob(jobId)
            uploadState.extractedProfile?.let { extracted ->
                // Merge extracted data into profile
                extracted.personal?.let { p ->
                    repo.updateProfile(ProfileRequest(p.firstName, p.lastName, p.email, p.phone, p.location, p.bio))
                }
                extracted.education?.forEach { e ->
                    repo.createEducation(Education(
                        institution = e.institution ?: "", qualification = e.qualification,
                        field = e.field, startDate = e.startDate, endDate = e.endDate
                    ))
                }
                extracted.experience?.forEach { e ->
                    repo.createExperience(Experience(
                        company = e.company ?: "", position = e.position,
                        startDate = e.startDate, endDate = e.endDate
                    ))
                }
                extracted.skills?.forEach { s ->
                    repo.createSkill(Skill(name = s.name, category = s.category))
                }
            }
            loadAll()
            onSuccess()
        }
    }

    // ── Sync to portfolio ─────────────────────────────────────────────────────

    fun syncPortfolio(onResult: (Boolean, String) -> Unit) {
        viewModelScope.launch {
            when (val r = repo.syncPortfolio()) {
                is Result.Success -> onResult(true, r.data.outputPath ?: "profile.json synced")
                is Result.Error   -> onResult(false, r.message)
                else -> {}
            }
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    fun clearMessage() { uiState = uiState.copy(error = null, successMessage = null) }
    fun resetUpload()  { uploadState = UploadUiState(); pollJob?.cancel() }
}
