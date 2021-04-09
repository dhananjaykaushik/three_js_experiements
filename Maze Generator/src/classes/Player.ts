import * as THREE from "three";
import { Cell } from "./Cell";

export class Player extends Cell {
  constructor(public x, public y, public z) {
    super(x, y, z, true);
  }

  moveLeft(
    camera: THREE.PerspectiveCamera,
    gridMap: Map<String, Cell>,
    keyGen
  ) {
    const nextCoords = {
      x: this.x + 1,
      y: this.y,
      z: this.z,
    };
    if (gridMap.has(keyGen(nextCoords.x, nextCoords.y, nextCoords.z))) {
      const box = gridMap.get(keyGen(nextCoords.x, nextCoords.y, nextCoords.z));
      if (box.isWall) {
        return;
      }
      // Back  Right Front Left
      // Check if right is wall
      if (box.walls[3]) {
        return;
      }
      this.group.position.x += 1;
      this.x += 1;
      // camera.position.x += 1;
    }
  }

  moveRight(
    camera: THREE.PerspectiveCamera,
    gridMap: Map<String, Cell>,
    keyGen
  ) {
    const nextCoords = {
      x: this.x - 1,
      y: this.y,
      z: this.z,
    };
    if (gridMap.has(keyGen(nextCoords.x, nextCoords.y, nextCoords.z))) {
      const box = gridMap.get(keyGen(nextCoords.x, nextCoords.y, nextCoords.z));
      if (box.isWall) {
        return;
      }
      // Back  Right Front Left
      // Check if left is wall
      if (box.walls[1]) {
        return;
      }
      this.group.position.x -= 1;
      this.x -= 1;
      // camera.position.x -= 1;
    }
  }

  moveForward(
    camera: THREE.PerspectiveCamera,
    gridMap: Map<String, Cell>,
    keyGen
  ) {
    const nextCoords = {
      x: this.x,
      y: this.y,
      z: this.z + 1,
    };

    if (gridMap.has(keyGen(nextCoords.x, nextCoords.y, nextCoords.z))) {
      const box = gridMap.get(keyGen(nextCoords.x, nextCoords.y, nextCoords.z));
      if (box.isWall) {
        return;
      }
      // Back  Right Front Left
      // Check if back is wall
      if (box.walls[0]) {
        return;
      }
      this.group.position.z += 1;
      this.z += 1;
      // camera.position.z += 1;
    }
  }

  moveBack(
    camera: THREE.PerspectiveCamera,
    gridMap: Map<String, Cell>,
    keyGen
  ) {
    const nextCoords = {
      x: this.x,
      y: this.y,
      z: this.z - 1,
    };
    if (gridMap.has(keyGen(nextCoords.x, nextCoords.y, nextCoords.z))) {
      const box = gridMap.get(keyGen(nextCoords.x, nextCoords.y, nextCoords.z));
      if (box.isWall) {
        return;
      }
      // Back  Right Front Left
      // Check if front is wall
      if (box.walls[2]) {
        return;
      }

      this.group.position.z -= 1;
      this.z -= 1;
      // camera.position.z -= 1;
    }
  }
}
