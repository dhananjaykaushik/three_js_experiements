import * as THREE from 'three';
import { TextureLoader } from 'three';

export class Cell {
  readonly CELL_HEIGHT = 1;
  readonly CELL_WIDTH = 1;
  readonly CELL_DEPTH = 1;
  readonly PLAYER_HEIGHT = 0.5;
  readonly PLAYER_WIDTH = 0.5;
  readonly PLAYER_DEPTH = 0.5;
  readonly THICKNESS = 0.02;
  public group: THREE.Group = new THREE.Group();
  isVisited = false;
  isWall = false;
  isStartingCell = false;
  isEndingCell = false;
  turnRed = false;
  turnGreen = false;
  //       Back  Right Front Left
  walls = [true, true, true, true];
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public isPlayer?: boolean
  ) {}

  drawCube() {
    const material = new THREE.MeshBasicMaterial({ color: 0x0f2027 });
    const materialFloor = new THREE.MeshBasicMaterial({ color: 0x2c5364 });
    const materialPlayer = new THREE.MeshBasicMaterial({
      map: new TextureLoader().load('assets/box.png'),
    });

    const dimensions = {
      height: this.isPlayer ? this.PLAYER_HEIGHT : this.CELL_HEIGHT,
      width: this.isPlayer ? this.PLAYER_WIDTH : this.CELL_WIDTH,
      depth: this.isPlayer ? this.PLAYER_DEPTH : this.CELL_DEPTH,
    };

    // Front face creation
    const front = new THREE.Mesh(
      new THREE.BoxGeometry(
        dimensions.width,
        dimensions.height,
        this.THICKNESS
      ),
      this.isPlayer ? materialPlayer : material
    );
    front.position.set(
      this.x + dimensions.width / 2,
      this.y + dimensions.height / 2,
      this.z
    );

    // Back face creation
    const back = new THREE.Mesh(
      new THREE.BoxGeometry(
        dimensions.width,
        dimensions.height,
        this.THICKNESS
      ),
      this.isPlayer ? materialPlayer : material
    );
    back.position.set(
      this.x + dimensions.width / 2,
      this.y + dimensions.height / 2,
      this.z - dimensions.depth
    );

    // Right face creation
    const right = new THREE.Mesh(
      new THREE.BoxGeometry(
        this.THICKNESS,
        dimensions.height,
        dimensions.depth
      ),
      this.isPlayer ? materialPlayer : material
    );
    right.position.set(
      this.x + dimensions.width,
      this.y + dimensions.height / 2,
      this.z - dimensions.depth / 2
    );

    // Left face creation
    const left = new THREE.Mesh(
      new THREE.BoxGeometry(
        this.THICKNESS,
        dimensions.height,
        dimensions.depth
      ),
      this.isPlayer ? materialPlayer : material
    );
    left.position.set(
      this.x,
      this.y + dimensions.height / 2,
      this.z - dimensions.depth / 2
    );

    // Bottom face
    const bottom = new THREE.Mesh(
      new THREE.BoxGeometry(dimensions.width, this.THICKNESS, dimensions.depth),
      this.isPlayer ? materialPlayer : materialFloor
    );
    bottom.position.set(
      this.x + dimensions.width / 2,
      this.y,
      this.z - dimensions.depth / 2
    );

    // Top face
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(dimensions.width, this.THICKNESS, dimensions.depth),
      this.isPlayer ? materialPlayer : material
    );
    top.position.set(
      this.x + dimensions.width / 2,
      this.y + dimensions.height,
      this.z - dimensions.depth / 2
    );

    this.group = new THREE.Group();
    if (!this.isStartingCell) {
      if (this.walls[0]) {
        this.group.add(back);
      }
      if (this.walls[2] && !this.isEndingCell) {
        this.group.add(front);
      }
    }
    if (this.walls[1]) {
      this.group.add(right);
    }
    if (this.walls[3]) {
      this.group.add(left);
    }
    this.group.add(bottom);
    if (this.isWall || this.isPlayer) {
      this.group.add(top);
    }
    if (this.isPlayer) {
      this.group.position.set(
        this.group.position.x + dimensions.width / 2,
        this.group.position.y + dimensions.height / 2,
        this.group.position.z - dimensions.depth / 2
      );
    }
  }

  getNeigbors() {
    // [ BACK, RIGHT, FRONT, LEFT ]
    return [
      {
        x: this.x,
        y: this.y,
        z: this.z - 1,
      },
      {
        x: this.x + 1,
        y: this.y,
        z: this.z,
      },
      {
        x: this.x,
        y: this.y,
        z: this.z + 1,
      },
      {
        x: this.x - 1,
        y: this.y,
        z: this.z,
      },
    ];
  }
}
