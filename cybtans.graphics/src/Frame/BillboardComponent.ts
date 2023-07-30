import { Billboard, BillboardManager } from "../Billboard";
import Scene from "../Scene";
import SceneManager from "../SceneManager";
import Frame from "./Frame";
import { RendereableComponent } from "./RendereableComponent";

export class BillboardComponent extends RendereableComponent {
    
    constructor(public billBoardManager:BillboardManager, public billboard:Billboard, frame:Frame){
            super(frame);
        }

    initialize(scene: Scene): void {
        scene.transparents.push(this);
        super.initialize(scene);
    }

    protected onRender(ctx: SceneManager): void {
       this.billBoardManager.render(ctx, this.billboard, this.frame);
    }

}