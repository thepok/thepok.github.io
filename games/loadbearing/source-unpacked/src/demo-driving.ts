import { CANNON_BALLISTICS } from './cannon-ballistics';
import { rotateByQuaternion } from './fracture';
import type { V3 } from './catalog';

const TAU = Math.PI * 2;
const ORBIT_RADIUS = 25;
const ORBIT_RATE = 0.16;
const GRAVITY = CANNON_BALLISTICS.gravity;
const MUZZLE_SPEED = CANNON_BALLISTICS.speed;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const wrapAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

/**
 * Deterministic controls for the autonomous vehicle showcase.
 * Position and target are world-space vectors; quaternion is [x, y, z, w].
 */
export function demoVehicleControls(
 position: number[],
 quaternion: number[],
 target: number[],
 elapsed: number,
 orbitRadius=ORBIT_RADIUS,
 aimTarget=target,
) {
 const [x, , z] = position;
 const [qx, qy, qz, qw] = quaternion;
 const bodyYaw = Math.atan2(2 * (qx * qz + qw * qy), 1 - 2 * (qx * qx + qy * qy));

  // The phase starts at the vehicle spawn (0, 0, 20) and advances around the building.
 const phase = .45 + elapsed * ORBIT_RATE;
 const waypoint: V3 = [target[0]+Math.sin(phase) * orbitRadius, 0, target[2]+Math.cos(phase) * orbitRadius];
 let dx = waypoint[0] - x;
 let dz = waypoint[2] - z;
 const distance = Math.hypot(dx, dz);

  // Add an outward component when the vehicle cuts inside the safe orbit radius.
 const radialX=x-target[0],radialZ=z-target[2],radialDistance = Math.hypot(radialX, radialZ);
 if (radialDistance < orbitRadius - 4) {
   const outward = Math.max(0, orbitRadius - 4 - radialDistance);
   const invRadius = radialDistance > 0.001 ? 1 / radialDistance : 0;
   dx += radialX * invRadius * outward * 1.8;
   dz += radialZ * invRadius * outward * 1.8;
 }
 const desiredYaw = Math.atan2(-dx, -dz);
 const headingError = wrapAngle(desiredYaw - bodyYaw);
 const steer = clamp(headingError * 1.8, -1, 1);
 const throttle = clamp(0.88 - Math.abs(headingError) * 0.62 - Math.max(0, 8 - distance) * 0.015, 0.24, 0.9);

  // Aim in world space first, then transform into the turret's body-local frame.
 const aimX = aimTarget[0] - x;
 const aimY = aimTarget[1] - position[1];
 const aimZ = aimTarget[2] - z;
 const horizontal = Math.hypot(aimX, aimZ);
 const ballisticRise = horizontal > 0.001 ? (GRAVITY * horizontal * horizontal) / (2 * MUZZLE_SPEED * MUZZLE_SPEED) : 0;
 const aimPitch = Math.atan2(aimY + ballisticRise, Math.max(horizontal, 0.001));
 const flatDirection: V3 = horizontal > 0.001
   ? [aimX / horizontal * Math.cos(aimPitch), Math.sin(aimPitch), aimZ / horizontal * Math.cos(aimPitch)]
   : [0, Math.sin(aimPitch), -Math.cos(aimPitch)];
 const localDirection = rotateByQuaternion(flatDirection, [-qx, -qy, -qz, qw]);
 const yaw = Math.atan2(-localDirection[0], -localDirection[2]);
 const pitch = Math.asin(clamp(localDirection[1], -1, 1));

 return {
   throttle,
   steer,
   brake: false,
   fire: elapsed >= 3,
   yaw: clamp(yaw, -Math.PI, Math.PI),
   pitch: clamp(pitch, -0.35, 0.7),
 };
}
