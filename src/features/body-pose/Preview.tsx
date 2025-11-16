import { Canvas, Fill, Picture, Rect, SkPicture, createPicture } from '@shopify/react-native-skia';
import { StyleSheet, View } from 'react-native';
import { useFrameCallback, useSharedValue } from 'react-native-reanimated';
import {
  Camera,
  runAsync,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useSharedValue as useVisionCameraSharedValue } from 'react-native-worklets-core';
import { Landmarks, usePoseLandmarksPlugin } from 'vision-camera-pose-landmarks-plugin';
import { Button } from '~/components/Button';
import { drawLandmarks, rotateCanvas } from '~/features/body-pose/frame-processor';

export function Preview() {
  const { width, height } = { width: 1280, height: 720 };
  // Camera
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');
  const format = useCameraFormat(device, [{ videoResolution: { width, height } }]);
  const cameraOrientation = useVisionCameraSharedValue<string>('portrait');
  const landmarks = useVisionCameraSharedValue<Landmarks | undefined>(undefined);
  const { detectPoseLandmarks } = usePoseLandmarksPlugin();

  console.log(device?.sensorOrientation);

  // Shared values
  const picture = useSharedValue<SkPicture>(createPicture(() => {}));

  useFrameCallback((frame) => {
    'worklet';

    picture.value = createPicture((canvas) => {
      rotateCanvas(canvas, cameraOrientation.value);
      drawLandmarks(canvas, landmarks.value);

      return canvas;
    });
  });

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    runAsync(frame, () => {
      'worklet';

      const detectedLandmarks = detectPoseLandmarks(frame);

      landmarks.value = detectedLandmarks;
      cameraOrientation.value = frame.orientation;
    });
  }, []);

  if (!hasPermission || !device)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button text="Request Camera Permission" onPress={requestPermission} />
      </View>
    );

  return (
    <View
      style={{
        width,
        height,
        overflow: 'hidden',
        backgroundColor: 'blue',
      }}
      onLayout={(layout) => console.log(layout.nativeEvent.layout)}
    >
      <Camera
        device={device}
        isActive
        frameProcessor={frameProcessor}
        fps={30}
        format={format}
        pixelFormat="rgb"
        enableFpsGraph
        resizeMode="contain"
        style={{ ...StyleSheet.absoluteFillObject, width, height }}
      />
      <Canvas
        style={{ ...StyleSheet.absoluteFillObject, width, height }}
        pointerEvents="none"
        debug
      >
        <Rect x={0} y={0} width={50} height={50} color="red" />
        <Fill color="black" opacity={0.4} />
        <Picture picture={picture} />
      </Canvas>
    </View>
  );
}
