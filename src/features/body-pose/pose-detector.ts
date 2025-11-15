import { type Landmark } from 'vision-camera-pose-landmarks-plugin';

/** Pythagoras */
export function distanceBetween(pointA: Landmark, pointB: Landmark): number {
  'worklet';
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  const dz = pointA.z - pointB.z;

  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot
  return Math.hypot(dx, dy, dz);
}
