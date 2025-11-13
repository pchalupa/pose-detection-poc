package com.visioncamera.poselandmarksplugin

import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy

class PoseLandmarksPlugin(proxy: VisionCameraProxy, options: Map<String, Any>?): FrameProcessorPlugin() {
  private val mediaPipeProcessor: MediaPipeFrameProcessor = MediaPipeFrameProcessor(proxy.context)

    override fun callback(frame: Frame, params: Map<String, Any>?): Any {
      return mediaPipeProcessor.process(frame)
  }

  companion object {
    const val NAME = "detectPoseLandmarks"
  }
}
