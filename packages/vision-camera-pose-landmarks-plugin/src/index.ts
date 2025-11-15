import { useMemo } from 'react';
import { type Frame, VisionCameraProxy } from 'react-native-vision-camera';

/** Get a new instance of the pose landmarks plugin. */
export function createPoseLandmarksPlugin() {
  const poseLandmarksPlugin = VisionCameraProxy.initFrameProcessorPlugin('detectPoseLandmarks', {});

  if (poseLandmarksPlugin == null)
    throw new Error(
      'Cannot find vision-camera-pose-landmarks-plugin! Did you install the native dependency properly?'
    );

  return {
    /**
     * Detects human pose landmarks in a camera frame.
     *
     * @example
     * ```ts
     * const frameProcessor = useFrameProcessor((frame) => {
     *   'worklet';
     *   const landmarks = detectPoseLandmarks(frame);
     *   // Process landmarks...
     * }, []);
     * ```
     */
    detectPoseLandmarks: (frame: Frame): Landmarks => {
      'worklet';
      return (poseLandmarksPlugin.call(frame) as unknown as Landmarks) ?? {};
    },
  };
}

/** Use an instance of the pose landmarks plugin. */
export function usePoseLandmarksPlugin() {
  return useMemo(() => createPoseLandmarksPlugin(), []);
}

export type Landmarks = {
  nose: Landmark;
  leftEyeInner: Landmark;
  leftEye: Landmark;
  leftEyeOuter: Landmark;
  rightEyeInner: Landmark;
  rightEye: Landmark;
  rightEyeOuter: Landmark;
  leftEar: Landmark;
  rightEar: Landmark;
  leftMouth: Landmark;
  rightMouth: Landmark;
  leftShoulder: Landmark;
  rightShoulder: Landmark;
  leftElbow: Landmark;
  rightElbow: Landmark;
  leftWrist: Landmark;
  rightWrist: Landmark;
  leftPinky: Landmark;
  rightPinky: Landmark;
  leftIndex: Landmark;
  rightIndex: Landmark;
  leftThumb: Landmark;
  rightThumb: Landmark;
  leftHip: Landmark;
  rightHip: Landmark;
  leftKnee: Landmark;
  rightKnee: Landmark;
  leftAnkle: Landmark;
  rightAnkle: Landmark;
  leftHeel: Landmark;
  rightHeel: Landmark;
  leftFootIndex: Landmark;
  rightFootIndex: Landmark;
  unknown: Landmark;
};

export type Landmark = {
  x: NormalizedCoordinate;
  y: NormalizedCoordinate;
  z: NormalizedCoordinate;
  visibility: number;
  presence: number;
};

/** Normalized coordinate value in the range of [0, 1]. */
type NormalizedCoordinate = number;
