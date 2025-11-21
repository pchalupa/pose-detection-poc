import { Canvas, Picture, createPicture } from '@shopify/react-native-skia';
import { StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import { Button } from '~/components/Button';
import { drawLandmarks } from './draw-landmarks';
import { useLandmarksFrameProcessor } from './frame-processor';
import { distanceBetween } from './pose-detector';

interface PreviewProps {
  style?: ViewStyle;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function Preview({ style }: PreviewProps) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');
  const format = useCameraFormat(device, [{ videoResolution: { width: 1280, height: 720 } }]);
  const { frameProcessor, landmarks } = useLandmarksFrameProcessor();
  const layout = useSharedValue({ width: 0, height: 0 });

  const picture = useDerivedValue(() =>
    createPicture((canvas) => drawLandmarks(canvas, layout, landmarks))
  );
  const distanceBetweenWrists = useDerivedValue(() => {
    if (landmarks.value?.leftEar && landmarks.value?.rightEar) {
      const earToEarSize = 16; // In cm
      const scale =
        earToEarSize / distanceBetween(landmarks.value?.leftEar, landmarks.value?.rightEar);

      if (landmarks.value?.leftWrist && landmarks.value?.rightWrist) {
        return distanceBetween(landmarks.value.leftWrist, landmarks.value.rightWrist) * scale;
      }
    }

    return 0.0;
  });

  const animatedProps = useAnimatedProps(() => ({
    text: `${distanceBetweenWrists.value.toPrecision(2)} cm`,
    defaultValue: '0.0 cm',
  }));

  if (!hasPermission || !device)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button text="Request Camera Permission" onPress={requestPermission} />
      </View>
    );

  return (
    <Animated.View
      style={[
        style,
        {
          flex: 1,
          overflow: 'hidden',
          aspectRatio: 9 / 16,
        },
      ]}
      onLayout={({ nativeEvent }) => (layout.value = nativeEvent.layout)}
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
        style={StyleSheet.absoluteFillObject}
      />
      <Canvas style={StyleSheet.absoluteFillObject}>
        <Picture picture={picture} />
      </Canvas>

      <AnimatedTextInput
        animatedProps={animatedProps}
        style={{ color: 'red', left: '40%', top: '25%', fontSize: 32 }}
        editable={false}
        numberOfLines={1}
      />
    </Animated.View>
  );
}
