import { SkCanvas, Skia } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';
import {
  type Landmark,
  type LandmarkName,
  type Landmarks,
} from 'vision-camera-pose-landmarks-plugin';
import { palette } from '~/template';

const POSE_CONNECTIONS: [LandmarkName, LandmarkName][] = [
  // Face
  ['leftEyeInner', 'leftEye'],
  ['leftEye', 'leftEyeOuter'],
  ['leftEyeOuter', 'leftEar'],
  ['rightEyeInner', 'rightEye'],
  ['rightEye', 'rightEyeOuter'],
  ['rightEyeOuter', 'rightEar'],
  ['nose', 'leftEyeInner'],
  ['nose', 'rightEyeInner'],
  ['leftMouth', 'rightMouth'],

  // Arms
  ['leftShoulder', 'rightShoulder'],
  ['leftShoulder', 'leftElbow'],
  ['leftElbow', 'leftWrist'],
  ['leftWrist', 'leftThumb'],
  ['leftWrist', 'leftPinky'],
  ['leftWrist', 'leftIndex'],
  ['leftPinky', 'leftIndex'],
  ['rightShoulder', 'rightElbow'],
  ['rightElbow', 'rightWrist'],
  ['rightWrist', 'rightThumb'],
  ['rightWrist', 'rightPinky'],
  ['rightWrist', 'rightIndex'],
  ['rightPinky', 'rightIndex'],

  // Torso
  ['leftShoulder', 'leftHip'],
  ['rightShoulder', 'rightHip'],
  ['leftHip', 'rightHip'],

  // Legs
  ['leftHip', 'leftKnee'],
  ['leftKnee', 'leftAnkle'],
  ['leftAnkle', 'leftHeel'],
  ['leftHeel', 'leftFootIndex'],
  ['leftAnkle', 'leftFootIndex'],
  ['rightHip', 'rightKnee'],
  ['rightKnee', 'rightAnkle'],
  ['rightAnkle', 'rightHeel'],
  ['rightHeel', 'rightFootIndex'],
  ['rightAnkle', 'rightFootIndex'],
] as const;

export function drawLandmarks(
  canvas: SkCanvas,
  layout: SharedValue<{ width: number; height: number }>,
  landmarks?: SharedValue<Landmarks | undefined>
) {
  'worklet';

  const landmarkMap = new Map<LandmarkName, Landmark>();
  const point = Skia.Paint();
  const line = Skia.Paint();

  line.setColor(Skia.Color(palette.darkBlue));
  line.setStrokeWidth(2);
  line.setStyle(1);

  point.setColor(Skia.Color(palette.blue));
  point.setStrokeWidth(3);
  point.setStyle(1);

  for (const landmarkKey in landmarks?.value) {
    const landmark = landmarkKey as LandmarkName;
    const coordinates = landmarks.value?.[landmark];

    if (!coordinates) continue;

    landmarkMap.set(landmark, coordinates);
  }

  for (const [start, end] of POSE_CONNECTIONS) {
    const startPoint = landmarkMap.get(start);
    const endPoint = landmarkMap.get(end);

    if (startPoint && endPoint)
      canvas.drawLine(
        startPoint.x * layout.value.width,
        startPoint.y * layout.value.height,
        endPoint.x * layout.value.width,
        endPoint.y * layout.value.height,
        line
      );
  }

  for (const landmarkKey in landmarks?.value) {
    const landmark = landmarkKey as LandmarkName;
    let coordinates = landmarks.value?.[landmark];

    if (!coordinates) continue;

    canvas.drawCircle(
      coordinates.x * layout.value.width,
      coordinates.y * layout.value.height,
      (1 - coordinates.z) * 2,
      point
    );
  }

  return canvas;
}
