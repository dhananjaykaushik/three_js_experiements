import * as THREE from 'three';
import { Cell } from './Cell';
export class Player extends Cell {
  constructor(public x: number, public y: number, public z: number) {
    super(x, y, z, true);
  }

  moveLeft(
    camera: THREE.PerspectiveCamera,
    gridMap: Map<String, Cell>,
    keyGen: Function,
    gridHeight: number,
    gridLength: number
  ) {
    const nextCoords = {
      x: this.x + 1,
      y: this.y,
      z: this.z,
    };
    if (gridMap.has(keyGen(nextCoords.x, nextCoords.y, nextCoords.z))) {
      const box = gridMap.get(keyGen(nextCoords.x, nextCoords.y, nextCoords.z));
      if (box && box.isWall) {
        return;
      }
      // Back  Right Front Left
      // Check if right is wall
      if (box && box.walls[3]) {
        return;
      }
      this.group.position.x += 1;
      this.x += 1;
      // gsap.to(camera.position, {
      //   x:
      //     camera.position.x + 3 < gridLength + 30
      //       ? camera.position.x + 3
      //       : camera.position.x,
      //   duration: 0.3,
      // });
    }
  }

  moveRight(
    camera: THREE.PerspectiveCamera,
    gridMap: Map<String, Cell>,
    keyGen: Function,
    gridHeight: number,
    gridLength: number
  ) {
    const nextCoords = {
      x: this.x - 1,
      y: this.y,
      z: this.z,
    };
    if (gridMap.has(keyGen(nextCoords.x, nextCoords.y, nextCoords.z))) {
      const box = gridMap.get(keyGen(nextCoords.x, nextCoords.y, nextCoords.z));
      if (box && box.isWall) {
        return;
      }
      // Back  Right Front Left
      // Check if left is wall
      if (box && box.walls[1]) {
        return;
      }
      this.group.position.x -= 1;
      this.x -= 1;
      // gsap.to(camera.position, {
      //   x:
      //     camera.position.x - 3 > -8
      //       ? camera.position.x - 3
      //       : camera.position.x,
      //   duration: 0.3,
      // });
    }
  }

  moveForward(
    camera: THREE.PerspectiveCamera,
    gridMap: Map<String, Cell>,
    keyGen: Function,
    gridHeight: number,
    gridLength: number
  ) {
    const nextCoords = {
      x: this.x,
      y: this.y,
      z: this.z + 1,
    };

    if (gridMap.has(keyGen(nextCoords.x, nextCoords.y, nextCoords.z))) {
      const box = gridMap.get(keyGen(nextCoords.x, nextCoords.y, nextCoords.z));
      if (box && box.isWall) {
        return;
      }
      // Back  Right Front Left
      // Check if back is wall
      if (box && box.walls[0]) {
        return;
      }
      this.group.position.z += 1;
      this.z += 1;

      // gsap.to(camera.position, {
      //   y: camera.position.y + 2,
      //   z:
      //     camera.position.z + 2 < gridHeight + 80
      //       ? camera.position.z + 2
      //       : camera.position.z,
      //   duration: 0.3,
      // });
    }
  }

  moveBack(
    camera: THREE.PerspectiveCamera,
    gridMap: Map<String, Cell>,
    keyGen: Function,
    gridHeight: number,
    gridLength: number
  ) {
    const nextCoords = {
      x: this.x,
      y: this.y,
      z: this.z - 1,
    };
    if (gridMap.has(keyGen(nextCoords.x, nextCoords.y, nextCoords.z))) {
      const box = gridMap.get(keyGen(nextCoords.x, nextCoords.y, nextCoords.z));
      if (box && box.isWall) {
        return;
      }
      // Back  Right Front Left
      // Check if front is wall
      if (box && box.walls[2]) {
        return;
      }

      this.group.position.z -= 1;
      this.z -= 1;
      // gsap.to(camera.position, {
      //   y: camera.position.y - 2,
      //   z:
      //     camera.position.z - 4 > 10
      //       ? camera.position.z - 4
      //       : camera.position.z,
      //   duration: 0.3,
      // });
    }
  }
}
