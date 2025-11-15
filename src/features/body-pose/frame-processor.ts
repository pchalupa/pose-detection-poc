import { SkCanvas, Skia } from '@shopify/react-native-skia';
import {
  type Landmark,
  type LandmarkName,
  type Landmarks,
} from 'vision-camera-pose-landmarks-plugin';

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
];

const blue = '#3567db';
const darkblue = '#2a3a61ff';

export function drawLandmarks(canvas: SkCanvas, landmarks: Landmarks) {
  'worklet';

  const landmarkMap = new Map<LandmarkName, Landmark>();
  const point = Skia.Paint();
  const line = Skia.Paint();

  line.setColor(Skia.Color(darkblue));
  line.setStrokeWidth(2);
  line.setStyle(1);

  point.setColor(Skia.Color(blue));
  point.setStrokeWidth(3);
  point.setStyle(1);

  for (const landmarkKey in landmarks) {
    const landmark = landmarkKey as LandmarkName;
    landmarkMap.set(landmark, landmarks[landmark]);
  }

  for (const [start, end] of POSE_CONNECTIONS) {
    const startPoint = landmarkMap.get(start);
    const endPoint = landmarkMap.get(end);

    if (startPoint && endPoint)
      canvas.drawLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y, line);
  }

  for (const landmarkKey in landmarks) {
    const landmark = landmarkKey as LandmarkName;
    const { x, y, z } = landmarks[landmark];
    canvas.drawCircle(x, y, 10 * z * -1, point);
  }
}
