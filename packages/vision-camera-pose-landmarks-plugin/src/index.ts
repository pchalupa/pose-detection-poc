import { useMemo } from 'react';
import { type Frame, VisionCameraProxy } from 'react-native-vision-camera';

export function createPoseLandmarksPlugin() {
  const poseLandmarksPlugin = VisionCameraProxy.initFrameProcessorPlugin('detectPoseLandmarks', {});

  if (poseLandmarksPlugin == null)
    throw new Error(
      'Cannot find vision-camera-pose-landmarks-plugin! Did you install the native dependency properly?'
    );

  return {
    /**
     * Detects human pose landmarks in a camera frame using MediaPipe.
     *
     * @example
     * ```ts
     * const frameProcessor = useSkiaFrameProcessor((frame) => {
     *   'worklet';
     *   const landmarks = detectPoseLandmarks(frame);
     *   // Process landmarks...
     * }, []);
     * ```
     */
    detectPoseLandmarks: (frame: Frame): PoseLandmark[] => {
      'worklet';
      return (poseLandmarksPlugin.call(frame) as unknown as PoseLandmark[]) ?? [];
    },
  };
}

/**
 * Use an instance of the pose landmarks plugin.
 */
export function usePoseLandmarksPlugin() {
  return useMemo(() => createPoseLandmarksPlugin(), []);
}

export type PoseLandmark = {
  type: PoseLandmarkType;
  x: NormalizedCoordinate;
  y: NormalizedCoordinate;
  z: NormalizedCoordinate;
};

/** Normalized coordinate value in the range [0, 1]. */
type NormalizedCoordinate = number;

/** Types of pose landmarks detected by the pose detection model. */
export enum PoseLandmarkType {
  NOSE,
  LEFT_EYE_INNER,
  LEFT_EYE,
  LEFT_EYE_OUTER,
  RIGHT_EYE_INNER,
  RIGHT_EYE,
  RIGHT_EYE_OUTER,
  LEFT_EAR,
  RIGHT_EAR,
  LEFT_MOUTH,
  RIGHT_MOUTH,
  LEFT_SHOULDER,
  RIGHT_SHOULDER,
  LEFT_ELBOW,
  RIGHT_ELBOW,
  LEFT_WRIST,
  RIGHT_WRIST,
  LEFT_PINKY,
  RIGHT_PINKY,
  LEFT_INDEX,
  RIGHT_INDEX,
  LEFT_THUMB,
  RIGHT_THUMB,
  LEFT_HIP,
  RIGHT_HIP,
  LEFT_KNEE,
  RIGHT_KNEE,
  LEFT_ANKLE,
  RIGHT_ANKLE,
  LEFT_HEEL,
  RIGHT_HEEL,
  LEFT_FOOT_INDEX,
  RIGHT_FOOT_INDEX,
  UNKNOWN,
}
