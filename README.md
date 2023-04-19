### Install

`npm install`

### Run

- `npm run dev`
- Go to `localhost:8080` in the web browser

#### UI & Primitive Meshes

Selecting a mesh brings up a UI window with primitives parameters adjustment.
When a primitive mesh is selected, the UI displays options specific for the selected primitive. It is possible to set:

- For the _Cube_: 3 dimensions: width, height, depth (range 0.1-2.0)
- For the _Cylinder_: radiusTop, radiusBottom and height (range 0.1-2.0)
- For the _IcoSphere_: radius (range 0.1-2.0) and detail (range 1-10)

#### Bouncing Animation

Implements the following algorithm:
`applyBouncing(node: TransformNode, amplitude: number, duration: time)`

where

- `node` - an object which should play this animation
- `amplitude` - the start height of the bounce.
- `duration` - Period of time in s from the start of the animation when the object is at the topmost point to the end of the animation when the object has completely stopped.
