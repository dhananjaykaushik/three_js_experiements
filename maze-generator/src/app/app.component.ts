import { Component, OnInit } from '@angular/core';
import gsap from 'gsap';
import * as THREE from 'three';
import { Group } from 'three';
import { Cell } from './classes/Cell';
import { Player } from './classes/Player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'maze-generator';

  ngOnInit() {
    // const OrbitControls = oc(THREE);
    // Grid constants
    const GRID_HEIGHT = 25;
    const GRID_LENGTH = 25;

    // Creating Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      20,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    scene.add(camera);

    // Creating renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('.webgl') as HTMLCanvasElement,
      antialias: true,
      alpha: true,
    });
    // renderer.setClearColor('')

    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.update();
    // const axesHelper = new THREE.AxesHelper(12);
    // scene.add(axesHelper);

    const keyGen = (x: number, y: number, z: number) => {
      return `${x}|${y}|${z}`;
    };

    // Creating grid
    const gridMap: Map<String, Cell> = new Map();
    for (let i = 0; i < GRID_LENGTH; ++i) {
      for (let j = 0; j < GRID_HEIGHT; ++j) {
        const cell = new Cell(i, 1, j);
        if (i === 0 || i === GRID_LENGTH - 1 || j === 0) {
          cell.isWall = true;
        }
        if (i === 1 && j === 0) {
          // Starting Point
          cell.isWall = false;
          cell.isStartingCell = true;
        }
        if (i === GRID_LENGTH - 2 && j === GRID_HEIGHT - 1) {
          cell.isEndingCell = true;
        }
        gridMap.set(keyGen(i, 1, j), cell);
      }
    }

    const getValidateNeighbor = (
      neighbors: { x: number; y: number; z: number }[]
    ) => {
      const validNeighbors = [];
      neighbors.forEach((neighbor) => {
        const neighborData = gridMap.get(
          keyGen(neighbor.x, neighbor.y, neighbor.z)
        );
        if (neighborData && !neighborData.isVisited && !neighborData.isWall) {
          validNeighbors.push(neighbor);
        }
      });
      if (validNeighbors && validNeighbors.length) {
        // if (validNeighbors.length === 1) {
        //   return validNeighbors[0];
        // }
        return validNeighbors[
          Math.floor(Math.random() * validNeighbors.length)
        ];
      }
      return null;
    };
    const removeWall = (current: Cell, next: Cell) => {
      //       Back  Right Front Left
      if (current.x - next.x === -1) {
        // Next is right to Current
        next.walls[3] = false;
        current.walls[1] = false;
      }
      if (current.x - next.x === 1) {
        // Next is left to Current
        next.walls[1] = false;
        current.walls[3] = false;
      }
      if (current.z - next.z === -1) {
        // Next is front of Current
        next.walls[0] = false;
        current.walls[2] = false;
      }
      if (current.z - next.z === 1) {
        // Next is back of Current
        next.walls[2] = false;
        current.walls[0] = false;
      }
    };
    // Starting Cell :: 1 1 0
    let current = gridMap.get(keyGen(1, 1, 0));
    const cellStack = [];
    const mazeGenerate = () => {
      if (current) {
        current.isVisited = true;
        const neighbors = current.getNeigbors();
        const nextCoordinates = getValidateNeighbor(neighbors);
        if (!neighbors && !cellStack.length) {
          return;
        }
        if (nextCoordinates !== null) {
          const next = gridMap.get(
            keyGen(nextCoordinates.x, nextCoordinates.y, nextCoordinates.z)
          );
          if (next) {
            cellStack.push(current);
            // Remove walls between current and next
            removeWall(current, next);
            next.isVisited = true;
            current = next;
            mazeGenerate();
          }
        } else if (cellStack.length) {
          current = cellStack.pop();
          mazeGenerate();
        }
        return;
      }
    };
    mazeGenerate();

    const gridGroup = new Group();
    for (let value of gridMap.values()) {
      value.drawCube();
      gridGroup.add(value.group);
    }
    // const geometry = new THREE.SphereGeometry(1, 16, 12);
    // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    // const sphere = new THREE.Mesh(geometry, material);
    // sphere.position.set(1.5, 1.5, 0);
    // sphere.scale.set(0.3, 0.3, 0.3);
    // camera.position.set(4, 30, 20);

    // gridGroup.position.x = -Math.floor(GRID_LENGTH / 2);
    // gridGroup.position.y = 1;
    // gridGroup.position.z = -Math.floor(GRID_HEIGHT / 2);

    const mainGroup = new THREE.Group();
    const player = new Player(1, 1, 0);
    player.drawCube();
    mainGroup.add(gridGroup, player.group);
    scene.add(mainGroup);
    // camera.position.set(GRID_LENGTH / 0.5, GRID_LENGTH * 3.5, GRID_HEIGHT * 3);
    // camera.lookAt(mainGroup.position);
    window.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      switch (key) {
        case 'arrowup':
        case 'w':
          player.moveBack(camera, gridMap, keyGen, GRID_HEIGHT, GRID_LENGTH);
          break;
        case 'arrowright':
        case 'd':
          player.moveLeft(camera, gridMap, keyGen, GRID_HEIGHT, GRID_LENGTH);
          break;
        case 'arrowdown':
        case 's':
          player.moveForward(camera, gridMap, keyGen, GRID_HEIGHT, GRID_LENGTH);
          break;
        case 'arrowleft':
        case 'a':
          player.moveRight(camera, gridMap, keyGen, GRID_HEIGHT, GRID_LENGTH);
          break;
      }
    });

    // mainGroup.position.z -= GRID_LENGTH * 2;
    // let cameraMoved = null;

    const updateCameraPosition = () => {
      //creating an offset position for camera with respect to the car
      var offset = new THREE.Vector3(
        player.group.position.x - 2,
        player.group.position.y + 12,
        player.group.position.z + 8
      );
      // tried to create delay position value for enable smooth transition for camera
      // camera.position.lerp(offset, 1);
      gsap.to(camera.position, {
        x: offset.x,
        y: offset.y,
        z: offset.z,
        duration: 0.2,
      });
      // updating lookat alway look at the player
      camera.lookAt(player.group.position);
    };

    updateCameraPosition();

    const renderScene = () => {
      requestAnimationFrame(renderScene);
      // if (
      //   player.group.position.z > GRID_HEIGHT / 2 &&
      //   player.group.position.x > GRID_LENGTH / 2
      // ) {
      //   if (!cameraMoved) {
      //     cameraMoved = {
      //       x: camera.position.x,
      //       y: camera.position.y,
      //       z: camera.position.z,
      //     };
      //     gsap.to(camera.position, {
      //       x: camera.position.x + 12,
      //       y: camera.position.y + 12,
      //       z: camera.position.z + 20,
      //       duration: 0.5,
      //     });
      //   }
      // } else {
      //   if (cameraMoved) {
      //     // Back to originals
      //     gsap.to(camera.position, {
      //       x: cameraMoved.x,
      //       y: cameraMoved.y,
      //       z: cameraMoved.z,
      //       duration: 0.5,
      //     });
      //     cameraMoved = null;
      //   }
      // }
      // camera.lookAt(mainGroup.position);
      // camera.lookAt(player.group.position);
      // controls.update();
      updateCameraPosition();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    };

    renderScene();
  }
}
