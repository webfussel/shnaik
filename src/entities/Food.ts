import {Coords} from "../interfaces/Coords";
import Scene = Phaser.Scene;
import * as Config from './../GameConfig';

export default class Food {
    private block: any;
    private scene: Scene;
    private currentCoords: Coords;

    constructor(scene: Scene, coords: Coords) {
        this.scene = scene;
        this.block = scene.add.rectangle(coords.x, coords.y, Config.blockSize, Config.blockSize, 0x00aa00);
        this.currentCoords = coords;
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