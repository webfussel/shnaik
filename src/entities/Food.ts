import {Coords} from "../interfaces/Coords";
import Scene = Phaser.Scene;

export default class Food {
    private block: any;
    private scene: Scene;
    private currentCoords: Coords;

    constructor(scene: Scene, coords: Coords, blockSize: number) {
        this.scene = scene;
        this.block = scene.add.rectangle(coords.x, coords.y, blockSize, blockSize, 0x00aa00);
        this.move(coords);
    }

    move(coords: Coords) {
        this.currentCoords = coords;
        this.block.x = coords.x;
        this.block.y = coords.y;
    }

    getCurrentCoords(): Coords {
        return this.currentCoords;
    }

}