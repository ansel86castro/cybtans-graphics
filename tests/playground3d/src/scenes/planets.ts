


import { mat4 } from "gl-matrix";
import { FpsCameraController } from "src/cybtans.graphics/Behaviors/FPSCameraController";
import { Planet } from "src/cybtans.graphics/Behaviors/Planet";
import { CameraComponent } from "src/cybtans.graphics/Frame/CameraComponent";
import { float3, float3L, toRadians } from "src/cybtans.graphics/MathUtils";
import Scene from "src/cybtans.graphics/Scene";
import { SceneDefinition } from "src/models/SceneDefinition";

export const planets:{[id:string]:SceneDefinition} = {
    ['planets1']:{
        effectsUrl:'/assets/effects.json',
        id:'planets1',
        sceneUrl:'/assets/solar_system.scene.json',
        texturesBaseUrl:'/assets/planets1',
        sky:{
           baseUrl:'/assets/skyboxes/blue',
           faces:{
               positiveX: 'bkg1_right.png',
               negativeX: 'bkg1_left.png',
               positiveY: 'bkg1_bot.png',
               negativeY: 'bkg1_top.png',
               positiveZ: 'bkg1_front.png',
               negativeZ: 'bkg1_back.png',
           }
        },
        onLoad(scene:Scene){            
           let fpsCamera = new FpsCameraController(scene, 'Camera')
           let cameraNode = scene.getNodeByName('Camera')!;            
           let cameraComponent = (cameraNode.component as CameraComponent);
           mat4.identity(cameraComponent.camera.localMtx);

           cameraNode.position = float3([0,30,60]);
           cameraNode.lookAt(float3([0,0,0]));
           cameraNode.commitChanges(true);
                      
         
            let planets = [];
            planets.push(new Planet(scene, 'Earth', toRadians(5)));                
            planets.push(new Planet(scene, 'Mars', toRadians(5), 0, float3([237 / 255, 28 / 255, 24 / 255])));
            planets.push(new Planet(scene, 'Venus', toRadians(2), 0, float3([255 / 255, 255 / 255, 171 / 255])));
            planets.push(new Planet(scene, 'Mercury', toRadians(0.1), 0, float3([255 / 255, 153 / 255, 153 / 255])));
            planets.push(new Planet(scene, 'Jupiter', toRadians(10), 0, float3([188 / 255, 167 / 255, 141 / 255])));
            planets.push(new Planet(scene, 'Uranus', toRadians(10), 0, float3([188 / 255, 167 / 255, 141 / 255])));
            planets.push(new Planet(scene, 'Saturn', toRadians(10), 0, float3([188 / 255, 167 / 255, 141 / 255])));

            //flares
            scene.billboards.createComponentAsync('b1','/assets/billboards/flare4.png',{ 
                scale: float3L(62), 
                position: float3([0, 0, 0]) });            

           
            scene.billboards.createComponentAsync('b3','/assets/billboards/shield_Edit.png',{
                scale : float3L(4.3),
                node:  'Earth'
           });
            scene.billboards.createComponentAsync('b4','/assets/billboards/shieldWhite_Edit.png', { 
                scale : float3L(2.3),
                node:  'Venus'
            });        
            scene.billboards.createComponentAsync('b5','/assets/billboards/p4.png', { 
                scale : float3L(1.9),
                node:  'Mars'
            });         
            scene.billboards.createComponentAsync('b6','/assets/billboards/p2.png', { 
                scale : float3L(13.6),
                node:  'Jupiter'
            });   
        }
    }
}

export const defaultScene = 'planets1';
