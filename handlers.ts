import { Mesh, Vector3, VertexData } from "babylonjs";
import { scene, defaultObjectToAnimate, fps } from "./index";
import { GeometryNames, ParamName, EditableParams } from "./types";
import { getSelectedMesh, setSelectedMesh } from "./state";

// Params
const editableParams: EditableParams = {
  Plane: {
    width: { min: "0.1", max: "2", step: "0.1" },
    height: { min: "0.1", max: "2", step: "0.1" },
    depth: { min: "0.1", max: "2", step: "0.1" },
  },
  IcoSphere: {
    radius: { min: "0.1", max: "2", step: "0.1" },
    subdivisions: { min: "1", max: "10", step: "1" },
  },
  Cylinder: {
    diameterTop: { min: "0.1", max: "2", step: "0.1" },
    diameterBottom: { min: "0.1", max: "2", step: "0.1" },
    height: { min: "0.1", max: "2", step: "0.1" },
  },
};

const amplitudeVect = new Vector3(0, 0, 0);

export function onMeshPick(mesh: Mesh) {
  setSelectedMesh(mesh);
  const optionsContainer = document.getElementById("options_container");
  const optionsEl = document.getElementById("options");

  const paramsToEdit = editableParams[mesh.id as GeometryNames];

  const paramElements = [] as Node[];
  Object.keys(paramsToEdit).forEach((param) => {
    const paramnName = param as ParamName;
    const label = document.createElement("label");
    label.innerText = paramnName;
    const input = document.createElement("input");
    input.type = "range";
    input.name = paramnName;
    input.min = paramsToEdit[paramnName]?.min ?? "0.1";
    input.max = paramsToEdit[paramnName]?.max ?? "2";
    input.step = paramsToEdit[paramnName]?.step ?? "0.1";
    input.value = mesh.metadata[paramnName];
    input.addEventListener("input", onInputChange);
    paramElements.push(label);
    paramElements.push(input);
  });

  optionsEl?.replaceChildren(...paramElements);
  optionsContainer?.classList.add("show");
}

export function onInputChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const parameterName = target.name;
  const inputValue = parseFloat(target.value);
  const selectedMesh = getSelectedMesh();

  if (selectedMesh) {
    const newParams = {
      ...selectedMesh.metadata,
      [parameterName]: inputValue,
    };
    selectedMesh.metadata = newParams;
    switch (selectedMesh.id) {
      case "Plane":
        VertexData.CreateBox(newParams).applyToMesh(selectedMesh, true);
        break;
      case "IcoSphere":
        VertexData.CreateIcoSphere(newParams).applyToMesh(selectedMesh, true);
        break;
      case "Cylinder":
        VertexData.CreateCylinder(newParams).applyToMesh(selectedMesh, true);
        break;
      default:
        break;
    }
  }
}

export function onClickPlay() {
  const [amplitude, duration] = getAnimationInputs();
  const animationObject = getSelectedMesh() ?? defaultObjectToAnimate;

  if (!animationObject) return;

  const currAnimation = animationObject.getAnimationByName("animationBounce");
  if (currAnimation) {
    const currKeys = currAnimation.getKeys();
    const newKeys = currKeys.map((key) => {
      if (key.frame === 0) {
        key.value = animationObject.position.add(
          amplitudeVect.set(0, amplitude, 0)
        );
      }
      return key;
    });
    currAnimation.setKeys(newKeys);
  }

  scene.beginAnimation(animationObject, 0, fps * duration);
}

export function getAnimationInputs() {
  const amplitudeInput = document.getElementById(
    "amplitude"
  ) as HTMLInputElement;
  const durationInput = document.getElementById("duration") as HTMLInputElement;
  return [parseInt(amplitudeInput.value), parseInt(durationInput.value)];
}
