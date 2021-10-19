import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";
import { Mesh, Vector3 } from "three";
import { Stats, PerspectiveCamera } from "@react-three/drei";

const Star = ({ position, color }: { position: any, color: any }) => {
  const mesh = useRef(null);
  useFrame(() => (
    (mesh.current! as Mesh).rotation.x += 0.01)
  );
  return (
    <>
      <mesh position={position} ref={mesh}>
        <sphereBufferGeometry attach='geometry' args={[0.02, 15, 16]} />
        <meshStandardMaterial attach='material' color={color} />
      </mesh>

    </>
  );
}

function createStars() {
  let stars = []
  for (var i = 0; i < 100; i++) {
    var x = Math.floor(Math.random() * (5 - (-5) + 1)) + (-5)
    var y = Math.floor(Math.random() * (5 - (-5) + 1)) + (-5)
    var z = Math.floor(Math.random() * (5 - (-5) + 1)) + (-5)
    stars[i] = [x, y, z]
  }
  return stars
}

const stars = createStars().map((cords, i) =>
  (<Star key={i} position={cords} color='white' />)
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


