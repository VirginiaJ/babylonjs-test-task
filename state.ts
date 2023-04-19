import { Mesh } from "babylonjs";

let selectedMesh: Mesh | null = null;

export const getSelectedMesh = () => selectedMesh;
export const setSelectedMesh = (v: Mesh | null) => (selectedMesh = v);
