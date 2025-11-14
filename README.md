# Pose Detection POC

This is a proof of concept project for pose detection using React Native and Vision Camera.

## Notes

- Unable to compile https://github.com/gev2002/react-native-vision-camera-v3-pose-detection with latest version of Vision Camera
- Vision Camera and Frame Processors are the way to go!
- Black preview on android while using skia frame processor
- Required minimum SDK version 26, set using build properties
- RNSkia version 2.2.2+ unsupported by vision camera
- MLKit Pose Detection adds ~30MB to the app size
- High RAM usage on iOS (up to 1.5GB) leads to crash. Setting format and fps helps a bit but still not usable for long sessions.
- VISION_EXPORT_SWIFT_FRAME_PROCESSOR does not register the frame processor on iOS.
- Pose detection using angle heuristic https://developers.google.com/ml-kit/vision/pose-detection/classifying-poses#recognizing_a_yoga_pose_with_angle_heuristics
- A 4k Frame in yuv is roughly 12 MB, while a 4k Frame in rgb is roughly 31 MB.
- MediaPipe requires RGB frames
- TensorFlow Lite migrates to LiteRT https://ai.google.dev/edge/litert/migration
- Pose landmarker heavy plugin hits performance hard. 7fps on iPhone seems to be the limit.
- The position is in 3D!
- use videoStabilizationMode="off" to reduce latency on iOS
- Black screen on Android solved using read device
- useSkiaFrameProcessor() causes crashes on iOS when combined with other frame processors better to use frame processor alone

### Runtime Comparison

| Framework | FPS                     | Bundle size increase                    | Accuracy     | Notes                                                                                                                                      |
| --------- | ----------------------- | --------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| MLKit     | 30                      | ~30MB                                   | 33 landmarks | Points are jiggling, less accurate                                                                                                         |
| MediaPipe | 20-30 (full), 7 (heavy) | ~5MB (lite), ~10MB(full), ~30MB (heavy) | 33 landmarks | Model can be downloaded on the go, uses BLazePose https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf |
