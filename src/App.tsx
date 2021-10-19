import React, { useState } from 'react';
import { Canvas } from 'react-three-fiber';
import Controls from './components/Controls';
import Scene from './components/Scene';
import './App.css';

// function Plane({ position }: any) {



export default function App (){
  const [showPlane, set] = useState(true)
  return(
    <Canvas>
    <Scene/>
    <Controls/>
  </Canvas>
  )
}
