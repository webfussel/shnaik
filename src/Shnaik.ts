import 'phaser';
import 'firebase/analytics';
import {MAIN_GAME_CONFIG} from './GameConfig';
import MainMenu from './scenes/MainMenu';
import firebase from 'firebase/app';
import 'firebase/analytics';
import firebaseConfig from '../firebase.config';

firebase.initializeApp(firebaseConfig);
firebase.analytics();


const config = {
    type: Phaser.AUTO,
    width: MAIN_GAME_CONFIG.width(),
    height: MAIN_GAME_CONFIG.height(),
    scene: MainMenu,
    backgroundColor: '#125555',
    parent: 'shnaik'
};

new Phaser.Game(config);
