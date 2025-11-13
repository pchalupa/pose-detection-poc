# Vision Camera Pose Landmarks Plugin

A Vision Camera Frame Processor Plugin for detecting human pose landmarks using MediaPipe Pose Landmarker.

### Platform Compatibility

| Android Device | Android Emulator | iOS Device | iOS Simulator | Web |
| -------------- | ---------------- | ---------- | ------------- | --- |
| ✅             | ✅               | ✅         | ❌            | ❌  |

### Demo

TBD

## Installation

```sh
npm i vision-camera-pose-landmarks-plugin
```

## How To Use

```ts
const { detectPoseLandmarks } = usePoseLandmarksPlugin();

const frameProcessor = useSkiaFrameProcessor((frame) => {
  'worklet';
  frame.render();

  const landmarks = detectPoseLandmarks(frame);
  const point = Skia.Paint();

  point.setColor(Skia.Color('blue'));
  point.setStyle(1);

  for (const landmark of landmarks) {
    frame.drawCircle(
      landmark.x * frame.width,
      landmark.y * frame.height,
      15 * landmark.z * -1,
      point
    );
  }
}, []);
```
