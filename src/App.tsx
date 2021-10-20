import React from 'react';
import { Canvas } from 'react-three-fiber';
import Controls from './components/Controls';
import Scene from './components/Scene';
import './App.css';

//main app that holds all components
export default function App (){
  return(
    <Canvas>
    <Scene/>
    <Controls/>
  </Canvas>
  )
}
