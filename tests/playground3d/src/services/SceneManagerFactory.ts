import { SceneDefinition } from "src/models/SceneDefinition";
import SceneManager  from "../cybtans.graphics/SceneManager";
import { SkyBox } from "src/cybtans.graphics/Frame/SkyBox";
import Scene from "src/cybtans.graphics/Scene";
import { FpsCameraController } from "src/cybtans.graphics/Behaviors/FPSCameraController";
import { CameraComponent } from "src/cybtans.graphics/Frame/CameraComponent";
import { mat4, vec3 } from "gl-matrix";
import { float3 } from "src/cybtans.graphics/MathUtils";
import { BillboardComponent } from "src/cybtans.graphics/Frame/BillboardComponent";
import Frame from "src/cybtans.graphics/Frame/Frame";
import Texture from "src/cybtans.graphics/Textures";
import { defaultScene, planets } from "src/scenes/planets";

export class SceneManagerController {    
    
    sceneManager?: SceneManager|null;
    scenes: { [id:string]: SceneDefinition };

    constructor(scenes:{ [id:string]: SceneDefinition }, currentSceneId:string){   
        this.scenes = scenes;    
        this.currentSceneId = currentSceneId;   
    }

    currentSceneId?: string;    
    gl?:WebGL2RenderingContext;

    get currentScene(){
        if(!this.currentSceneId) return null;
        return this.scenes[this.currentSceneId];
    }

    create(gl:WebGL2RenderingContext,  canvas:HTMLCanvasElement){
        if(this.sceneManager != null && !this.sceneManager.IsDisposed){
            return this.sceneManager;
        }

        this.gl = gl;
        this.sceneManager = new SceneManager(gl, canvas);
        this.sceneManager.captureMouse(canvas);
        this.sceneManager.captureKeyboard(canvas);
        
        this.resizeCanvasToDisplaySize(canvas);
        return this.sceneManager;
    }

    resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
        // Lookup the size the browser is displaying the canvas in CSS pixels.
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        let rec = canvas.getBoundingClientRect()
    
        // Check if the canvas is not the same size.
        const needResize = canvas.width !== displayWidth ||
            canvas.height !== displayHeight;
    
        if (needResize) {
            // Make the canvas the same size
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }
    
        if(needResize)    {
            this.sceneManager?.onSizeChanged()
        }
        return needResize;
    }

    async loadScene(){
        if(!this.currentSceneId || !this.gl) 
            return;

        var sceneDef = this.currentScene
        if(!sceneDef)
            return;

        if(sceneDef.effectsUrl)    
            await this.sceneManager?.loadPrograms(sceneDef.effectsUrl);

        let scene = await this.sceneManager?.loadScene(sceneDef.sceneUrl, sceneDef.texturesBaseUrl);
        if(!scene){
            return;
        }

        if(sceneDef.sky){
            let skybox = await SkyBox.create(this.gl, sceneDef.sky.baseUrl, {
                positiveX: sceneDef.sky.faces.positiveX,
                negativeX: sceneDef.sky.faces.negativeX,
                positiveY: sceneDef.sky.faces.positiveY,
                negativeY: sceneDef.sky.faces.negativeY,
                positiveZ: sceneDef.sky.faces.positiveZ,
                negativeZ: sceneDef.sky.faces.negativeZ,
              });

            scene.renderables.push(skybox);
        }
         
        if(sceneDef.onLoad)
            sceneDef.onLoad(scene);

    }

    
}

const sceneManagerFactory = new SceneManagerController({
    ...planets
}, defaultScene);

export default sceneManagerFactory;