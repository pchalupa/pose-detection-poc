import { type Frame, VisionCameraProxy } from 'react-native-vision-camera';

export interface PoseLandmark {
  type: string;
  x: number;
  y: number;
}

const plugin = VisionCameraProxy.initFrameProcessorPlugin('detectPose', {});

export function detectPose(frame: Frame): PoseLandmark[] {
  'worklet';

  return plugin?.call(frame) ?? [];
}
