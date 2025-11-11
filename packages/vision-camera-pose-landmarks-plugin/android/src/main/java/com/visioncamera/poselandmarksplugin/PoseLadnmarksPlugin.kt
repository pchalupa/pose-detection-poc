package com.visioncamera.poselandmarksplugin

import com.google.android.gms.tasks.Tasks
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.pose.PoseDetection
import com.google.mlkit.vision.pose.PoseDetector
import com.google.mlkit.vision.pose.PoseLandmark
import com.google.mlkit.vision.pose.defaults.PoseDetectorOptions
import com.mrousavy.camera.core.types.Orientation
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy

class PoseLandmarksPlugin(proxy: VisionCameraProxy, options: Map<String, Any>?): FrameProcessorPlugin() {
  private val poseDetector: PoseDetector

  init {
    val detectorOptions = PoseDetectorOptions.Builder()
      .setDetectorMode(PoseDetectorOptions.STREAM_MODE)
      .build()

    poseDetector = PoseDetection.getClient(detectorOptions)
  }

  override fun callback(frame: Frame, params: Map<String, Any>?): Any? {
      val mediaImage = frame.image

      val rotationDegrees = when (frame.orientation) {
            Orientation.PORTRAIT -> 0
            Orientation.LANDSCAPE_LEFT -> 90
            Orientation.LANDSCAPE_RIGHT -> 180
            Orientation.PORTRAIT_UPSIDE_DOWN -> 270
            else -> 0
        }
        val image = InputImage.fromMediaImage(mediaImage, rotationDegrees)

        val task = poseDetector.process(image)
        val pose = Tasks.await(task)


        val landmarks = mutableListOf<Map<String, Any>>()

        pose.allPoseLandmarks.forEach { landmark ->
          landmarks.add(mapOf(
            "type" to getLandmarkType(landmark.landmarkType),
            "x" to landmark.position.x.toDouble(),
            "y" to landmark.position.y.toDouble(),
          ))
        }

    return landmarks
  }

  private fun getLandmarkType(type: Int): String {
    return when (type) {
      PoseLandmark.NOSE -> "NOSE"
      PoseLandmark.LEFT_EYE_INNER -> "LEFT_EYE_INNER"
      PoseLandmark.LEFT_EYE -> "LEFT_EYE"
      PoseLandmark.LEFT_EYE_OUTER -> "LEFT_EYE_OUTER"
      PoseLandmark.RIGHT_EYE_INNER -> "RIGHT_EYE_INNER"
      PoseLandmark.RIGHT_EYE -> "RIGHT_EYE"
      PoseLandmark.RIGHT_EYE_OUTER -> "RIGHT_EYE_OUTER"
      PoseLandmark.LEFT_EAR -> "LEFT_EAR"
      PoseLandmark.RIGHT_EAR -> "RIGHT_EAR"
      PoseLandmark.LEFT_MOUTH -> "LEFT_MOUTH"
      PoseLandmark.RIGHT_MOUTH -> "RIGHT_MOUTH"
      PoseLandmark.LEFT_SHOULDER -> "LEFT_SHOULDER"
      PoseLandmark.RIGHT_SHOULDER -> "RIGHT_SHOULDER"
      PoseLandmark.LEFT_ELBOW -> "LEFT_ELBOW"
      PoseLandmark.RIGHT_ELBOW -> "RIGHT_ELBOW"
      PoseLandmark.LEFT_WRIST -> "LEFT_WRIST"
      PoseLandmark.RIGHT_WRIST -> "RIGHT_WRIST"
      PoseLandmark.LEFT_PINKY -> "LEFT_PINKY"
      PoseLandmark.RIGHT_PINKY -> "RIGHT_PINKY"
      PoseLandmark.LEFT_INDEX -> "LEFT_INDEX"
      PoseLandmark.RIGHT_INDEX -> "RIGHT_INDEX"
      PoseLandmark.LEFT_THUMB -> "LEFT_THUMB"
      PoseLandmark.RIGHT_THUMB -> "RIGHT_THUMB"
      PoseLandmark.LEFT_HIP -> "LEFT_HIP"
      PoseLandmark.RIGHT_HIP -> "RIGHT_HIP"
      PoseLandmark.LEFT_KNEE -> "LEFT_KNEE"
      PoseLandmark.RIGHT_KNEE -> "RIGHT_KNEE"
      PoseLandmark.LEFT_ANKLE -> "LEFT_ANKLE"
      PoseLandmark.RIGHT_ANKLE -> "RIGHT_ANKLE"
      PoseLandmark.LEFT_HEEL -> "LEFT_HEEL"
      PoseLandmark.RIGHT_HEEL -> "RIGHT_HEEL"
      PoseLandmark.LEFT_FOOT_INDEX -> "LEFT_FOOT_INDEX"
      PoseLandmark.RIGHT_FOOT_INDEX -> "RIGHT_FOOT_INDEX"
      else -> "UNKNOWN"
    }
  }

  companion object {
    const val NAME = "getPoseLandmarks"
  }
}
