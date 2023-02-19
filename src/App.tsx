import { ReactElement, useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  IcosahedronGeometry,
  Material,
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

console.log(vertexShader);

const sections = ["Logma", "Naos", "Chara"];

function App(): ReactElement {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) {
      return;
    }

    if (container.current.childNodes.length) {
      return;
    }

    let scrollstate = new ScrollState(container.current);

    return () => {
      scrollstate.dispose();
    };
  }, []);
  return (
    <>
      <div className="scroll__stage">
        <div className="scroll__content">
          {sections.map((title, index) => (
            <Section section={title} index={index} />
          ))}
        </div>
        <div ref={container}></div>
      </div>
    </>
  );
}

interface SectionProps {
  section: string;
  index: number;
}

function Section({ section, index }: SectionProps): ReactElement<SectionProps> {
  return (
    <>
      <div className="section section__title">
        <h1 className="section__title-number">{index}</h1>
        <h2 className="section__title-title">{section}</h2>
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
  private _viewport: ViewPort;
  private _material: ShaderMaterial;
  private _geometry: BufferGeometry;
  private _mesh: Mesh<BufferGeometry, ShaderMaterial>;

  constructor(element: HTMLDivElement) {
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

    this._geometry = new IcosahedronGeometry(1, 16);

    this._material = new ShaderMaterial({
      wireframe: true,
      blending: AdditiveBlending,
      transparent: true,
      vertexShader,
      fragmentShader,
      uniforms: {
        uFrequency: { value: 0 },
        uAmplitude: { value: 0 },
        uDensity: { value: 0 },
        uStrength: { value: 0.2 },
        uDeepPurple: { value: 0.2 },
        uOpacity: { value: 1 },
      },
    });

    // this._material = new MeshNormalMaterial({
    //   // color: 0xff00ff,
    //   wireframe: true,
    // });
    this._mesh = new Mesh(this._geometry, this._material);
    this._scene.add(this._mesh);
    this.addEventListeners();
    this.update();
  }

  dispose() {
    this._scene.children.forEach((child) => {});
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
    window.addEventListener("mousemove", this.onMouseMove); // enable for soundcheck (→ console)
  }

  onResize = () => {
    this._viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this._camera.aspect = this._viewport.width / this._viewport.height;
    this._camera.updateProjectionMatrix();

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

  /**
   * Rendering
   */
  render() {
    const { _scene, _camera } = this;
    this._renderer.render(_scene, _camera);
  }

  update = () => {
    this.render();
    requestAnimationFrame(this.update);
  };
}

export default App;
