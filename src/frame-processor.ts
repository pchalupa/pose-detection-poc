import { Skia, type SkImage } from '@shopify/react-native-skia';
import {
  createSkiaFrameProcessor,
  DrawableFrame,
  type Orientation,
} from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import {
  getPoseLandmarks,
  PoseLandmarkType,
  type PoseLandmark,
} from 'vision-camera-pose-landmarks-plugin';

const POSE_CONNECTIONS: [PoseLandmarkType, PoseLandmarkType][] = [
  // Face
  [PoseLandmarkType.LEFT_EYE_INNER, PoseLandmarkType.LEFT_EYE],
  [PoseLandmarkType.LEFT_EYE, PoseLandmarkType.LEFT_EYE_OUTER],
  [PoseLandmarkType.LEFT_EYE_OUTER, PoseLandmarkType.LEFT_EAR],
  [PoseLandmarkType.RIGHT_EYE_INNER, PoseLandmarkType.RIGHT_EYE],
  [PoseLandmarkType.RIGHT_EYE, PoseLandmarkType.RIGHT_EYE_OUTER],
  [PoseLandmarkType.RIGHT_EYE_OUTER, PoseLandmarkType.RIGHT_EAR],
  [PoseLandmarkType.NOSE, PoseLandmarkType.LEFT_EYE_INNER],
  [PoseLandmarkType.NOSE, PoseLandmarkType.RIGHT_EYE_INNER],
  [PoseLandmarkType.LEFT_MOUTH, PoseLandmarkType.RIGHT_MOUTH],

  // Arms
  [PoseLandmarkType.LEFT_SHOULDER, PoseLandmarkType.RIGHT_SHOULDER],
  [PoseLandmarkType.LEFT_SHOULDER, PoseLandmarkType.LEFT_ELBOW],
  [PoseLandmarkType.LEFT_ELBOW, PoseLandmarkType.LEFT_WRIST],
  [PoseLandmarkType.LEFT_WRIST, PoseLandmarkType.LEFT_THUMB],
  [PoseLandmarkType.LEFT_WRIST, PoseLandmarkType.LEFT_PINKY],
  [PoseLandmarkType.LEFT_WRIST, PoseLandmarkType.LEFT_INDEX],
  [PoseLandmarkType.LEFT_PINKY, PoseLandmarkType.LEFT_INDEX],
  [PoseLandmarkType.RIGHT_SHOULDER, PoseLandmarkType.RIGHT_ELBOW],
  [PoseLandmarkType.RIGHT_ELBOW, PoseLandmarkType.RIGHT_WRIST],
  [PoseLandmarkType.RIGHT_WRIST, PoseLandmarkType.RIGHT_THUMB],
  [PoseLandmarkType.RIGHT_WRIST, PoseLandmarkType.RIGHT_PINKY],
  [PoseLandmarkType.RIGHT_WRIST, PoseLandmarkType.RIGHT_INDEX],
  [PoseLandmarkType.RIGHT_PINKY, PoseLandmarkType.RIGHT_INDEX],

  // Torso
  [PoseLandmarkType.LEFT_SHOULDER, PoseLandmarkType.LEFT_HIP],
  [PoseLandmarkType.RIGHT_SHOULDER, PoseLandmarkType.RIGHT_HIP],
  [PoseLandmarkType.LEFT_HIP, PoseLandmarkType.RIGHT_HIP],

  // Legs
  [PoseLandmarkType.LEFT_HIP, PoseLandmarkType.LEFT_KNEE],
  [PoseLandmarkType.LEFT_KNEE, PoseLandmarkType.LEFT_ANKLE],
  [PoseLandmarkType.LEFT_ANKLE, PoseLandmarkType.LEFT_HEEL],
  [PoseLandmarkType.LEFT_HEEL, PoseLandmarkType.LEFT_FOOT_INDEX],
  [PoseLandmarkType.LEFT_ANKLE, PoseLandmarkType.LEFT_FOOT_INDEX],
  [PoseLandmarkType.RIGHT_HIP, PoseLandmarkType.RIGHT_KNEE],
  [PoseLandmarkType.RIGHT_KNEE, PoseLandmarkType.RIGHT_ANKLE],
  [PoseLandmarkType.RIGHT_ANKLE, PoseLandmarkType.RIGHT_HEEL],
  [PoseLandmarkType.RIGHT_HEEL, PoseLandmarkType.RIGHT_FOOT_INDEX],
  [PoseLandmarkType.RIGHT_ANKLE, PoseLandmarkType.RIGHT_FOOT_INDEX],
];

function drawLandmarks(frame: DrawableFrame, landmarks: PoseLandmark[]) {
  'worklet';

  const landmarkMap = new Map<PoseLandmarkType, PoseLandmark>();
  const point = Skia.Paint();
  const line = Skia.Paint();

  line.setColor(Skia.Color('lightblue'));
  line.setStrokeWidth(2);
  line.setStyle(1);

  point.setColor(Skia.Color('blue'));
  point.setStyle(1);

  for (const landmark of landmarks) {
    landmarkMap.set(landmark.type, landmark);
  }

  for (const [start, end] of POSE_CONNECTIONS) {
    const startPoint = landmarkMap.get(start);
    const endPoint = landmarkMap.get(end);

    if (startPoint && endPoint)
      frame.drawLine(
        startPoint.x * frame.width,
        startPoint.y * frame.height,
        endPoint.x * frame.width,
        endPoint.y * frame.height,
        line
      );
  }

  for (const landmark of landmarks) {
    frame.drawCircle(
      landmark.x * frame.width,
      landmark.y * frame.height,
      15 * landmark.z * -1,
      point
    );
  }
}

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
