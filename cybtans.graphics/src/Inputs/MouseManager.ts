import { IInputManager } from "./IInputManager";


export class MouseManager implements IInputManager {
    down = false;
    /** 0 : Left mouse button
     *  1 : Wheel button or middle button (if present)
     *  2 : Right mouse button
     */
    mouseButton = -1;
    x = 0;
    y = 0;

    dx = 0;
    dy = 0;

    private clientX = 0;
    private clientY = 0;

    constructor(private el: HTMLElement) {
        el.addEventListener('mousedown', this.onMouseDown, true);
        el.addEventListener('mouseup', this.onMouseUp, true);
        el.addEventListener('mousemove', this.onMouseMove, true);
        el.addEventListener('mouseenter', this.onMouseEnter, true);
        el.addEventListener('mouseleave', this.onMouseLeave, true);
    }
  

    onMouseDown = (ev: MouseEvent) => {
        this.down = true;
        this.mouseButton = ev.button;
    };

    onMouseUp = (ev: MouseEvent) => {
        this.down = false;
        this.mouseButton = -1;
    };

    onMouseMove = (ev: MouseEvent) => {
        this.x = ev.clientX;
        this.y = ev.clientY;
    };

    onMouseEnter = (ev: MouseEvent) => {
        this.x = ev.clientX;
        this.y = ev.clientY;
        this.clientX = this.x;
        this.clientY = this.y;
        this.mouseButton = ev.button || -1;
    };

    onMouseLeave = (ev: MouseEvent) => {
        this.mouseButton = -1;
        this.x = 0;
        this.y = 0;
        this.clientX = 0;
        this.clientY = 0;
    };

    update(dt: number) {
        this.dx = this.clientX - this.x;
        this.dy = this.clientY - this.y;

        this.clientX = this.x;
        this.clientY = this.y;
    }

    dispose(): void {
        this.el.removeEventListener('mousedown', this.onMouseDown);
        this.el.removeEventListener('mouseup', this.onMouseUp);
        this.el.removeEventListener('mousemove', this.onMouseMove);
        this.el.removeEventListener('mouseenter', this.onMouseEnter);
        this.el.removeEventListener('mouseleave', this.onMouseLeave);
    }
}
