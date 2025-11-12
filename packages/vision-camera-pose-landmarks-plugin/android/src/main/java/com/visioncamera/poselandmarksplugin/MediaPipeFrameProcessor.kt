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
                    "type" to normalizeLandmarkType(index)
                )
            }
        } catch (e: Exception) {
            println("MediaPipe: Error processing frame: ${e.message}")
            return emptyList()
        }
    }



    private fun normalizeLandmarkType(index: Int): String {
        return when (index) {
            0 -> "NOSE"
            1 -> "LEFT_EYE_INNER"
            2 -> "LEFT_EYE"
            3 -> "LEFT_EYE_OUTER"
            4 -> "RIGHT_EYE_INNER"
            5 -> "RIGHT_EYE"
            6 -> "RIGHT_EYE_OUTER"
            7 -> "LEFT_EAR"
            8 -> "RIGHT_EAR"
            9 -> "LEFT_MOUTH"
            10 -> "RIGHT_MOUTH"
            11 -> "LEFT_SHOULDER"
            12 -> "RIGHT_SHOULDER"
            13 -> "LEFT_ELBOW"
            14 -> "RIGHT_ELBOW"
            15 -> "LEFT_WRIST"
            16 -> "RIGHT_WRIST"
            17 -> "LEFT_PINKY"
            18 -> "RIGHT_PINKY"
            19 -> "LEFT_INDEX"
            20 -> "RIGHT_INDEX"
            21 -> "LEFT_THUMB"
            22 -> "RIGHT_THUMB"
            23 -> "LEFT_HIP"
            24 -> "RIGHT_HIP"
            25 -> "LEFT_KNEE"
            26 -> "RIGHT_KNEE"
            27 -> "LEFT_ANKLE"
            28 -> "RIGHT_ANKLE"
            29 -> "LEFT_HEEL"
            30 -> "RIGHT_HEEL"
            31 -> "LEFT_FOOT_INDEX"
            32 -> "RIGHT_FOOT_INDEX"
            else -> "UNKNOWN"
        }
    }
}