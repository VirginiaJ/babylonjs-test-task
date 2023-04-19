import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  Quaternion,
  Mesh,
  ActionManager,
  ExecuteCodeAction,
  StandardMaterial,
  Color3,
  ShadowGenerator,
  DirectionalLight,
} from "babylonjs";
import "babylonjs-loaders";
import { applyBouncing } from "./animation";
import { getAnimationInputs, onClickPlay, onMeshPick } from "./handlers";
import { setSelectedMesh } from "./state";

const canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement))
  throw new Error("Couldn't find a canvas. Aborting the demo");

const engine = new Engine(canvas, true, {});
export const scene = new Scene(engine);

export let defaultObjectToAnimate: Mesh | null = null;
export const fps = 30;

function prepareScene() {
  // Camera
  const camera = new ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 2.5,
    10,
    new Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, true);

  // Light
  new HemisphericLight("light", new Vector3(0.5, 1, 0.8).normalize(), scene);
  const light = new DirectionalLight(
    "dirLight",
    new Vector3(-1, -2, -1),
    scene
  );
  light.position = new Vector3(2, 10, 2);
  light.intensity = 0.5;

  // Shadows
  const shadowGenerator = new ShadowGenerator(1024, light);
  shadowGenerator.useBlurExponentialShadowMap = true;

  // Materials
  const mat1 = new StandardMaterial("mat1", scene);
  mat1.diffuseColor = new Color3(1, 1, 0);
  const mat2 = new StandardMaterial("mat2", scene);
  mat2.diffuseColor = new Color3(0, 1, 0);
  const mat3 = new StandardMaterial("mat3", scene);
  mat3.diffuseColor = new Color3(1, 0, 0);

  // Objects
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 20, height: 20 },
    scene
  );
  ground.receiveShadows = true;

  const plane = MeshBuilder.CreateBox(
    "Plane",
    { width: 1, height: 1, depth: 1, updatable: true },
    scene
  );
  plane.material = mat2;
  plane.metadata = { width: 1, height: 1, depth: 1 };
  plane.position.set(0, 0.5, 0);
  plane.rotationQuaternion = Quaternion.FromEulerAngles(0, Math.PI, 0);

  const icosphere = MeshBuilder.CreateIcoSphere(
    "IcoSphere",
    { radius: 1, subdivisions: 5, updatable: true },
    scene
  );
  icosphere.material = mat3;
  icosphere.metadata = { radius: 1, subdivisions: 5 };
  icosphere.position.set(-2, 1, 0);

  const cylinder = MeshBuilder.CreateCylinder(
    "Cylinder",
    { height: 2, diameterTop: 1, diameterBottom: 1, updatable: true },
    scene
  );
  cylinder.material = mat1;
  cylinder.metadata = { height: 2, diameterTop: 1, diameterBottom: 1 };
  cylinder.position.set(2, 1, 0);

  // Actions
  plane.actionManager = new ActionManager(scene);
  icosphere.actionManager = new ActionManager(scene);
  cylinder.actionManager = new ActionManager(scene);

  plane.actionManager.registerAction(
    new ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
      onMeshPick(plane);
    })
  );
  icosphere.actionManager.registerAction(
    new ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
      onMeshPick(icosphere);
    })
  );
  cylinder.actionManager.registerAction(
    new ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
      onMeshPick(cylinder);
    })
  );

  shadowGenerator.getShadowMap()?.renderList?.push(plane);
  shadowGenerator.getShadowMap()?.renderList?.push(icosphere);
  shadowGenerator.getShadowMap()?.renderList?.push(cylinder);

  // Create animations
  defaultObjectToAnimate = icosphere;
  const [amplitude, duration] = getAnimationInputs();
  applyBouncing(plane, amplitude, duration);
  applyBouncing(icosphere, amplitude, duration);
  applyBouncing(cylinder, amplitude, duration);
  scene.beginAnimation(icosphere, 0, fps * duration);
  document.getElementById("play")?.addEventListener("click", onClickPlay);
}

prepareScene();

scene.onPointerUp = (e, pickInfo) => {
  const optionsContainer = document.getElementById("options_container");
  if (!pickInfo?.pickedMesh || pickInfo?.pickedMesh.id === "ground") {
    setSelectedMesh(null);
    optionsContainer?.classList.remove("show");
  }
};

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
