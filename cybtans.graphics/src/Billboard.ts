import { mat4, vec3, vec4 } from "gl-matrix";
import Texture, { Texture2D, createTexture } from "./Textures";
import { float3, float4, matrix } from "./MathUtils";
import { VertexBuffer } from "./Buffer";
import { VertexDefinitions } from "./MeshShapes/Vertex";
import Scene from "./Scene";
import SceneManager from "./SceneManager";
import { checkError } from "./utils";
import Frame from "./Frame/Frame";
import { BillboardComponent } from "./Frame/BillboardComponent";
import { TextureType } from "./models";

export interface Billboard {
    texture?: Texture2D;
    color: vec4;
}

interface BillboardOptions{
    position?: vec3;
    scale?:vec3;
    node?:string|Frame;  
}

export class BillboardManager {
    static readonly Billboard = 'Billboard';
    static readonly type = 'BillboardManager';

        /// P0----P1
        /// |   / |
        /// | /   |
        /// P3----P2
    static vertices = new Float32Array([
        -0.5, 0.5,  0, 0, 0, //P0
        0.5 , 0.5,  0, 1, 0, //P1
        -0.5, -0.5, 0, 0, 1, //P3
        0.5,  -0.5, 0, 1, 1  //P2
    ]);

    private _vertexBuffer? :VertexBuffer;

    w = float3();
    u = float3();
    billboardMtx: mat4 = matrix();    

    constructor(public scene:Scene){        
    }

    private createBillboardComponent(frame: Frame, billboard:Partial<Billboard>){
        let b = billboard;
        if(!b.color){
            b.color = float4([1,1,1,1]);
        }

        let component = new BillboardComponent(this, b as Billboard, frame);
        return component;
    }

    create(name:string, textureUrl:string, options?:BillboardOptions):{frame:Frame, texture:Texture}{
        let frame = this.scene.addFrame(name);
        let texture = this.scene.createTexture({ filename :textureUrl,type : TextureType.texture2d, id:'', format:Texture.FORMAT_RGBA });        
        frame.component = this.createBillboardComponent(frame, {texture: texture});
        frame.initialize();
        if(options){
            if(options.scale){
                frame.scale(options.scale[0],options.scale[1],options.scale[2]);
            }
            if(options.position){
                frame.position = options.position;
            }
            if(typeof options.node === 'string'){
                let node = this.scene.getNodeByName(options.node);                
                if(node){
                    frame.position = node.worldPosition;
                }
            }else if(options.node){
                frame.position = options.node.worldPosition;
            }

            
        }
        frame.commitChanges(true);

        return {
            frame,
            texture
        };
    }
    

    getBillboardMatrix(outMat: mat4, camPosition: vec3, camUp: vec3, position: vec3){        
        vec3.sub(this.w, camPosition, position);
        vec3.normalize(this.w, this.w);
        let v = camUp;
        vec3.normalize(v,v);
        vec3.cross(this.u, v, this.w );
        vec3.normalize(this.u, this.u);
        
        outMat[0] = this.u[0];
        outMat[1] = this.u[1];
        outMat[2] = this.u[2];
        outMat[3] = 0;

        outMat[4] = v[0];
        outMat[5] = v[1];
        outMat[6] = v[2];
        outMat[7] = 0;

        outMat[8] = this.w[0];
        outMat[9] = this.w[1];
        outMat[10] = this.w[2];
        outMat[11] = 0;

        // outMat[12] = position[0];
        // outMat[13] = position[1];
        // outMat[14] = position[2];
        
        outMat[12] = 0;
        outMat[13] = 0;
        outMat[14] = 0;    
        outMat[15] = 1;
    }

    getVertexBuffer(): VertexBuffer{
        if(!this._vertexBuffer){
            this._vertexBuffer = new VertexBuffer(this.scene.gl, VertexDefinitions.PTVertex);
            this._vertexBuffer.setData(BillboardManager.vertices.buffer);
        }
        return this._vertexBuffer;
    }

    render(ctx: SceneManager, billboard:Billboard, frame:Frame) {
        const cam = this.scene.currentCamera;
        if(!cam) return;
        
        this.getBillboardMatrix(this.billboardMtx, cam.position, cam.up, frame.worldPosition);

        ctx.setSource(BillboardManager.Billboard, billboard);
        ctx.setSource(BillboardManager.type, this);

        const program = ctx.getProgramByType(BillboardManager.Billboard);
        if(!program) return;

        program.useProgram(ctx);
        const vb = this.getVertexBuffer();
        vb.setVertexBuffer(program);

        program.bindSource(BillboardManager.Billboard, ctx);
        program.bindSource(BillboardManager.type, ctx);

        const gl = this.scene.gl;
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        checkError(gl);
        program.clearSamplers(BillboardManager.type);
    }
}