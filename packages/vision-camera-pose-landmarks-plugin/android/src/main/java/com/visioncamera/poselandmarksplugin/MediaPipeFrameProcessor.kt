package com.visioncamera.poselandmarksplugin

import android.content.Context
import com.google.mediapipe.framework.image.MediaImageBuilder
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.poselandmarker.PoseLandmarker
import com.mrousavy.camera.frameprocessors.Frame

class MediaPipeFrameProcessor(private val context: Context) {
    private var poseLandmarker: PoseLandmarker? = null

    init {
        try {
            val baseOptionsBuilder = BaseOptions.builder()
                .setModelAssetPath("pose_landmarker_full.task")
            
            val optionsBuilder = PoseLandmarker.PoseLandmarkerOptions.builder()
                .setBaseOptions(baseOptionsBuilder.build())
                .setRunningMode(RunningMode.VIDEO)
                .setNumPoses(1)
                .setMinPoseDetectionConfidence(0.5f)
                .setMinPosePresenceConfidence(0.5f)
                .setMinTrackingConfidence(0.5f)

            poseLandmarker = PoseLandmarker.createFromOptions(context, optionsBuilder.build())
        } catch (e: Exception) {
            println("MediaPipe: Failed to create pose landmarker: ${e.message}")
            poseLandmarker = null
        }
    }

    fun process(frame: Frame): List<Map<String, Any>> {
        val landmarker = poseLandmarker ?: return emptyList()

        try {
            val mpImage = MediaImageBuilder(frame.image).build()

            
            val result = landmarker.detectForVideo(mpImage, frame.timestamp / 1000)
            
            if (result.landmarks().isEmpty()) {
                return emptyList()
            }

            val firstPose = result.landmarks()[0]
            
            return firstPose.mapIndexed { index, landmark ->
                mapOf(
                    "x" to landmark.x().toDouble(),
                    "y" to landmark.y().toDouble(),
                    "z" to landmark.z().toDouble(),
                    "visibility" to (landmark.visibility().orElse(0.0f).toDouble()),
                    "type" to index
                )
            }
        } catch (e: Exception) {
            println("MediaPipe: Error processing frame: ${e.message}")
            return emptyList()
        }
    }
}