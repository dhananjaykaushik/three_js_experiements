import { Component, OnInit } from '@angular/core';
import { GUI } from 'dat-gui';
import { fromEvent } from 'rxjs';
import {
  AxesHelper,
  BoxBufferGeometry,
  FontLoader,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  TextBufferGeometry,
  TextureLoader,
  TorusBufferGeometry,
  WebGLRenderer,
} from 'three';
// import * as typefaceFont from 'three/examples/fonts/helvetiker_bold.typeface.json';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  ngOnInit() {
    /**
     * Camera
     */
    const camera = new PerspectiveCamera(75, this.aspect, 0.1, 100);
    camera.position.z = 4;

    /**
     * Scene
     */
    const scene = new Scene();

    /**
     * Renderer
     */
    const renderer = new WebGLRenderer({
      canvas: document.querySelector('.webgl') as HTMLCanvasElement,
    });
    renderer.setSize(this.width, this.height);

    /**
     * Loading Textures
     */
    const textureLoader = new TextureLoader();
    const matCapTexture = textureLoader.load('../assets/matcaps/8.png');

    /**
     * Loading Fonts
     */
    const fontLoader = new FontLoader();
    fontLoader.load('../assets/fonts/helvetiker_bold.typeface.json', (font) => {
      const textGeometry = new TextBufferGeometry('Hello World', {
        font,
        size: 0.7,
        height: 0.2,
        curveSegments: 15,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
      });
      const textMaterial = new MeshNormalMaterial();
      // const textMaterial = new MeshMatcapMaterial();
      // textMaterial.map = matCapTexture;
      // textMaterial.wireframe = true;
      const text = new Mesh(textGeometry, textMaterial);
      textGeometry.computeBoundingBox();
      // if (textGeometry.boundingBox) {
      //   textGeometry.translate(
      //     -((textGeometry.boundingBox.max.x - 0.02) * 0.5),
      //     -((textGeometry.boundingBox.max.y - 0.02) * 0.5),
      //     -((textGeometry.boundingBox.max.z - 0.03) * 0.5)
      //   );
      // }
      textGeometry.center();
      scene.add(text, camera);

      // Creating disks
      const donutGeometry = new TorusBufferGeometry(0.3, 0.2, 20, 45);
      const boxGeometry = new BoxBufferGeometry(0.3, 0.3, 0.3);
      // const donutMaterial = new MeshNormalMaterial();
      for (let i = 0; i < 1000; ++i) {
        const donut = new Mesh(
          Math.random() > 0.5 ? boxGeometry : donutGeometry,
          textMaterial
        );
        donut.position.x = (Math.random() - 0.5) * 25;
        donut.position.y = (Math.random() - 0.5) * 25;
        donut.position.z = (Math.random() - 0.5) * 25;

        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;

        const scaleOffset = Math.random();
        donut.scale.x = scaleOffset;
        donut.scale.y = scaleOffset;
        donut.scale.z = scaleOffset;

        scene.add(donut);
      }
    });

    /**
     * Materials
     */
    const material = new MeshNormalMaterial();

    /**
     * Creating Box Mesh
     */
    // const boxMesh = new Mesh(new BoxBufferGeometry(1, 1, 1), material);
    // scene.add(boxMesh);
    // camera.lookAt(boxMesh.position);
    /**
     * OrbitControls
     */
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();

    /**
     * Handling Events
     */
    const handleEvents = () => {
      /**
       * Handling Resize
       */
      fromEvent(window, 'resize').subscribe(() => {
        renderer.setSize(this.width, this.height);
        scene.updateMatrix();
      });
    };
    handleEvents();

    /**
     * Debugger
     */
    const datGui = new GUI();
    if ('wireframe' in material) {
      datGui.add(material, 'wireframe').name('Wireframe');
    }
    datGui.domElement = document.querySelector('body') as HTMLElement;

    /**
     * Axes Helper
     */
    const axisHelper = new AxesHelper(3);
    // scene.add(axisHelper);

    /**
     * Game Loop
     */
    const startTime = Date.now();
    const tick = () => {
      window.requestAnimationFrame(tick);
      const elapsedTime = Date.now() - startTime;
      /**
       * Rotating boxMesh
       */
      // boxMesh.rotation.x = elapsedTime * 0.0002;
      // boxMesh.rotation.y = elapsedTime * 0.0002;
      // boxMesh.rotation.z = elapsedTime * 0.0002;

      /**
       * Orbit Controls Update
       */
      orbitControls.update();

      renderer.render(scene, camera);
    };

    tick();
  }

  get width(): number {
    return window.innerWidth;
  }

  get height(): number {
    return window.innerHeight;
  }

  get aspect(): number {
    return this.width / this.height;
  }
}
