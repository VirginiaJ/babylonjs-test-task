import { Vector3, TransformNode, Animation, IAnimationKey } from "babylonjs";
import "babylonjs-loaders";
import { fps } from "./index";

export function applyBouncing(
  node: TransformNode,
  amplitude: number,
  duration: number
) {
  const animationBounce = new Animation(
    "animationBounce",
    "position",
    fps,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const startPos = node.position.add(new Vector3(0, amplitude, 0));

  const keysBounce: IAnimationKey[] = [];
  keysBounce.push({ frame: 0, value: startPos });
  keysBounce.push({ frame: fps * duration, value: node.position });
  animationBounce.setKeys(keysBounce);

  const easingFunction = new BABYLON.BounceEase();
  easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
  animationBounce.setEasingFunction(easingFunction);

  node.animations.push(animationBounce);
}
