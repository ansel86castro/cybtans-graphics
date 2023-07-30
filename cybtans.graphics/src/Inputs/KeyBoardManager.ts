import { IInputManager } from "./IInputManager";

enum ButtonState {
    Up = 0,
    Press = 1,
    Down = 2
}

export class KeyBoardManager implements IInputManager {
    keys : { [key:string]: ButtonState} = {};

    constructor(private el: HTMLElement){
        el.addEventListener('keydown', this.onKeyDown);
        el.addEventListener('keyup', this.onKeyUp);
    }
   
    isPressed(key: string){
        return this.keys[key] == ButtonState.Down;
    }

    isReleased(key: string){
        return this.keys[key] == ButtonState.Up;
    }

    private onKeyDown = (ev:KeyboardEvent)=>{
        this.keys[ev.key] = ButtonState.Down
    }

    private onKeyUp = (ev:KeyboardEvent)=>{
        this.keys[ev.key] = ButtonState.Up
    }

    update(elapsed: number): void {
        
    }

    dispose(){
        this.el.removeEventListener('keydown', this.onKeyDown);
        this.el.removeEventListener('keyup', this.onKeyUp);
    }
}