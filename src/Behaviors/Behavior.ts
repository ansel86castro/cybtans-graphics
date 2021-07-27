import EventEmitter from "../Events";
import Frame from "../Frame/Frame";
import Scene from "../Scene";
import SceneManager from "../SceneManager";

export class Behavior {
    frame: Frame;
    scene: Scene;
    name?: string;
    sceneManager: SceneManager;
    protected onUpdate: EventEmitter<Behavior, number>;

    constructor(scene: Scene, name: string | Frame) {
        if (typeof name === 'string') {
            let node = scene.getNodeByName(name);
            if (!node) throw new Error(`node ${name} found`);
            this.frame = node;
            this.name = name;
        } else {
            this.frame = name;
            this.name = this.frame.name || '';
        }

        this.scene = scene;
        this.sceneManager = scene.manager;
        this.update = this.update.bind(this);

        this.onUpdate = new EventEmitter();

        scene.addUpdate(this.update);
    }

    update(elapsed: number) {
        this.onUpdate.raiseEvent(this, elapsed);
    }
}