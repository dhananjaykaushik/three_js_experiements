import { Component, OnInit } from '@angular/core';
import { GUI } from 'dat-gui';
import {
	BoxBufferGeometry,
	DoubleSide,
	Mesh,
	MeshNormalMaterial,
	PerspectiveCamera,
	PlaneBufferGeometry,
	Scene,
	TextureLoader,
	TorusBufferGeometry,
	WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
	ngOnInit() {
		/**
		 * Loading Textures
		 */
		const textureLoader = new TextureLoader();
		const texture = textureLoader.load('../assets/box.png');

		/**
		 * Materials
		 */
		// const material = new MeshBasicMaterial({
		// 	map: texture,
		// });
		const material = new MeshNormalMaterial();

		/**
		 * Creating Box Mesh
		 */
		const boxMesh = new Mesh(
			new BoxBufferGeometry(1, 1, 1, 4, 4),
			material
		);

		/**
		 * Creating Plane Mesh
		 */
		material.side = DoubleSide;
		const planeMesh = new Mesh(
			new PlaneBufferGeometry(2, 2, 4, 4),
			material
		);
		planeMesh.position.x = -2.5;

		/**
		 * Creating Torus Mesh
		 */
		const torusMesh = new Mesh(
			new TorusBufferGeometry(0.5, 0.3, 20, 100),
			material
		);
		torusMesh.position.x = 2.5;

		/**
		 * Camera
		 */
		const camera = new PerspectiveCamera(75, this.aspect, 0.1, 100);
		camera.position.z = -4;
		camera.lookAt(boxMesh.position);

		/**
		 * Scene
		 */
		const scene = new Scene();
		scene.add(boxMesh, planeMesh, torusMesh, camera);

		/**
		 * Renderer
		 */
		const renderer = new WebGLRenderer({
			canvas: document.querySelector('.webgl') as HTMLCanvasElement,
		});
		renderer.setSize(this.width, this.height);

		/**
		 * OrbitControls
		 */
		const orbitControls = new OrbitControls(camera, renderer.domElement);
		orbitControls.update();

		const datGui = new GUI();
		datGui.add(material, 'wireframe');
		datGui.domElement = document.querySelector('body') as HTMLElement;

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
			boxMesh.rotation.x = elapsedTime * 0.0002;
			boxMesh.rotation.y = elapsedTime * 0.0002;
			boxMesh.rotation.z = elapsedTime * 0.0002;

			/**
			 * Rotating planeMesh
			 */
			planeMesh.rotation.x = elapsedTime * 0.0002;
			planeMesh.rotation.y = elapsedTime * 0.0002;
			planeMesh.rotation.z = elapsedTime * 0.0002;

			/**
			 * Rotating torusMesh
			 */
			torusMesh.rotation.x = elapsedTime * 0.0002;
			torusMesh.rotation.y = elapsedTime * 0.0002;
			torusMesh.rotation.z = elapsedTime * 0.0002;

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
