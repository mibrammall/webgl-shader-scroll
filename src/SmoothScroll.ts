import GSAP from "gsap";
import { Scroll, ViewPort } from "./types";

interface SmoothScrollProps {
  element: HTMLElement;
  scroll: any;
  scrollContent: any;
  viewport: ViewPort;
}

export default class {
  _element: HTMLElement;
  _viewport: ViewPort;
  _scroll: Scroll;
  _scrollContent: any;

  constructor({ element, viewport, scroll, scrollContent }: SmoothScrollProps) {
    this._element = element;
    this._viewport = viewport;
    this._scroll = scroll;
    this._scrollContent = scrollContent;
  }

  setSizes() {
    this._scroll.height = this._scrollContent.getBoundingClientRect().height;
    this._scroll.limit =
      this._scrollContent.clientHeight - this._viewport.height;
    document.body.style.height = `${this._scroll.height}px`;
  }

  update() {
    this._scroll.hard = window.scrollY;
    this._scroll.hard = GSAP.utils.clamp(
      0,
      this._scroll.limit,
      this._scroll.hard
    );
    this._scroll.soft = GSAP.utils.interpolate(
      this._scroll.soft,
      this._scroll.hard,
      this._scroll.ease
    );

    if (this._scroll.soft < 0.01) {
      this._scroll.soft = 0;
    }

    // this._scrollContent.style.transform = `translateY(${-this._scroll.soft}px)`;
  }

  onResize() {
    this._viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.setSizes();
  }
}
