import 'phaser';
import Player from "./entities/Player";
import {Directions} from "./interfaces/Directions";
import Food from "./entities/Food";
import {Coords} from "./interfaces/Coords";
import firebase from 'firebase/app';
import 'firebase/analytics';
import firebaseConfig from '../firebase.config.js';
import Graphics = Phaser.GameObjects.Graphics;
import TimerEvent = Phaser.Time.TimerEvent;
import Key = Phaser.Input.Keyboard.Key;

export default class Shnaik extends Phaser.Scene
{
    static blockSize: number = 20;
    static offset: number = 30;
    static width: number = Shnaik.blockSize * Shnaik.offset;
    static height: number = Shnaik.blockSize * Shnaik.offset;

    timePlayedEvent: TimerEvent;
    moveEvent: TimerEvent;
    moveEventConfig: any = {
        delay: 160,
        callback: () => {this.player.move()},
        callbackScope: this,
        loop: true
    };
    player: Player;
    food: Food;
    score: number = 0;
    timePlayed: number = 0;

    upKey: Key;
    downKey: Key;
    leftKey: Key;
    rightKey: Key;
    swipeDirection: Directions;

    constructor ()
    {
        super('main');
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
    }

    create ()
    {
        const graphics: Graphics = this.add.graphics({
            lineStyle: {
                width: 1,
                color: 0xffffff
            },
            fillStyle: {
                color: 0xffffff
            }
        })


        this.player = new Player(this, Shnaik.blockSize, Shnaik.width, Shnaik.height);
        this.player.addNewBlock(this.getMiddleOfMap());
        this.player.changeDirection(Directions.UP);

        this.food = new Food(this, this.getRandomCoords(), Shnaik.blockSize);

        this.moveEvent = this.time.addEvent(this.moveEventConfig)
        this.timePlayedEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {this.addTime()},
            callbackScope: this,
            loop: true
        })

        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.input.on("pointerup", this.endSwipe, this);

    }

    endSwipe(e) {
        const swipeTime = e.upTime - e.downTime;
        const swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        const swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        const swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);
        if(swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)) {
            if(swipeNormal.y < -0.8) {
                this.swipeDirection = Directions.UP;
            }
            if(swipeNormal.y > 0.8) {
                this.swipeDirection = Directions.DOWN;
            }
            if(swipeNormal.x < -0.8) {
                this.swipeDirection = Directions.LEFT;
            }
            if(swipeNormal.x > 0.8) {
                this.swipeDirection = Directions.RIGHT;
            }
            this.player.changeDirection(this.swipeDirection);
        }
    }

    getRandomCoords(): Coords {
        // Coords are for center, so you have to divide by 2 for a correct position in grid
        let x = Math.floor(Math.random() * Shnaik.offset) * Shnaik.blockSize - Shnaik.blockSize / 2;
        let y = Math.floor(Math.random() * Shnaik.offset) * Shnaik.blockSize - Shnaik.blockSize / 2;

        x = x < Shnaik.blockSize / 2 ? Shnaik.blockSize / 2 : x;
        y = y < Shnaik.blockSize / 2 ? Shnaik.blockSize / 2 : y;

        return {x, y};
    }

    getMiddleOfMap(): Coords {
        // Coords are for center, so you have to divide by 2 for a correct position in grid
        const x = (Shnaik.offset / 2) * Shnaik.blockSize - Shnaik.blockSize / 2;
        const y = (Shnaik.offset / 2) * Shnaik.blockSize - Shnaik.blockSize / 2;
        return {x, y};
    }

    getRandomCoordsNotAlreadyPossed(): Coords {
        const coords = this.getRandomCoords();
        let isTaken = false;

        this.player.getCurrentBlocks().forEach(block => {
            if (block.x === coords.x && block.y === coords.y) {
                isTaken = true;
            }
        })

        if (isTaken) {
            return this.getRandomCoordsNotAlreadyPossed();
        }

        return coords;
    }

    update(time: number, delta: number) {
        if (this.upKey.isDown) {
            this.player.changeDirection(Directions.UP);
        } else if (this.downKey.isDown) {
            this.player.changeDirection(Directions.DOWN);
        } else if (this.leftKey.isDown) {
            this.player.changeDirection(Directions.LEFT);
        } else if (this.rightKey.isDown) {
            this.player.changeDirection(Directions.RIGHT);
        }

        if (this.player.getCurrentBlocks()[0].x === this.food.getCurrentCoords().x
            && this.player.getCurrentBlocks()[0].y === this.food.getCurrentCoords().y) {
            this.player.eat();
            this.food.move(this.getRandomCoordsNotAlreadyPossed());

            this.addPoints();

            if (this.moveEventConfig.delay > 30) {
                this.moveEventConfig.delay -= 2;
            }
            this.moveEvent.remove();
            this.moveEvent = this.time.addEvent(this.moveEventConfig)
        }

        if (this.player.isDed) {
            this.moveEvent.destroy();
            this.timePlayedEvent.destroy();
            this.makeDed();
        }
    }

    addPoints() {
        this.score++;
        document.querySelector('.score span').innerHTML = this.score + '';
    }

    addTime() {
        this.timePlayed++;
        document.querySelector('.time span').innerHTML = this.timePlayed + '';
    }

    makeDed() {
        const overlay = this.add.renderTexture(0, 0, Shnaik.width, Shnaik.height);
        overlay.fill(0x000000, 0.1);
        const text = this.add.text(0, 0, 'is ded =(');
        Phaser.Display.Align.In.Center(text, overlay);

    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: Shnaik.width,
    height: Shnaik.height,
    scene: Shnaik,
    parent: 'shnaik'
};

new Phaser.Game(config);
