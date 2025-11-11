import { type Frame, VisionCameraProxy } from 'react-native-vision-camera';

export type PoseLandmark = {
  type: string;
  x: number;
  y: number;
};

const plugin = VisionCameraProxy.initFrameProcessorPlugin('getPoseLandmarks', {});

export function getPoseLandmarks(frame: Frame): PoseLandmark[] {
  'worklet';

  return (plugin?.call(frame) ?? []) as unknown as PoseLandmark[];
}
