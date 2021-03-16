import {Directions} from "../interfaces/Directions";
import {Coords} from "../interfaces/Coords";
import {MAIN_GAME_CONFIG} from '../GameConfig';
import Scene = Phaser.Scene;
import Rectangle = Phaser.GameObjects.Rectangle;

export default class Player {
    private blocks: Rectangle[] = [];
    private scene: Scene;
    private currentDirection: Directions;
    private nextDirection: Directions;
    private justEaten: boolean = false;
    private _isDed: boolean = false;
    get isDed(): boolean {
        return this._isDed;
    }
    set isDed(ded: boolean) {
        this._isDed = ded;
    }

    constructor(scene: Scene) {
        this.scene = scene;
        this.currentDirection = Directions.UP;
        this.nextDirection = Directions.UP;
    }

    eat() {
        this.justEaten = true;
    }

    addNewBlock(coords: Coords) {
        const block = this.scene.add.rectangle(coords.x, coords.y, MAIN_GAME_CONFIG.blockSize, MAIN_GAME_CONFIG.blockSize, 0xffffff);
        this.blocks.unshift(block);
    }

    getCurrentBlocks(): Rectangle[] {
        return this.blocks;
    }

    changeDirection(direction: Directions) {
        if (direction !== this.currentDirection) {
            if (this.currentDirection === Directions.UP || this.currentDirection === Directions.DOWN) {
                if (direction === Directions.LEFT || direction === Directions.RIGHT) {
                    this.nextDirection = direction;
                }
            } else if (this.currentDirection === Directions.LEFT || this.currentDirection === Directions.RIGHT) {
                if (direction === Directions.UP || direction === Directions.DOWN) {
                    this.nextDirection = direction;
                }
            }
        }
    }

    move() {
        this.currentDirection = this.nextDirection;
        const newCoords = {...this.blocks[0]};

        switch(this.currentDirection) {
            case Directions.UP:
                newCoords.y -= MAIN_GAME_CONFIG.blockSize;
                break;
            case Directions.DOWN:
                newCoords.y += MAIN_GAME_CONFIG.blockSize;
                break;
            case Directions.LEFT:
                newCoords.x -= MAIN_GAME_CONFIG.blockSize;
                break;
            case Directions.RIGHT:
                newCoords.x += MAIN_GAME_CONFIG.blockSize;
                break;
        }

        if (this.checkIfDead(newCoords)) {
            this._isDed = true;
            return;
        }

        this.addNewBlock(newCoords);

        if (!this.justEaten) {
            const deleteMe = this.blocks.pop();
            this.scene.children.remove(deleteMe);
        } else {
            this.justEaten = false;
        }
    }

    checkIfDead(nextCoords: Coords): boolean {
        if (nextCoords.x < MAIN_GAME_CONFIG.blockSize / 2 || nextCoords.x > MAIN_GAME_CONFIG.width() - MAIN_GAME_CONFIG.blockSize / 2
            || nextCoords.y < MAIN_GAME_CONFIG.blockSize / 2 || nextCoords.y > MAIN_GAME_CONFIG.height() - MAIN_GAME_CONFIG.blockSize / 2) {
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
