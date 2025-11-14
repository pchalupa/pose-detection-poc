import { Canvas, Fill, Picture, SkPicture, createPicture } from '@shopify/react-native-skia';
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
import { usePoseLandmarksPlugin } from 'vision-camera-pose-landmarks-plugin';
import { Button } from '~/components/Button';
import { drawLandmarks } from '~/frame-processor';

type Landmark = { x: number; y: number; z: number; type: number };

export default function TabOneScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');
  const format = useCameraFormat(device, [{ videoResolution: { width: 640, height: 480 } }]);
  const picture = useSharedValue<SkPicture>(createPicture(() => {}));
  const landmarks = useVisionCameraSharedValue<Landmark[]>([]);
  const { detectPoseLandmarks } = usePoseLandmarksPlugin();

  useFrameCallback(() => {
    'worklet';
    picture.value = createPicture((canvas) => {
      const width = 480;
      const height = 640;

      // portrait
      canvas.translate(width, 0);
      canvas.rotate(90, 0, 0);

      drawLandmarks(canvas, landmarks.value);

      return canvas;
    });
  });

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    runAsync(frame, () => {
      'worklet';
      const detectedLandmarks = detectPoseLandmarks(frame);

      const scaledLandmarks = detectedLandmarks.map((landmark) => ({
        ...landmark,
        x: landmark.x * frame.width,
        y: landmark.y * frame.height,
      }));

      landmarks.value = scaledLandmarks;
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {hasPermission && device ? (
        <View style={{ flex: 1 }}>
          <Camera
            device={device}
            isActive
            frameProcessor={frameProcessor}
            fps={30}
            format={format}
            pixelFormat="rgb"
            enableFpsGraph
            resizeMode="contain"
            style={{ width: 480, height: 640, ...StyleSheet.absoluteFillObject }}
          />
          <Canvas
            style={{ width: 480, height: 640, ...StyleSheet.absoluteFillObject }}
            pointerEvents="none"
            debug
          >
            <Fill color="black" opacity={0.4} />
            <Picture picture={picture} />
          </Canvas>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button text="Request Camera Permission" onPress={requestPermission} />
        </View>
      )}
    </View>
  );
}
