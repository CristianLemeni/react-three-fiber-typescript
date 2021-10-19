import React from 'react';
import { Canvas } from 'react-three-fiber';
import Controls from './components/Controls';
import Scene from './components/Scene';
import './App.css';
import { RoundedBox } from "@react-three/drei";


export default function App (){
  return(
    <Canvas>
    <Scene/>
    <Controls/>
    <RoundedBox args={[1, 1, 1]} radius={0.05} smoothness={4} onPointerEnter={undefined} onPointerLeave={undefined} onPointerMissed={undefined} onPointerCancel={undefined}></RoundedBox>
  </Canvas>
  )
}
