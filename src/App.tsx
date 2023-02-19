import { ReactElement, useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  IcosahedronGeometry,
  IUniform,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import "./App.css";

import vertexShader from "./shaders/vert.glsl";
import fragmentShader from "./shaders/frag.glsl";

import GSAP from "gsap";
import SmoothScroll from "./SmoothScroll";
import { Scroll } from "./types";
import { Section } from "./Components/Section";

const sections = ["Logma", "Naos", "Chara"];

function App(): ReactElement {
  const container = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current || !content.current) {
      return;
    }

    if (container.current.childNodes.length) {
      return;
    }

    let scrollstate = new ScrollState(container.current, content.current);

    return () => {
      scrollstate.dispose();
    };
  }, []);
  return (
    <>
      <div className="scroll__stage">
        <div ref={content} className="scroll__content">
          {sections.map((title, index) => (
            <Section section={title} index={index} />
          ))}
        </div>
        <div ref={container}></div>
      </div>
    </>
  );
}

interface ViewPort {
  width: number;
  height: number;
}

class ScrollState {
  private readonly _renderer: WebGLRenderer;
  private readonly _scene: Scene;
  private readonly _camera: PerspectiveCamera;
  private readonly _material: ShaderMaterial;
  private readonly _geometry: BufferGeometry;
  private readonly _mesh: Mesh<BufferGeometry, ShaderMaterial>;
  private readonly _smoothScroll: SmoothScroll;

  private _viewport: ViewPort;
  private _scroll: Scroll;
  private _settings: Settings;

  constructor(element: HTMLDivElement, content: HTMLDivElement) {
    this._renderer = new WebGLRenderer({
      antialias: true,
    });
    this._renderer.domElement.classList.add("webgl");
    element.appendChild(this._renderer.domElement);
    this._scene = new Scene();
    this._viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this._camera = new PerspectiveCamera(
      75,
      this._viewport.width / this._viewport.height,
      0.1,
      10
    );

    this._camera.position.set(0, 0, 2.5);

    this._geometry = new IcosahedronGeometry(1, 64);

    this._settings = makeDefaultSettings();

    this._material = new ShaderMaterial({
      wireframe: true,
      blending: AdditiveBlending,
      transparent: true,
      vertexShader,
      fragmentShader,
      uniforms: makeInitialUniforms(this._settings),
    });

    this._mesh = new Mesh(this._geometry, this._material);
    this._scene.add(this._mesh);
    this.addEventListeners();
    this._scroll = makeDefaultScroll();

    this._smoothScroll = new SmoothScroll({
      scroll: this._scroll,
      viewport: this._viewport,
      element,
      scrollContent: content,
    });

    this.onResize();
    this.update();
  }

  dispose() {
    this._geometry.dispose();
    this._material.dispose();
    this._renderer.dispose();
    this._renderer.domElement.childNodes.forEach((child) =>
      this._renderer.domElement.removeChild(child)
    );
  }

  /**
   * Events
   */

  addEventListeners() {
    window.addEventListener("resize", this.onResize);
    // window.addEventListener("mousemove", this.onMouseMove); // enable for soundcheck (→ console)
    window.addEventListener("scroll", this.onScroll);
  }

  onResize = () => {
    this._viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    // Testing to see if we have sotpped the annoying sound on pushing to gh
    this._camera.aspect = this._viewport.width / this._viewport.height;
    this._camera.updateProjectionMatrix();

    this._smoothScroll.onResize();

    if (this._viewport.width < this._viewport.height) {
      this._mesh.scale.set(0.75, 0.75, 0.75);
    } else {
      this._mesh.scale.set(1, 1, 1);
    }

    this._renderer.setSize(this._viewport.width, this._viewport.height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  };

  onMouseMove = (event: MouseEvent) => {
    const x = (event.clientX / this._viewport.width) * 4;
    const y = (event.clientY / this._viewport.height) * 2;

    GSAP.to(this._mesh.material.uniforms.uFrequency, { value: x });
    GSAP.to(this._mesh.material.uniforms.uAmplitude, { value: x });
    GSAP.to(this._mesh.material.uniforms.uDensity, { value: y });
    GSAP.to(this._mesh.material.uniforms.uStrength, { value: y });
    console.log(x, y);
  };

  onScroll = () => {
    if (!this._scroll.running) {
      this._scroll.running = true;
      window.requestAnimationFrame(this.updateScrollAnimations);
    }
  };

  /**
   * Rendering
   */
  render() {
    const { _scene, _camera } = this;
    this._renderer.render(_scene, _camera);
  }

  update = () => {
    this._mesh.rotation.y += 0.01;
    this._smoothScroll.update();
    this.render();
    requestAnimationFrame(this.update);
  };

  updateScrollAnimations = () => {
    this._scroll.normalized = this._scroll.hard / this._scroll.limit;
    GSAP.to(this._mesh.rotation, {
      x: this._scroll.normalized * Math.PI,
    });
    for (const key in this._settings) {
      /** @ts-ignore */
      const setting: Setting = this._settings[key];
      if (setting.start !== setting.end) {
        GSAP.to(this._mesh.material.uniforms[key], {
          value:
            setting.start +
            this._scroll.normalized * (setting.end - setting.start),
        });
      }
    }
    this._scroll.running = false;
  };
}

function makeDefaultScroll(): Scroll {
  return {
    height: 0,
    limit: 0,
    hard: 0,
    soft: 0,
    ease: 0.05,
    normalized: 0,
    running: false,
  };
}

interface Setting {
  start: number;
  end: number;
}
interface Settings {
  uFrequency: Setting;
  uAmplitude: Setting;
  uDensity: Setting;
  uStrength: Setting;
  uDeepPurple: Setting;
  uOpacity: Setting;
}

function makeInitialUniforms(settings: Settings) {
  const keys = Object.keys(settings);

  const uniforms: { [key: string]: IUniform<any> } = {};

  keys.forEach((key) => {
    /** @ts-ignore */
    uniforms[key] = { value: (settings[key] as Setting).start };
  });

  return uniforms;
}

function makeDefaultSettings(): Settings {
  return {
    uFrequency: {
      start: 0,
      end: 4,
    },
    uAmplitude: {
      start: 4,
      end: 4,
    },
    uDensity: {
      start: 1,
      end: 1,
    },
    uStrength: {
      start: 0,
      end: 1.1,
    },
    // fragment
    uDeepPurple: {
      // max 1
      start: 1,
      end: 0,
    },
    uOpacity: {
      // max 1
      start: 0.1,
      end: 0.66,
    },
  };
}

export default App;
