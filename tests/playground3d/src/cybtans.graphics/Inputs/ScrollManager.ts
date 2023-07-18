

export class ScrollManager {
    top = 0;
    percent = 0;
    movement = 0;
    height = 0;
    el?: HTMLElement;
    lastTop = 0;

    constructor(el?: HTMLElement) {
        this.onScroll = this.onScroll.bind(this);
        this.setTarget(el);
    }

    setTarget(el?: HTMLElement) {
        if (this.el) {
            this.el.removeEventListener('scroll', this.onScroll);
        }

        if (el) {
            el.addEventListener('scroll', this.onScroll);
            this.el = el;
            this.height = el.scrollHeight;
            this.top = el.scrollTop;
        } else if (document.scrollingElement) {
            window.addEventListener('scroll', this.onScroll);
            this.top = document.scrollingElement.scrollTop;
            this.height = document.scrollingElement.scrollHeight;
        }
        this.movement = 0;
        this.lastTop = this.top;

        this.percent = this.top / this.height;
    }

    onScroll() {
        if (this.el) {
            this.top = this.el.scrollTop;
            this.height = this.el.scrollHeight;
        } else if (document.scrollingElement) {
            this.top = document.scrollingElement.scrollTop;
            this.height = document.scrollingElement.scrollHeight;
        }

        this.percent = this.top / this.height;
    }

    update(dt: number) {
        this.movement = this.top - this.lastTop;
        this.lastTop = this.top;
    }
}
