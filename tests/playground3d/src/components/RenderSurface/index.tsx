import React, { useEffect, useMemo, useState } from "react";
import { SceneDefinition } from "../../models/SceneDefinition";
import SceneManager from "../../cybtans.graphics/SceneManager"
import sceneManagerFactory from '../../services/SceneManagerFactory'
import styles from "./index.module.scss"

interface RenderSurfaceProps {
 sceneDefinition:SceneDefinition;
}

export default function RenderSurface(){
    let ref = React.createRef<HTMLCanvasElement>()
    let [invalidated, setInvalidated] = useState(true);

    let sceneManager  = sceneManagerFactory.sceneManager;
    
    let onResized = ()=>{
        if(ref.current){
            sceneManagerFactory.resizeCanvasToDisplaySize(ref.current);         
        }
    }

    useEffect(()=> {
        if(!ref.current) 
            return;    

        let canvas = ref.current;             
        let gl = canvas.getContext('webgl2');
        if(gl == null) 
            return;

        sceneManager = sceneManagerFactory.create(gl, canvas);
        sceneManagerFactory.loadScene();

        sceneManager.start()
        window.addEventListener('resize', onResized);
        return ()=>{
            window.removeEventListener('resize',onResized)
            sceneManager?.dispose();
        }
    },[]);

    useEffect(()=>{
        if(invalidated){           
            setInvalidated(false);
        }
    },[invalidated])

    return (
        <div className={styles.renderSurface}>
            <canvas ref={ref} tabIndex={1} ></canvas>
        </div>
    )
}


