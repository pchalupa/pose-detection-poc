import { useFrameCallback, useSharedValue } from 'react-native-reanimated';
import { runAsync, useFrameProcessor } from 'react-native-vision-camera';
import { useSharedValue as useVisionCameraSharedValue } from 'react-native-worklets-core';
import { Landmarks, usePoseLandmarksPlugin } from 'vision-camera-pose-landmarks-plugin';

// Threshold for considering a landmark as present in the frame
const PRESENCE_THRESHOLD = 0.2;

export function useLandmarksFrameProcessor() {
  /** Worklets shared value */
  const landmarks = useSharedValue<Partial<Landmarks> | undefined>(undefined);
  /** Worklets Core shared value in the Vision Camera context */
  const result = useVisionCameraSharedValue<Partial<Landmarks> | undefined>(undefined);

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
      const processedLandmarks: Partial<typeof detectedLandmarks> = {};

      for (const landmarkKey in detectedLandmarks) {
        const landmark = landmarkKey as keyof Landmarks;
        const { x, y, z, presence } = detectedLandmarks?.[landmark] ?? {};

        if (presence < PRESENCE_THRESHOLD) continue;

        // Rotate around Z axis
        if (frame.orientation === 'landscape-right') {
          processedLandmarks[landmark] = {
            ...detectedLandmarks[landmark],
            x: 1 - y,
            y: x,
            z: z,
          };
        } else if (frame.orientation === 'landscape-left') {
          processedLandmarks[landmark] = {
            ...detectedLandmarks[landmark],
            x: y,
            y: 1 - x,
            z: z,
          };
        } else if (frame.orientation === 'portrait-upside-down') {
          processedLandmarks[landmark] = {
            ...detectedLandmarks[landmark],
            x: 1 - x,
            y: 1 - y,
            z: z,
          };
        }
      }

      result.value = processedLandmarks;
    });
  }, []);

  /** Update landmarks on every frame */
  useFrameCallback((frame) => {
    'worklet';

    landmarks.value = result.value;
  });

  return { frameProcessor, landmarks: landmarks };
}
