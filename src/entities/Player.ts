import {Directions} from "../interfaces/Directions";
import {Coords} from "../interfaces/Coords";
import KeyboardPlugin = Phaser.Input.Keyboard.KeyboardPlugin;
import Key = Phaser.Input.Keyboard.Key;
import Scene = Phaser.Scene;
import Rectangle = Phaser.Geom.Rectangle;

export default class Player {
    private blocks: any[] = [];
    private maxBlockSize: number = 1;
    private blockSize: number = 0;
    private scene: Scene;
    private currentDirection: Directions;
    private justEaten: boolean = false;
    private _isDed: boolean = false;
    get isDed(): boolean {
        return this._isDed;
    }

    private fieldWidth: number;
    private fieldHeight: number;

    constructor(scene: Scene, blockSize: number, fieldWidth: number, fieldHeight: number) {
        this.blockSize = blockSize;
        this.scene = scene;
        this.currentDirection = Directions.UP;
        this.fieldWidth = fieldWidth;
        this.fieldHeight = fieldHeight;
    }

    eat() {
        this.justEaten = true;
    }

    increaseMaxBlockSize () {
        this.maxBlockSize++;
    }

    addNewBlock(coords: Coords) {
        const block = this.scene.add.rectangle(coords.x, coords.y, this.blockSize, this.blockSize, 0xffffff);
        this.blocks.unshift(block);
    }

    getCurrentBlocks(): Rectangle[] {
        return this.blocks;
    }

    changeDirection(direction: Directions) {
        if (direction !== this.currentDirection) {
            if (this.currentDirection === Directions.UP || this.currentDirection === Directions.DOWN) {
                if (direction === Directions.LEFT || direction === Directions.RIGHT) {
                    this.currentDirection = direction;
                }
            } else if (this.currentDirection === Directions.LEFT || this.currentDirection === Directions.RIGHT) {
                if (direction === Directions.UP || direction === Directions.DOWN) {
                    this.currentDirection = direction;
                }
            }
        }
    }

    move() {
        let currentFront = this.blocks[0];
        const newCoords = {x: 0, y: 0}
        if (Directions.UP === this.currentDirection) {
            newCoords.x = currentFront.x;
            newCoords.y = currentFront.y - this.blockSize;
        } else if (Directions.DOWN === this.currentDirection) {
            newCoords.x = currentFront.x;
            newCoords.y = currentFront.y + this.blockSize;
        } else if (Directions.LEFT === this.currentDirection) {
            newCoords.x = currentFront.x - this.blockSize;
            newCoords.y = currentFront.y;
        } else if (Directions.RIGHT === this.currentDirection) {
            newCoords.x = currentFront.x + this.blockSize;
            newCoords.y = currentFront.y;
        }

        if (this.checkIfDead(newCoords)) {
            this._isDed = true;
            return;
        }
        let block = this.scene.add.rectangle(newCoords.x, newCoords.y, this.blockSize, this.blockSize, 0xffffff);
        this.blocks.unshift(block);

        if (!this.justEaten) {
            const deleteMe = this.blocks.pop();
            this.scene.children.remove(deleteMe);
        } else {
            this.justEaten = false;
        }
    }

    checkIfDead(nextCoords: Coords): boolean {
        if (nextCoords.x < this.blockSize / 2 || nextCoords.x > this.fieldWidth - this.blockSize / 2
            || nextCoords.y < this.blockSize / 2 || nextCoords.y > this.fieldHeight - this.blockSize / 2) {
            return true;
        }

        for (const block of this.getCurrentBlocks()) {
            if (nextCoords.x === block.x && nextCoords.y === block.y) {
                return true;
            }
        }

        return false;
    }
}