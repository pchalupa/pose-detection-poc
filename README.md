# Pose Detection POC

This is a proof of concept project for pose detection using React Native and Vision Camera.

## Notes

- Unable to compile https://github.com/gev2002/react-native-vision-camera-v3-pose-detection with latest version of Vision Camera
- Created a custom plugin `vision-camera-pose-detection-plugin` based on the above library
- Vision Camera and Frame Processors are the way to go!
- Problem with black screen on android while using skia.
- Required minimum SDK version 26, set using build properties
