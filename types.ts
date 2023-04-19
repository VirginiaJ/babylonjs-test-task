export type GeometryNames = "Plane" | "IcoSphere" | "Cylinder";

type RangeOptions = {
  min: string;
  max: string;
  step: string;
};

export type ParamName =
  | "width"
  | "height"
  | "depth"
  | "radius"
  | "subdivisions"
  | "diameterTop"
  | "diameterBottom";

export type EditableParams = Record<
  GeometryNames,
  Partial<Record<ParamName, RangeOptions>>
>;
