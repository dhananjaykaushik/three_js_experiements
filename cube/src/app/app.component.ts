import { Component, OnInit } from '@angular/core';
import * as dat from 'dat.gui';
import gsap from 'gsap';
import {
  BoxBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  domElement: HTMLCanvasElement = null;
  constructor() {}

  ngOnInit() {
    // Creating a scene
    const scene = new Scene();

    // Creating Camera
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    window.onresize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    camera.position.z = 5;
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const oc = new OrbitControls(camera, renderer.domElement);
    oc.update();
    // const geometry = new BoxGeometry(2, 2, 2, 3, 3, 3);

    // const geometry = new BufferGeometry();
    // const vertices = [
    //   { pos: [0, 0, 0], norm: [0, 0, 1], uv: [0, 0] },
    //   { pos: [0, 2, 0], norm: [0, 0, 1], uv: [1, 0] },
    //   { pos: [2, 0, 0], norm: [0, 0, 1], uv: [0, 1] },
    // ];
    // const positions = [];
    // const normals = [];
    // const uvs = [];
    // for (const vertex of vertices) {
    //   positions.push(...vertex.pos);
    //   normals.push(...vertex.norm);
    //   uvs.push(...vertex.uv);
    // }

    // const positionNumComponents = 3;
    // const normalNumComponents = 3;
    // const uvNumComponents = 2;
    // geometry.setAttribute(
    //   'position',
    //   new BufferAttribute(new Float32Array(positions), positionNumComponents)
    // );
    // geometry.setAttribute(
    //   'normal',
    //   new BufferAttribute(new Float32Array(normals), normalNumComponents)
    // );
    // geometry.setAttribute(
    //   'uv',
    //   new BufferAttribute(new Float32Array(uvs), uvNumComponents)
    // );

    // Dat GUI
    const gui = new dat.GUI();

    const geometry = new BoxBufferGeometry(2, 2, 2, 4, 4, 4);

    const parameter = {
      color: 0xff0000,
      spin: () => {
        gsap.to(cube.rotation, {
          y: cube.rotation.y + Math.PI,
          duration: 0.5,
        });
      },
    };

    // const texture = new TextureLoader().load('assets/crate.gif');
    const material = new MeshBasicMaterial({
      color: parameter.color,
      wireframe: true,
    });
    const cube = new Mesh(geometry, material);
    scene.add(cube);
    // Debug
    // gui.add(cube.position, 'y', -3, 3, 0.1);
    gui.add(cube.position, 'y').min(-3).max(3).step(0.01).name('Elevation');
    gui.add(cube, 'visible').name('Visisble');
    gui.add(material, 'wireframe').name('Wireframe');
    gui.addColor(parameter, 'color').onChange((color) => {
      // material.color.set(color);
      material.color.set(parameter.color);
    });
    gui.add(parameter, 'spin');
    const animate = () => {
      requestAnimationFrame(animate);
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      oc.update();
      renderer.render(scene, camera);
    };
    animate();
  }
}
