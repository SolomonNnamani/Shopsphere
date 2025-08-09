import React, {useRef, useEffect} from 'react';
import {gsap} from "gsap"
import { GiBowTie } from "react-icons/gi";


const AnimatedLogo = ({className=""}) => {
    const spinRef = useRef(null);

    useEffect(()=> {
    const ctx  = gsap.to(spinRef.current, {
      rotation: 360,
      duration: 1,
      repeat: -1,
      ease: "linear", 
      transformOrigin: "50% 50%", // ensure it rotates around center
    });

    return ()=> ctx.revert()
    },[])


  return (
    <div ref={spinRef} className={`text-center  ${className}`}><GiBowTie/></div>
  )
}

export default AnimatedLogo