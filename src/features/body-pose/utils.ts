import { type Landmark } from 'vision-camera-pose-landmarks-plugin';

/**
 * Pythagorean theorem
 *
 * @see https://en.wikipedia.org/wiki/Pythagorean_theorem
 * */
export function distanceBetween(A: Landmark, B: Landmark): number {
  'worklet';

  const dx = A.x - B.x;
  const dy = A.y - B.y;
  const dz = A.z - B.z;

  return Math.hypot(dx, dy, dz);
}

/**
 * Law of cosines
 *
 * @see https://en.wikipedia.org/wiki/Law_of_cosines
 */
export function angleBetween(A: Landmark, B: Landmark, C: Landmark): number {
  'worklet';

  const a = distanceBetween(B, C);
  const b = distanceBetween(C, A);
  const c = distanceBetween(A, B);

  return Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b));
}

export function radiansToDegrees(rad: number): number {
  'worklet';

  return (rad * 180) / Math.PI;
}

export function degreesToRadians(deg: number): number {
  'worklet';

  return (deg * Math.PI) / 180;
}
