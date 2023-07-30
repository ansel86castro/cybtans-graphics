import EventEmitter from "../Events";
import Frame from "../Frame/Frame";
import Scene from "../Scene";
import SceneManager from "../SceneManager";

export class Behavior {
    frame: Frame;    
    name?: string;    
    protected onUpdate: EventEmitter<Behavior, number>;

    constructor(frame:Frame) {    
        this.frame = frame;        

        this.update = this.update.bind(this);
        this.onUpdate = new EventEmitter();        
    }

    update(elapsed: number) {
        this.onUpdate.raiseEvent(this, elapsed);
    }

    get scene(){ return this.frame.scene;}
    get sceneManager() { return this.frame.scene.manager;}
    
}