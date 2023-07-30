import { mat4, vec3 } from "gl-matrix";
import { Behavior } from "./Behavior";
import Frame from "../Frame/Frame";
import { MeshComponent } from "../Frame/MeshComponent";
import { RendereableComponent } from "../Frame/RendereableComponent";
import { toRadians, float3, float3L, matrix, Zero } from "../MathUtils";
import Scene from "../Scene";


interface PlanetOptions {
    rotationSpeed: number;
    inclination: number;
    atmosphere: vec3
    translationSpeed: number
    halo?: {tex:string, scale: number};
}


export class Planet extends Behavior {
    static readonly type = 'Planet';
    
    m = mat4.create();
    atmosphere: vec3;
    rotMat:mat4 = matrix();
    options: PlanetOptions;
    billboard?:Frame;

    constructor(frame: Frame, options:Partial<PlanetOptions> ) {
        super(frame);        

        this.options =  { 
            rotationSpeed: toRadians(5),
            inclination: 0,
            atmosphere: Zero,
            translationSpeed: 0,
            ...options
        };

        this.atmosphere = this.options.atmosphere;

        if (this.frame.component instanceof RendereableComponent) {
            let meshComponent = this.frame.component as MeshComponent;
            meshComponent.materials[0].specularPower = 8;
            meshComponent.materials[0].specular = float3L(0.25) ;            

            this.frame.component.onRenderBegin = (ctx) => {
                ctx.setSource(Planet.type, this);
            };
        }

        if(this.options.halo){
           let res = this.scene.billboards.create(`${frame.name}-halo`, this.options.halo.tex,{
                scale : float3L(this.options.halo.scale),
                node:  frame
           });
           this.billboard = res.frame;
           res.texture.load();
        }
    }

    update(dt: number) {
        this.frame.roll = this.options.inclination;
        this.frame.yaw += this.options.rotationSpeed * dt;
        
        let pos = this.frame.position;        
        vec3.rotateY(pos, pos, Zero,  this.options.translationSpeed * dt);
        this.frame.position = pos;        
        this.frame.commitChanges(true);

        if(this.billboard){
            this.billboard.position = pos;
            this.billboard.commitChanges(true);
        }
    }
}