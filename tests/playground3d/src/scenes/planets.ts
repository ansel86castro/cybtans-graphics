


import { mat4 } from "gl-matrix";
import { FpsCameraController } from "src/cybtans.graphics/Behaviors/FPSCameraController";
import { Planet } from "src/cybtans.graphics/Behaviors/Planet";
import { CameraComponent } from "src/cybtans.graphics/Frame/CameraComponent";
import { Zero, float3, float3L, toRadians } from "src/cybtans.graphics/MathUtils";
import Scene from "src/cybtans.graphics/Scene";
import { SceneDefinition } from "src/models/SceneDefinition";

export const planets: { [id: string]: SceneDefinition } = {
    ['planets1']: {
        effectsUrl: '/assets/effects.json',
        id: 'planets1',
        sceneUrl: '/assets/solar_system.scene.json',
        texturesBaseUrl: '/assets/planets1',
        sky: {
            baseUrl: '/assets/skyboxes/blue',
            faces: {
                positiveX: 'bkg1_right.png',
                negativeX: 'bkg1_left.png',
                positiveY: 'bkg1_bot.png',
                negativeY: 'bkg1_top.png',
                positiveZ: 'bkg1_front.png',
                negativeZ: 'bkg1_back.png',
            }
        },
        onLoad(scene: Scene) {
            scene.addBehavior(new FpsCameraController(scene.getNodeByName('Camera')!));
            let cameraNode = scene.getNodeByName('Camera')!;
            let cameraComponent = (cameraNode.component as CameraComponent);
            mat4.identity(cameraComponent.camera.localMtx);

            cameraNode.position = float3([0, 30, 60]);
            cameraNode.lookAt(float3([0, 0, 0]));
            cameraNode.commitChanges(true);

            //flares                                 
           let { frame, texture} = scene.billboards.create('b1', '/assets/billboards/flare4.png', {
                scale: float3L(45),
                position: float3([0, 0, 0])
            });
            texture.load();

            scene.addBehavior(new Planet(scene.getNodeByName('Earth')!, {
                rotationSpeed: toRadians(10),
                translationSpeed: toRadians(1),
                halo: {
                    tex: '/assets/billboards/shield_Edit.png',
                    scale: 4.3
                }
            }));
            scene.addBehavior(new Planet(scene.getNodeByName('Mars')!, {
                translationSpeed: toRadians(2),
                rotationSpeed: toRadians(5), atmosphere: float3([237 / 255, 28 / 255, 24 / 255]), halo: {
                    tex: '/assets/billboards/p4.png',
                    scale: 1.9
                }
            }));
            scene.addBehavior(new Planet(scene.getNodeByName('Venus')!, {
                translationSpeed: toRadians(2.5),
                rotationSpeed: toRadians(5), atmosphere: float3([255 / 255, 255 / 255, 171 / 255]), halo: {
                    tex: '/assets/billboards/shieldWhite_Edit.png',
                    scale: 2.3
                }
            }));
            scene.addBehavior(new Planet(scene.getNodeByName('Mercury')!, { rotationSpeed: toRadians(5), atmosphere: float3([255 / 255, 153 / 255, 153 / 255]), 
                translationSpeed: toRadians(7) }));
            scene.addBehavior(new Planet(scene.getNodeByName('Jupiter')!, {
                rotationSpeed: toRadians(5), atmosphere: float3([188 / 255, 167 / 255, 141 / 255]), 
                translationSpeed: toRadians(4),
                halo: {
                    tex: '/assets/billboards/p2.png',
                    scale: 13.6
                }
            }));
            scene.addBehavior(new Planet(scene.getNodeByName('Uranus')!, { rotationSpeed: toRadians(5), atmosphere: float3([188 / 255, 167 / 255, 141 / 255]), translationSpeed: toRadians(2), }));
            scene.addBehavior(new Planet(scene.getNodeByName('Saturn')!, { rotationSpeed: toRadians(5), atmosphere: float3([188 / 255, 167 / 255, 141 / 255]) }));

        }
    }
}

export const defaultScene = 'planets1';
