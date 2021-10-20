import React, { useEffect, useMemo, useRef } from 'react'
import { Material, Mesh, MeshStandardMaterial, Vector3, Color } from "three";

import { gsap, Power4 } from "gsap";
import { Stats } from "./Stats"

//array that holds all the star objects
const allStars: Array<React.MutableRefObject<undefined>> = []

//takes in @param position and @param color and returns a mesh with sphere geometry, with a random radius
const Star = ({ position, color }: { position: any, color: any }) => {
  const mesh = useRef();
  let mat: Material
  const radius: number = parseFloat((Math.random() * (0.5 - 0.2) + 0.2).toFixed(4))
  allStars.push(mesh)
  //material used for all stars
  const material = useMemo(() => new MeshStandardMaterial({ color }), [color])
  useEffect(() => {
    moveStar(mesh, Math.floor(Math.random() * 20) - 10, Math.floor(Math.random() * 20) - 10, Math.floor(Math.random() * 20) - 10, radius).play()
  }, [radius]);
  return (
    <>
      <mesh position={position} ref={mesh}
        onPointerOver={(e) => {
          mat = ((e.eventObject as Mesh).material as MeshStandardMaterial).clone();
          ((e.eventObject as Mesh).material as MeshStandardMaterial).color = new Color(0xff0000);
          (e.eventObject as Mesh).userData.mouseOver = true;
        }}
        onPointerOut={(e) => {
          ((e.eventObject as Mesh).material as MeshStandardMaterial).dispose();
          (e.eventObject as Mesh).material = mat;
          (e.eventObject as Mesh).userData.mouseOver = false;
        }}
        material={material}
        userData={{ mouseOver: false }}
      >
        <sphereBufferGeometry attach='geometry' args={[radius, 15, 16]} />
      </mesh>
    </>
  );
}

/*
function that takes in @param mesh and @param x, @param y, @param z as the coordinates to which to move the mesh towards
as well as the @param r, to calculate if it's radius is still inside the box container
*/
function moveStar(mesh: React.MutableRefObject<undefined>, x: number, y: number, z: number, r: number) {
  (mesh.current! as Mesh).geometry.computeBoundingSphere();
  //the tween that moves the mesh itself
  const t: gsap.core.Tween = gsap.to((mesh.current! as Mesh).position, {
    x: x,
    y: y,
    z: z,
    duration: 10 / ((mesh.current! as Mesh).scale.x),
    ease: Power4.easeOut,
    onUpdate: () => {
      /*
      check if mesh is inside box based on the radius
      returns false if it is
      */
      if (isOutsideBox(mesh, r)) {
        //kills current tween releasing it for garbage collection
        t.kill()
        //start new tween to move object in a different direction
        moveStar(mesh, Math.floor(Math.random() * 20) - 10, Math.floor(Math.random() * 20) - 10, Math.floor(Math.random() * 20) - 10, r).play()
      }
      /*
     check if mesh collides with the other meshes
     */
      checkCollision(mesh)
    },
    onComplete: () => {
      //kills current tween releasing it for garbage collection
      t.kill()
      //if no collision has been detected with box container start a new tween to keep the object in motion
      moveStar(mesh, Math.floor(Math.random() * 20) - 10, Math.floor(Math.random() * 20) - 10, Math.floor(Math.random() * 20) - 10, r).play()
    }
  });
  return t
}
//functions for creating multiple stars with random positions and returns the coordinates array
function createStars(count: number) {
  const stars = []
  for (let i = 0; i < count; i++) {
    //random coordinates for stars
    const x = Math.floor(Math.random() * (5 - (-5) + 1)) + (-5)
    const y = Math.floor(Math.random() * (5 - (-5) + 1)) + (-5)
    const z = Math.floor(Math.random() * (5 - (-5) + 1)) + (-5)
    stars[i] = [x, y, z]
  }
  return stars
}
//uses the @param cords to initialize each star position 
const stars = createStars(100).map((cords, i) =>
(
  <Star key={i} position={cords} color='white' />
)
)

//collision function that checks if object is within the box container based on it's position vector
function isOutsideBox(self: React.MutableRefObject<undefined>, r: number): boolean {
  if (((self.current! as Mesh).position.x + (r * 2)) > 5 || ((self.current! as Mesh).position.x - r) < -5) {
    return true
  }
  else if (((self.current! as Mesh).position.y + r) > 5 || ((self.current! as Mesh).position.y - r) < -5) {
    return true
  }
  else if (((self.current! as Mesh).position.z + r) > 5 || ((self.current! as Mesh).position.z - r) < -5) {
    return true
  }
  else {
    return false
  }
}
//collision function that checks between stars based on radius and changes the meshe's color if they intersect
function checkCollision(self: React.MutableRefObject<undefined>): void {
  for (let i = 0; i < allStars.length; i++) {
    //condition that check's that it doesn't trigger collision with itself
    if ((allStars[i].current! as Mesh) !== (self.current! as Mesh)) {
      // we are using multiplications because it's faster than calling Math.pow
      const distance = Math.sqrt(((self.current! as Mesh).position.x - (allStars[i].current! as Mesh).position.x) * ((self.current! as Mesh).position.x - (allStars[i].current! as Mesh).position.x) +
        ((self.current! as Mesh).position.y - (allStars[i].current! as Mesh).position.y) * ((self.current! as Mesh).position.y - (allStars[i].current! as Mesh).position.y) +
        ((self.current! as Mesh).position.z - (allStars[i].current! as Mesh).position.z) * ((self.current! as Mesh).position.z - (allStars[i].current! as Mesh).position.z));
      if (distance < ((self.current! as Mesh).geometry.boundingSphere!.radius + (allStars[i].current! as Mesh).geometry.boundingSphere!.radius)) {
        ((self.current! as Mesh).material as MeshStandardMaterial).color = new Color(0xff0000);
        ((allStars[i].current! as Mesh).material as MeshStandardMaterial).color = new Color(0xff0000);
      }
      //check if mouseOver event is true so that it doesn't override the material
      else if (!(self.current! as Mesh).userData.mouseOver) {
        ((self.current! as Mesh).material as MeshStandardMaterial).color = new Color(0xffffff);
      }
      else if (!(allStars[i].current! as Mesh).userData.mouseOver) {
        ((allStars[i].current! as Mesh).material as MeshStandardMaterial).color = new Color(0xffffff);
      }
    }
  }
}

//box container that returns the main box that the stars will move inside
function Box({ position }: { position: Vector3 }) {
  return (
    <mesh castShadow position={position}>
      <boxBufferGeometry attach="geometry" args={[10, 10, 10]} />
      <meshStandardMaterial attach="material" color="white" wireframe={true} />
    </mesh>
  );
}

//3D scene
const Scene: React.FC = () => (
  <mesh>
    <Box position={new Vector3(0, 0, 0)} />
    <ambientLight />
    <Stats showPanel={0} />
    {stars}
  </mesh>
);

export default Scene;


