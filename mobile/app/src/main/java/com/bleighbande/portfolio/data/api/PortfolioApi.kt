package com.bleighbande.portfolio.data.api

import com.bleighbande.portfolio.BuildConfig
import com.bleighbande.portfolio.data.model.*
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit

interface PortfolioApi {

    // ── Profile ───────────────────────────────────────────────────────────────
    @GET("api/profile")
    suspend fun getProfile(): Response<Profile>

    @PUT("api/profile")
    suspend fun updateProfile(@Body request: ProfileRequest): Response<Profile>

    // ── Education ─────────────────────────────────────────────────────────────
    @GET("api/education")
    suspend fun getEducation(): Response<List<Education>>

    @POST("api/education")
    suspend fun createEducation(@Body education: Education): Response<Education>

    @PUT("api/education/{id}")
    suspend fun updateEducation(@Path("id") id: String, @Body education: Education): Response<Education>

    @DELETE("api/education/{id}")
    suspend fun deleteEducation(@Path("id") id: String): Response<Unit>

    // ── Experience ────────────────────────────────────────────────────────────
    @GET("api/experience")
    suspend fun getExperience(): Response<List<Experience>>

    @POST("api/experience")
    suspend fun createExperience(@Body experience: Experience): Response<Experience>

    @PUT("api/experience/{id}")
    suspend fun updateExperience(@Path("id") id: String, @Body experience: Experience): Response<Experience>

    @DELETE("api/experience/{id}")
    suspend fun deleteExperience(@Path("id") id: String): Response<Unit>

    // ── Skills ────────────────────────────────────────────────────────────────
    @GET("api/skills")
    suspend fun getSkills(): Response<List<Skill>>

    @POST("api/skills")
    suspend fun createSkill(@Body skill: Skill): Response<Skill>

    @DELETE("api/skills/{id}")
    suspend fun deleteSkill(@Path("id") id: String): Response<Unit>

    // ── Projects ──────────────────────────────────────────────────────────────
    @GET("api/projects")
    suspend fun getProjects(): Response<List<Project>>

    @POST("api/projects")
    suspend fun createProject(@Body project: Project): Response<Project>

    @PUT("api/projects/{id}")
    suspend fun updateProject(@Path("id") id: String, @Body project: Project): Response<Project>

    @DELETE("api/projects/{id}")
    suspend fun deleteProject(@Path("id") id: String): Response<Unit>

    // ── Documents ─────────────────────────────────────────────────────────────
    @Multipart
    @POST("api/documents")
    suspend fun uploadDocument(@Part file: MultipartBody.Part): Response<UploadResponse>

    @GET("api/documents")
    suspend fun getDocuments(): Response<List<Document>>

    @DELETE("api/documents/{id}")
    suspend fun deleteDocument(@Path("id") id: String): Response<Unit>

    // ── Extraction Jobs ───────────────────────────────────────────────────────
    @GET("api/extraction-jobs/{id}")
    suspend fun getJob(@Path("id") id: String): Response<ExtractionJob>

    @POST("api/extraction-jobs/{id}/confirm")
    suspend fun confirmJob(@Path("id") id: String): Response<Any>

    @POST("api/extraction-jobs/{id}/retry")
    suspend fun retryJob(@Path("id") id: String): Response<Any>

    // ── Portfolio Sync ────────────────────────────────────────────────────────
    @POST("api/portfolio/sync")
    suspend fun syncPortfolio(): Response<SyncResponse>

    // ── GitHub Auth ───────────────────────────────────────────────────────────
    @GET("api/auth/status")
    suspend fun getAuthStatus(): Response<AuthStatus>

    @POST("api/auth/github/pat")
    suspend fun linkPat(@Body req: PatLinkRequest): Response<Any>

    @POST("api/auth/disconnect")
    suspend fun disconnectAuth(): Response<Any>

    // ── Analytics ─────────────────────────────────────────────────────────────
    @GET("api/analytics/summary")
    suspend fun getAnalytics(): Response<AnalyticsSummary>

    // ── User Authentication & Account ──────────────────────────────────────────
    @POST("api/auth/register")
    suspend fun register(@Body req: RegisterRequest): Response<AuthResponse>

    @POST("api/auth/login")
    suspend fun login(@Body req: LoginRequest): Response<AuthResponse>

    @GET("api/auth/me")
    suspend fun getMe(): Response<UserAccount>

    // ── Health ────────────────────────────────────────────────────────────────
    @GET("api/health")
    suspend fun health(): Response<Any>
}

object ApiClient {
    private var authToken: String? = null

    fun setAuthToken(token: String?) {
        authToken = token
    }

    fun getAuthToken(): String? = authToken

    private val authInterceptor = okhttp3.Interceptor { chain ->
        val original = chain.request()
        val builder = original.newBuilder()
        authToken?.let { token ->
            if (token.isNotBlank()) {
                builder.addHeader("Authorization", "Bearer $token")
            }
        }
        chain.proceed(builder.build())
    }

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        redactHeader("Authorization")
        level = if (BuildConfig.DEBUG) {
            HttpLoggingInterceptor.Level.HEADERS
        } else {
            HttpLoggingInterceptor.Level.NONE
        }
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    val api: PortfolioApi by lazy {
        Retrofit.Builder()
            .baseUrl(BuildConfig.BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(PortfolioApi::class.java)
    }
}

