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

### Runtime Comparison

| Framework  | FPS | Bundle size increase | Accuracy     |
| ---------- | --- | -------------------- | ------------ |
| MLKit      | 30  | ~30MB                | 33 landmarks |
| TensorFlow | TBD | ~11MB                | 17 landmarks |
| MediaPipe  | TBD | TBD                  | 33 landmarks |
