import { Skia, type SkImage } from '@shopify/react-native-skia';
import {
  createSkiaFrameProcessor,
  DrawableFrame,
  type Orientation,
} from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { getPoseLandmarks } from 'vision-camera-pose-landmarks-plugin';

// SurfaceCache type is private
const surfaceHolder = Worklets.createSharedValue<any>({});
const offscreenTextures = Worklets.createSharedValue<SkImage[]>([]);
const previewOrientation = Worklets.createSharedValue<Orientation>('portrait');

export const frameProcessor = createSkiaFrameProcessor(
  (frame) => {
    'worklet';

    const landmarks = getPoseLandmarks(frame);

    frame.render();
    drawLandmarks(frame, landmarks);
  },
  surfaceHolder,
  offscreenTextures,
  previewOrientation
);

function drawLandmarks(frame: DrawableFrame, landmarks: { type: string; x: number; y: number }[]) {
  'worklet';

  for (const point of landmarks) {
    const { x, y } = point;

    const paint = Skia.Paint();
    paint.setColor(Skia.Color('red'));

    frame.drawCircle(x, y, 5, paint);
  }
}
