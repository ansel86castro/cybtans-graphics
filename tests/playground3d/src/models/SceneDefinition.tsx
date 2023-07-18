import { CubeMapDto } from "cybtans";
import Scene from "src/cybtans.graphics/Scene";

export interface SceneDefinition{
    id: string;
    effectsUrl:string;
    sceneUrl:string;   
    sky: SkyBoxDefinition;
    texturesBaseUrl: string;
    onLoad?: (scene:Scene)=>void;
}

export interface SkyBoxDefinition{
  baseUrl: string;
  faces:CubeMapDto    
}