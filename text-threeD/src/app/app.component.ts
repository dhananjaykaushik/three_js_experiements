import { Component, OnInit } from '@angular/core';
import { GUI } from 'dat-gui';
import { fromEvent } from 'rxjs';
import {
	AmbientLight,
	BufferAttribute,
	CubeTextureLoader,
	DoubleSide,
	Mesh,
	MeshStandardMaterial,
	PerspectiveCamera,
	PlaneBufferGeometry,
	PointLight,
	Scene,
	SphereBufferGeometry,
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
		// For loading environment maps
		const cubeTextureLoader = new CubeTextureLoader();
		const boxTexture = textureLoader.load('../assets/box.png');
		const gradientTexture = textureLoader.load('../assets/3.jpg');
		const doorTexture = textureLoader.load('../assets/door/door.jpg');
		const aoTexture = textureLoader.load(
			'../assets/door/ambientOcclusion.jpg'
		);
		const doorHeightTexture = textureLoader.load(
			'../assets/door/height.jpg'
		);
		const doorMetalnessTexture = textureLoader.load(
			'../assets/door/metalness.jpg'
		);
		const doorRoughnessTexture = textureLoader.load(
			'../assets/door/roughness.jpg'
		);
		const doorNormalTexture = textureLoader.load(
			'../assets/door/normal.jpg'
		);
		const doorAlphaTexture = textureLoader.load('../assets/door/alpha.jpg');

		const environmentMapTexture = cubeTextureLoader.load([
			'../assets/environmentMaps/5/px.png',
			'../assets/environmentMaps/5/nx.png',
			'../assets/environmentMaps/5/py.png',
			'../assets/environmentMaps/5/ny.png',
			'../assets/environmentMaps/5/pz.png',
			'../assets/environmentMaps/5/nz.png',
		]);

		/**
		 * Materials
		 */
		// const material = new MeshBasicMaterial({
		// 	map: boxTexture,
		// });
		// const material = new MeshNormalMaterial();
		// const material = new MeshMatcapMaterial();
		// const material = new MeshDepthMaterial();
		// const material = new MeshLambertMaterial();
		// const material = new MeshPhongMaterial();
		// material.shininess = 100;
		// material.specular = new Color(0x00ff00);
		// const material = new MeshToonMaterial();
		// material.gradientMap = gradientTexture;
		// gradientTexture.minFilter = NearestFilter;
		// gradientTexture.magFilter = NearestFilter;
		// gradientTexture.generateMipmaps = false;

		const material = new MeshStandardMaterial();
		material.metalness = 0.7;
		material.roughness = 0.2;
		// material.map = doorTexture;
		// material.aoMap = aoTexture;
		// material.aoMapIntensity = 1;
		// material.displacementMap = doorHeightTexture;
		// material.displacementScale = 0.01;
		// material.metalnessMap = doorMetalnessTexture;
		// material.roughnessMap = doorRoughnessTexture;
		// material.normalMap = doorNormalTexture;
		// material.normalScale.set(0.5, 0.5);
		// material.transparent = true;
		// material.alphaMap = doorAlphaTexture;

		material.envMap = environmentMapTexture;

		/**
		 * Mesh Attributes
		 */
		const meshAttributes = {
			gap: 2.5,
		};

		/**
		 * Creating sphere Mesh
		 */
		const sphereMesh = new Mesh(
			new SphereBufferGeometry(0.5, 64, 64),
			material
		);
		sphereMesh.geometry.setAttribute(
			'uv2',
			new BufferAttribute(sphereMesh.geometry.attributes.uv.array, 2)
		);

		/**
		 * Creating Plane Mesh
		 */
		material.side = DoubleSide;
		const planeMesh = new Mesh(
			new PlaneBufferGeometry(1, 1, 100, 100),
			material
		);
		planeMesh.geometry.setAttribute(
			'uv2',
			new BufferAttribute(planeMesh.geometry.attributes.uv.array, 2)
		);

		/**
		 * Creating Torus Mesh
		 */
		const torusMesh = new Mesh(
			new TorusBufferGeometry(0.3, 0.2, 64, 128),
			material
		);
		torusMesh.geometry.setAttribute(
			'uv2',
			new BufferAttribute(torusMesh.geometry.attributes.uv.array, 2)
		);

		/**
		 * Camera
		 */
		const camera = new PerspectiveCamera(75, this.aspect, 0.1, 100);
		camera.position.z = -4;
		// camera.lookAt(sphereMesh.position);

		/**
		 * Scene
		 */
		const scene = new Scene();
		scene.add(sphereMesh, planeMesh, torusMesh, camera);

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

		/**
		 * Ambient Light
		 */
		const ambientLight = new AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		/**
		 * Point Light
		 */
		const pointLight = new PointLight(0xffffff, 0.5);
		scene.add(pointLight);

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
		if ('metalness' in material) {
			datGui
				.add(material, 'metalness')
				.min(0)
				.max(1)
				.step(0.0001)
				.name('Metalness');
		}
		if ('roughness' in material) {
			datGui
				.add(material, 'roughness')
				.min(0)
				.max(1)
				.step(0.0001)
				.name('Roughness');
		}
		if ('aoMapIntensity' in material) {
			datGui
				.add(material, 'aoMapIntensity')
				.min(0)
				.max(10)
				.step(1)
				.name('AO-Map Intensity');
		}
		if ('displacementScale' in material) {
			datGui
				.add(material, 'displacementScale')
				.min(0)
				.max(1)
				.step(0.001)
				.name('Displacement Scale');
		}

		datGui.add(meshAttributes, 'gap').min(0).max(5).step(0.1).name('Gap');
		datGui.domElement = document.querySelector('body') as HTMLElement;

		/**
		 * Game Loop
		 */
		const startTime = Date.now();
		const tick = () => {
			window.requestAnimationFrame(tick);
			const elapsedTime = Date.now() - startTime;
			/**
			 * Rotating sphereMesh
			 */
			sphereMesh.rotation.x = elapsedTime * 0.0002;
			sphereMesh.rotation.y = elapsedTime * 0.0002;
			sphereMesh.rotation.z = elapsedTime * 0.0002;

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
			 * Updating Gap
			 */
			planeMesh.position.x = -meshAttributes.gap;
			torusMesh.position.x = meshAttributes.gap;

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
