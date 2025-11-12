import { type Frame, VisionCameraProxy } from 'react-native-vision-camera';

const plugin = VisionCameraProxy.initFrameProcessorPlugin('getPoseLandmarks', {});

export function getPoseLandmarks(frame: Frame): PoseLandmark[] {
  'worklet';

  // @ts-expect-error
  return plugin?.call(frame) ?? [];
}

export type PoseLandmark = {
  type: PoseLandmarkType;
  x: number;
  y: number;
};

export enum PoseLandmarkType {
  NOSE = 'NOSE',
  LEFT_EYE_INNER = 'LEFT_EYE_INNER',
  LEFT_EYE = 'LEFT_EYE',
  LEFT_EYE_OUTER = 'LEFT_EYE_OUTER',
  RIGHT_EYE_INNER = 'RIGHT_EYE_INNER',
  RIGHT_EYE = 'RIGHT_EYE',
  RIGHT_EYE_OUTER = 'RIGHT_EYE_OUTER',
  LEFT_EAR = 'LEFT_EAR',
  RIGHT_EAR = 'RIGHT_EAR',
  LEFT_MOUTH = 'LEFT_MOUTH',
  RIGHT_MOUTH = 'RIGHT_MOUTH',
  LEFT_SHOULDER = 'LEFT_SHOULDER',
  RIGHT_SHOULDER = 'RIGHT_SHOULDER',
  LEFT_ELBOW = 'LEFT_ELBOW',
  RIGHT_ELBOW = 'RIGHT_ELBOW',
  LEFT_WRIST = 'LEFT_WRIST',
  RIGHT_WRIST = 'RIGHT_WRIST',
  LEFT_PINKY = 'LEFT_PINKY',
  RIGHT_PINKY = 'RIGHT_PINKY',
  LEFT_INDEX = 'LEFT_INDEX',
  RIGHT_INDEX = 'RIGHT_INDEX',
  LEFT_THUMB = 'LEFT_THUMB',
  RIGHT_THUMB = 'RIGHT_THUMB',
  LEFT_HIP = 'LEFT_HIP',
  RIGHT_HIP = 'RIGHT_HIP',
  LEFT_KNEE = 'LEFT_KNEE',
  RIGHT_KNEE = 'RIGHT_KNEE',
  LEFT_ANKLE = 'LEFT_ANKLE',
  RIGHT_ANKLE = 'RIGHT_ANKLE',
  LEFT_HEEL = 'LEFT_HEEL',
  RIGHT_HEEL = 'RIGHT_HEEL',
  LEFT_FOOT_INDEX = 'LEFT_FOOT_INDEX',
  RIGHT_FOOT_INDEX = 'RIGHT_FOOT_INDEX',
  UNKNOWN = 'UNKNOWN',
}
