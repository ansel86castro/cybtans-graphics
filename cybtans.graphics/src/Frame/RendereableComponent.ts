import { IRenderable } from "../Interfaces";
import SceneManager from "../SceneManager";
import { FrameComponent } from "./FrameComponent";
import Frame from "./Frame";
import { vec3 } from "gl-matrix";

export type RenderCallback = (ctx: SceneManager) => void;

export abstract class RendereableComponent extends FrameComponent implements IRenderable {
    distance = 0;
    visible: boolean = true;    
    onRenderBegin?: RenderCallback;
    onRenderEnd?: RenderCallback;

    constructor(frame: Frame) {
        super(frame);
    }

    render(ctx: SceneManager) {
        ctx.setSource('Frame', this.frame);

        if (this.onRenderBegin) {
            this.onRenderBegin(ctx);
        }

        this.onRender(ctx);

        if (this.onRenderEnd) {
            this.onRenderEnd(ctx);
        }
    }

    calculateDistance(camPos: vec3) {
        this.distance = vec3.distance(this.frame.worldPosition, this.frame.worldPosition);
    }

    protected abstract onRender(ctx: SceneManager): void;
}
