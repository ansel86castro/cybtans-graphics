import { vec3 } from "gl-matrix";
import { float3, toRadians, transformNormal } from "../MathUtils";
import Scene from "../Scene";
import { Behavior } from "./Behavior";
import Frame from "../Frame/Frame";

const INITIAL_ANGULAR_SPEED = 0.05;  
const INITIAL_LINEAR_SPEED = 0;  

export class FpsCameraController extends Behavior {

    angularSpeed = INITIAL_ANGULAR_SPEED;
    maxAngularSpeed = toRadians(2.5);
    angularAcce = toRadians(1);

    maxLinearSpeed = 5;  
    linearSpeed = INITIAL_LINEAR_SPEED;
    LinearAcc = 0.33;        
    moveDir = float3();
    transformedDir =float3();    

    constructor(frame:Frame) {
        super(frame);

    }

    update(dt: number) {
        vec3.zero(this.moveDir);

        let mouse = this.sceneManager.mouse;
        if(!mouse)
            return;

        if (mouse.down && mouse.mouseButton == 0) {            
            let dx = mouse.dx;
            let dy = mouse.dy;

            this.angularSpeed += Math.min(this.maxAngularSpeed, this.angularAcce * dt);            
            this.frame.yaw += dt* this.angularSpeed * dx;
            this.frame.pitch += dt* this.angularSpeed * dy;                        
        }else if(!mouse.down){
            this.angularSpeed =INITIAL_ANGULAR_SPEED;
        }

        this.getMoveDir();        
        if(this.moveDir[0] == 0 && this.moveDir[1] == 0 && this.moveDir[2] == 0){
            this.linearSpeed = INITIAL_LINEAR_SPEED
        }else{
            this.linearSpeed += Math.min(this.maxLinearSpeed, this.LinearAcc * dt);
        }

        vec3.scale(this.moveDir, this.moveDir, this.linearSpeed);
        transformNormal(this.transformedDir, this.moveDir, this.frame.localRotation);

        this.frame.move(this.transformedDir);
        this.frame.commitChanges(true);
    }

    getMoveDir(){
        let kb = this.sceneManager.keyBoard;
        if(!kb)
            return;
        if(kb.isPressed('w')){
            this.moveDir[2] = -1;
        }
        if(kb.isPressed('s')){
            this.moveDir[2] = 1;
        }
        if(kb.isPressed('d')){
            this.moveDir[0] = 1;
        }
        if(kb.isPressed('a')){
            this.moveDir[0] = -1;
        }
        if(kb.isPressed('q')){
            this.moveDir[1] = 1;
        }
        if(kb.isPressed('e')){
            this.moveDir[1] = -1;
        }
    }
}