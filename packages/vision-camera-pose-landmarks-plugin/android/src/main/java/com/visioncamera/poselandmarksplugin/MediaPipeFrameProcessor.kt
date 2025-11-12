package com.visioncamera.poselandmarksplugin

import android.content.Context
import com.google.mediapipe.framework.image.MediaImageBuilder
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.poselandmarker.PoseLandmarker
import com.mrousavy.camera.frameprocessors.Frame

class MediaPipeFrameProcessor(private val context: Context) {
    private val poseLandmarker: PoseLandmarker? by lazy {
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

            PoseLandmarker.createFromOptions(context, optionsBuilder.build())
        } catch (error: Exception) {
            null
        }
    }
    fun process(frame: Frame): List<Map<String, Any>> {
        try {
            val mpImage = MediaImageBuilder(frame.image).build()
            val result = poseLandmarker?.detectForVideo(mpImage, frame.timestamp)
            val firstPose = result?.landmarks()?.first()
            val landmarks = firstPose?.mapIndexed { index, landmark ->
                mapOf(
                    "x" to landmark.x().toDouble(),
                    "y" to landmark.y().toDouble(),
                    "z" to landmark.z().toDouble(),
                    "type" to index
                )
            } ?: emptyList()

            return landmarks
        } catch (error: Exception) {
            return emptyList()
        }
    }
}