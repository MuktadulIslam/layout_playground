import { Group, Mesh, Object3D } from "three";

export interface PlacedObject {
  id: string
  component: React.ReactNode
  position: [number, number, number]
}

export type SelectableObject = Mesh | Group | Object3D | null;