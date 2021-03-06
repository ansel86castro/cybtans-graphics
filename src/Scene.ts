import { AmbientLight } from "./AmbientLight";
import Camera from "./Camera";
import Frame, { FrameUpdateFunc } from "./Frame/Frame";
import { LightComponent } from "./Frame/LightComponent";
import { IRenderable } from "./Interfaces";
import Light from "./Light";
import Material from "./Material";
import Mesh from "./Mesh";
import { SceneDto, Uomtype } from "./models";
import SceneManager from "./SceneManager";
import MeshSkin from "./SkinMesh";
import SkinMesh from "./SkinMesh";
import Texture, { createTexture } from "./Textures";

export type UpdateFunc = (elapsed: number) => void;

export default class Scene implements IRenderable {

    manager: SceneManager;
    gl: WebGL2RenderingContext;
    id: string;
    name?: string | null;
    units: number;
    unitOfMeasure: Uomtype;
    root?: Frame;
    visible: boolean = true;
    //program sources
    ambient: AmbientLight;
    currentCamera?: Camera;
    currentLight?: LightComponent;
    renderables: IRenderable[] = [];

    cameras: Map<string, Camera> = new Map();
    lights: Light[] = [];
    lightsComponents: LightComponent[] = [];
    textures: Map<string, Texture> = new Map();
    materials: Map<string, Material> = new Map();
    meshes: Map<string, Mesh> = new Map();
    skins: Map<string, SkinMesh> = new Map();
    private updates: UpdateFunc[] = [];

    constructor(manager: SceneManager, id?: string, name?: string) {
        this.gl = manager.gl;
        this.manager = manager;
        this.id = id || '';
        this.name = name;
        this.units = 1;
        this.unitOfMeasure = Uomtype.meters;
        this.cameras = new Map();
        this.ambient = new AmbientLight();
    }

    loadData(data: SceneDto) {
        this.id = this.id || data.id;
        this.name = this.name || data.name;
        this.units = this.units || data.units;
        this.unitOfMeasure = this.unitOfMeasure || data.unitOfMeasure;
        let textures: Texture[] = [];

        if (!this.ambient && data.ambient) {
            this.ambient = new AmbientLight(data.ambient);
        }

        if (data.cameras) {
            this.cameras = this.cameras || new Map();
            data.cameras.forEach(dto => {
                let c = new Camera({ ...dto, width: this.manager.width, height: this.manager.height });
                c.registerForSizeChanged(this.manager);
                this.cameras?.set(c.id, c);
            });

            if (!this.currentCamera && data.currentCamera)
                this.currentCamera = this.cameras.get(data.currentCamera);
        }

        if (data.lights) {
            this.lights = this.lights || [];
            this.lights.push(...data.lights.map(l => new Light(l)));
        }

        if (data.textures) {
            data.textures.forEach(t => {
                let tex = createTexture(this.gl, t);
                textures.push(tex);
                this.textures?.set(t.id, tex);
            });
        }

        if (data.materials) {
            data.materials.forEach(m => this.materials?.set(m.id, new Material(this, m)));
        }

        if (data.meshes) {
            data.meshes.forEach(m => this.meshes?.set(m.id, new Mesh(this.gl, m)));
        }

        if (data.skins) {
            data.skins.forEach(m => this.skins?.set(m.id, new MeshSkin(this, m)));
        }

        if (!this.root && data.root) {
            this.root = new Frame(this, data.root);
            this.root.commitChanges();
            this.root.initialize(this);
        }
        else if (this.root && data.root) {
            let dataRoot = new Frame(this, data.root);
            dataRoot.commitChanges();
            dataRoot.initialize(this);

            this.root.addNode(dataRoot);
        }

        return textures;
    }

    getTextureById(id: any): Texture | undefined {
        return this.textures?.get(id);
    }

    async loadTextureFromUrl(baseUrl: string) {
        let promises: Promise<void>[] = [];
        try {
            if (this.textures) {
                for (let [, value] of this.textures) {
                    promises.push(value.load(baseUrl));
                }
            }

            await Promise.all(promises);

        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async loadFromUrl(url: string, textureBaseUrl?: string) {
        let options: RequestInit = { method: 'GET', headers: { Accept: 'application/json' } };
        var response = await fetch(url, options);
        let dto = await response.json();
        let textures = this.loadData(dto);

        if (textures && textureBaseUrl) {
            await Promise.all(textures.map(t => t.load(textureBaseUrl)));
        }
    }

    update(elapsed: number) {
        for (const item of this.updates) {
            item(elapsed);
        }
    }

    render(ctx: SceneManager) {
        if (this.currentCamera) {
            ctx.setSource(Camera.type, this.currentCamera);
        }

        if (this.currentLight) {
            ctx.setSource(LightComponent.type, this.currentLight);
            ctx.setSource(Light.type, this.currentLight.light);
        }

        ctx.setSource(AmbientLight.type, this.ambient);

        for (const item of this.renderables) {
            if (item.visible === true)
                item.render(ctx);
        }
    }

    addUpdate(func: UpdateFunc): () => void {
        this.updates.push(func);
        return () => {
            let idx = this.updates.indexOf(func);
            if (idx < 0) return;

            this.updates.splice(idx, 1);
        }
    }

    getNodeByName(name: string): Frame | null {
        if (!this.root) return null;
        return this.root.getNodeByName(name);
    }

    addNodeUpdate(name: string, func: FrameUpdateFunc) {
        if (this.root) {
            let node = this.root.getNodeByName(name);
            if (!node) return;

            this.addUpdate(elapsed => func(elapsed, node!));
        }
    }

    dispose() {
        for (let [, value] of this.textures) {
            value.dispose();
        }

        for (let [, mesh] of this.meshes) {
            mesh.dispose();
        }

        for (const [, skin] of this.skins) {
            skin.mesh?.dispose();
        }
    }
}