import React from 'react';
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber'
import { Instances, Instance } from '@react-three/drei'
import { MeshBasicMaterial, Color, MathUtils, Mesh } from 'three';


const color = new Color()
const randomVector = (r: number) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r, r / 2 - Math.random() * r]
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
const randomData = Array.from({ length: 1000 }, () => ({ random: Math.random(), position: randomVector(10), rotation: randomEuler() }))




const Sphere: React.FC = () => (
  //@ts-ignore
  <Instances
    limit={1000} // Optional: max amount of items (for calculating buffer size)
    range={1000} // Optional: draw-range
  >
    <boxGeometry />
    <meshStandardMaterial />
  </Instances>
);

export default Sphere;
