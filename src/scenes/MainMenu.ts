import {MAIN_GAME_CONFIG} from "../GameConfig";
import MainGame from "./MainGame";

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('main-menu');
    }

    create() {
        const overlay = this.add.renderTexture(0, 0, MAIN_GAME_CONFIG.width(), MAIN_GAME_CONFIG.height());
        overlay.fill(0x000000, 0.8);

        const startText = this.add.text(0, 0, 'Start Game', {align: 'center', fontSize: "25px"})
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.stop();
                if (!this.scene.get('main-game')) {
                    this.scene.add('main-game', MainGame, false);
                }
                this.scene.launch('main-game')
            }, true);

        /*const optionsText = this.add.text(0, 0, 'Options', {align: 'center', fontSize: "25px"})
            .setInteractive()
            .on('pointerdown', () => {
                console.log('Here will be options');
            }, true);*/

        const menu = this.add.renderTexture(0, 0, 300, 200)
        menu.fill(0x000000, 0);

        Phaser.Display.Align.In.Center(menu, overlay);
        Phaser.Display.Align.In.TopCenter(startText, menu);
        // Phaser.Display.Align.In.Center(optionsText, menu);
    }

    update() {

    }
}