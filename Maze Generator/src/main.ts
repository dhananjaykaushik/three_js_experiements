import * as THREE from "three";
import { Group } from "three";
import oc from "three-orbit-controls";
import { Cell } from "./classes/Cell";
import { Player } from "./classes/Player";

const OrbitControls = oc(THREE);
// Grid constants
const GRID_HEIGHT = 10;
const GRID_LENGTH = 10;

// Creating Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  12,
  window.innerWidth / window.innerHeight,
  1,
  100
);
scene.add(camera);

// Creating renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl") as HTMLCanvasElement,
  antialias: true,
  alpha: true,
});
// renderer.setClearColor('')

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
const axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

const keyGen = (x, y, z) => {
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
    return validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
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
const player = new Player(1, 1, 0);
player.drawCube();
camera.position.set(GRID_LENGTH * 1.5, GRID_LENGTH * 5, GRID_LENGTH * 3.5);

// gridGroup.position.x = -Math.floor(GRID_LENGTH / 2);
// gridGroup.position.y = 1;
// gridGroup.position.z = -Math.floor(GRID_HEIGHT / 2);

const mainGroup = new THREE.Group();
mainGroup.add(gridGroup, player.group);
scene.add(mainGroup);

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  switch (key) {
    case "arrowup":
    case "w":
      player.moveBack(camera, gridMap, keyGen);
      break;
    case "arrowright":
    case "d":
      player.moveLeft(camera, gridMap, keyGen);
      break;
    case "arrowdown":
    case "s":
      player.moveForward(camera, gridMap, keyGen);
      break;
    case "arrowleft":
    case "a":
      player.moveRight(camera, gridMap, keyGen);
      break;
  }
});
camera.lookAt(mainGroup.position);

const renderScene = () => {
  requestAnimationFrame(renderScene);
  controls.update();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
};

renderScene();
