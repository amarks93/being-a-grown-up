import Phaser, { Game } from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';

import TitleScene from './scenes/TitleScene.js';
import MainScene from './scenes/MainScene.js';

const config = {
  width: 256,
  height: 256,
  backgroundColor: '#723d46',
  type: Phaser.AUTO,
  parent: 'being-a-grown-up',
  scene: [TitleScene, MainScene],
  scale: {
    zoom: 2,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterCollision',
      },
    ],
  },
};

new Game(config);
