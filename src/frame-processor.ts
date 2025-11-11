import { Skia, type SkImage } from '@shopify/react-native-skia';
import { createSkiaFrameProcessor, type Orientation } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { detectPose } from 'vision-camera-pose-detection-plugin';
const surfaceHolder = Worklets.createSharedValue<SurfaceCache>({});
const offscreenTextures = Worklets.createSharedValue<SkImage[]>([]);
const previewOrientation = Worklets.createSharedValue<Orientation>('portrait');
export const frameProcessor = createSkiaFrameProcessor(
  (frame) => {
    'worklet';
    frame.render();

    const data = detectPose(frame);

    for (const point of data) {
      const { x, y } = point;

      const paint = Skia.Paint();
      paint.setColor(Skia.Color('red'));

      frame.drawCircle(x, y, 5, paint);
    }
  },
  surfaceHolder,
  offscreenTextures,
  previewOrientation
);
