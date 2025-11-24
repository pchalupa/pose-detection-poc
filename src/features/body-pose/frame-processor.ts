import { useFrameCallback, useSharedValue } from 'react-native-reanimated';
import { runAsync, useFrameProcessor } from 'react-native-vision-camera';
import { useSharedValue as useVisionCameraSharedValue } from 'react-native-worklets-core';
import { Landmarks, usePoseLandmarksPlugin } from 'vision-camera-pose-landmarks-plugin';

export function useLandmarksFrameProcessor() {
  /** Worklets shared value */
  const landmarks = useSharedValue<Landmarks | undefined>(undefined);
  /** Worklets Core shared value in the Vision Camera context */
  const result = useVisionCameraSharedValue<Landmarks | undefined>(undefined);
  const { detectPoseLandmarks } = usePoseLandmarksPlugin({
    numPoses: 1,
    minPoseDetectionConfidence: 0.5,
    minPosePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    runAsync(frame, () => {
      'worklet';

      const detectedLandmarks = detectPoseLandmarks(frame).at(0);

      for (const landmarkKey in detectedLandmarks) {
        const landmark = landmarkKey as keyof Landmarks;
        const { x, y, z } = detectedLandmarks?.[landmark] ?? {};

        // Rotate around Z axis
        if (frame.orientation === 'landscape-right') {
          detectedLandmarks[landmark] = {
            ...detectedLandmarks[landmark],
            x: 1 - y,
            y: x,
            z: z,
          };
        } else if (frame.orientation === 'landscape-left') {
          detectedLandmarks[landmark] = {
            ...detectedLandmarks[landmark],
            x: y,
            y: 1 - x,
            z: z,
          };
        } else if (frame.orientation === 'portrait-upside-down') {
          detectedLandmarks[landmark] = {
            ...detectedLandmarks[landmark],
            x: 1 - x,
            y: 1 - y,
            z: z,
          };
        }
      }

      result.value = detectedLandmarks;
    });
  }, []);

  /** Update landmarks on every frame */
  useFrameCallback(() => {
    'worklet';

    landmarks.value = result.value;
  });

  return { frameProcessor, landmarks: landmarks };
}
