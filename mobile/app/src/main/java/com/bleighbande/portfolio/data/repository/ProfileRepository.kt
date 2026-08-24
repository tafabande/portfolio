package com.bleighbande.portfolio.data.repository

import com.bleighbande.portfolio.data.api.ApiClient
import com.bleighbande.portfolio.data.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File

sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String, val code: Int? = null) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

class ProfileRepository {
    private val api = ApiClient.api

    suspend fun getProfile(): Result<Profile> = safeCall { api.getProfile() }
    suspend fun updateProfile(req: ProfileRequest): Result<Profile> = safeCall { api.updateProfile(req) }

    suspend fun getEducation(): Result<List<Education>> = safeCall { api.getEducation() }
    suspend fun createEducation(edu: Education): Result<Education> = safeCall { api.createEducation(edu) }
    suspend fun updateEducation(id: String, edu: Education): Result<Education> = safeCall { api.updateEducation(id, edu) }
    suspend fun deleteEducation(id: String): Result<Unit> = safeCall { api.deleteEducation(id) }

    suspend fun getExperience(): Result<List<Experience>> = safeCall { api.getExperience() }
    suspend fun createExperience(exp: Experience): Result<Experience> = safeCall { api.createExperience(exp) }
    suspend fun updateExperience(id: String, exp: Experience): Result<Experience> = safeCall { api.updateExperience(id, exp) }
    suspend fun deleteExperience(id: String): Result<Unit> = safeCall { api.deleteExperience(id) }

    suspend fun getSkills(): Result<List<Skill>> = safeCall { api.getSkills() }
    suspend fun createSkill(skill: Skill): Result<Skill> = safeCall { api.createSkill(skill) }
    suspend fun deleteSkill(id: String): Result<Unit> = safeCall { api.deleteSkill(id) }

    suspend fun getProjects(): Result<List<Project>> = safeCall { api.getProjects() }
    suspend fun createProject(proj: Project): Result<Project> = safeCall { api.createProject(proj) }
    suspend fun updateProject(id: String, proj: Project): Result<Project> = safeCall { api.updateProject(id, proj) }
    suspend fun deleteProject(id: String): Result<Unit> = safeCall { api.deleteProject(id) }

    suspend fun uploadDocument(file: File): Result<UploadResponse> = withContext(Dispatchers.IO) {
        try {
            val reqBody = file.asRequestBody("application/pdf".toMediaTypeOrNull())
            val part = MultipartBody.Part.createFormData("file", file.name, reqBody)
            val response = api.uploadDocument(part)
            if (response.isSuccessful && response.body() != null) {
                Result.Success(response.body()!!)
            } else {
                Result.Error("Upload failed: HTTP ${response.code()}", response.code())
            }
        } catch (e: Exception) {
            Result.Error(e.message ?: "Unknown error")
        }
    }

    suspend fun getDocuments(): Result<List<Document>> = safeCall { api.getDocuments() }
    suspend fun deleteDocument(id: String): Result<Unit> = safeCall { api.deleteDocument(id) }

    suspend fun getJob(id: String): Result<ExtractionJob> = safeCall { api.getJob(id) }
    suspend fun confirmJob(id: String): Result<Any> = safeCall { api.confirmJob(id) }
    suspend fun retryJob(id: String): Result<Any> = safeCall { api.retryJob(id) }

    suspend fun syncPortfolio(): Result<SyncResponse> = safeCall { api.syncPortfolio() }
    suspend fun getAuthStatus(): Result<AuthStatus> = safeCall { api.getAuthStatus() }
    suspend fun linkPat(token: String): Result<Any> = safeCall { api.linkPat(PatLinkRequest(token)) }
    suspend fun disconnectAuth(): Result<Any> = safeCall { api.disconnectAuth() }
    suspend fun getAnalytics(): Result<AnalyticsSummary> = safeCall { api.getAnalytics() }
    suspend fun checkHealth(): Result<Any> = safeCall { api.health() }


    private suspend fun <T> safeCall(call: suspend () -> retrofit2.Response<T>): Result<T> =
        withContext(Dispatchers.IO) {
            try {
                val response = call()
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!)
                } else if (response.code() == 204) {
                    @Suppress("UNCHECKED_CAST")
                    Result.Success(Unit as T)
                } else {
                    Result.Error("HTTP ${response.code()}: ${response.message()}", response.code())
                }
            } catch (e: Exception) {
                Result.Error(e.message ?: "Network error")
            }
        }
}
