import React, { useEffect, useRef, useState } from "react";
// import { useFrame } from "react-three-fiber";
import { Mesh, Vector3, Matrix4, Box3, MeshBasicMaterial, Color } from "three";
import { Stats } from "@react-three/drei";
import { gsap } from "gsap";

const allStars: Array<React.MutableRefObject<undefined>> = []

const Star = ({ position, color }: { position: any, color: any }) => {
  const mesh = useRef();
  const [hover, setHover] = useState(false);
  const radius = parseFloat((Math.random() * (0.5 - 0.2) + 0.2).toFixed(4))
  allStars.push(mesh)
  useEffect(() => {
    moveStar(mesh, Math.floor(Math.random() * 20) - 10, Math.floor(Math.random() * 20) - 10, Math.floor(Math.random() * 20) - 10, radius).play()
  });
  return (
    <>
      <mesh position={position} ref={mesh}
        onPointerOver={() => {
          setHover(true);
        }}
        onPointerOut={() => {
          setHover(false);
        }}
      >
        <sphereBufferGeometry attach='geometry' args={[radius, 15, 16]} />
        <meshStandardMaterial attach='material' color={hover ? "red" : color} />
      </mesh>

    </>
  );
}

function moveStar(mesh: React.MutableRefObject<undefined>, x: number, y: number, z: number, r: number) {
  const t = gsap.to((mesh.current! as Mesh).position, {
    x: x,
    y: y,
    z: z,
    duration: 10,
    onUpdate: () => {
      if (isInsideBox(mesh, r)) {
        t.kill()
        moveStar(mesh, Math.floor(Math.random() * 20) - 10, Math.floor(Math.random() * 20) - 10, Math.floor(Math.random() * 20) - 10, r).play()
      }
    },
    onComplete: () => {
      moveStar(mesh, Math.floor(Math.random() * 20) - 10, Math.floor(Math.random() * 20) - 10, Math.floor(Math.random() * 20) - 10, r).play()
    }
  });
  return t
}

function isInsideBox(self: React.MutableRefObject<undefined>, r: number): boolean {
  if (((self.current! as Mesh).position.x + (r*2)) > 5 || ((self.current! as Mesh).position.x - r) < -5) {
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

function createStars() {
  let stars = []
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * (5 - (-5) + 1)) + (-5)
    const y = Math.floor(Math.random() * (5 - (-5) + 1)) + (-5)
    const z = Math.floor(Math.random() * (5 - (-5) + 1)) + (-5)
    stars[i] = [x, y, z]
  }
  return stars
}

const stars = createStars().map((cords, i) =>
(
  <Star key={i} position={cords} color='white' />
)
)

function Box({ position }: { position: Vector3 }) {
  return (
    <mesh castShadow position={position}>
      <boxBufferGeometry attach="geometry" args={[10, 10, 10]} />
      <meshStandardMaterial attach="material" color="0xffffff" wireframe={true} />
    </mesh>
  );
}


const Scene: React.FC = (props) => (
  <mesh>
    <Box position={new Vector3(0, 0, 0)} />
    <ambientLight />
    <Stats showPanel={0} className="stats" {...props} />
    {stars}
  </mesh>
);

export default Scene;


