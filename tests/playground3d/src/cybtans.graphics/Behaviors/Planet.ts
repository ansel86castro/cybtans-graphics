import { mat4, vec3 } from "gl-matrix";
import { Behavior } from "./Behavior";
import Frame from "../Frame/Frame";
import { MeshComponent } from "../Frame/MeshComponent";
import { RendereableComponent } from "../Frame/RendereableComponent";
import { toRadians, float3, float3L } from "../MathUtils";
import Scene from "../Scene";

export class Planet extends Behavior {
    static readonly type = 'Planet';

    rotationSpeed: number;
    inclinationRad: number = 0;
    m = mat4.create();
    atmosphere: vec3;

    constructor(scene: Scene, name: string | Frame, rotationSpeed?: number, inclination?: number, atmosphere?: vec3) {
        super(scene, name);

        this.rotationSpeed = rotationSpeed || toRadians(5);
        this.inclinationRad = inclination || 0;
        this.atmosphere = atmosphere || float3();

        if (this.frame.component instanceof RendereableComponent) {
            let meshComponent = this.frame.component as MeshComponent;
            meshComponent.materials[0].specularPower = 8;
            meshComponent.materials[0].specular = float3L(0.25) ;            

            this.frame.component.onRenderBegin = (ctx) => {
                ctx.setSource(Planet.type, this);
            };
        }
    }

    update(dt: number) {
        this.frame.roll = this.inclinationRad;
        this.frame.yaw += this.rotationSpeed * dt;

        this.frame.commitChanges(true);
    }
}