import Phaser, { Game } from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import MainScene from './scenes/MainScene.js';
var config = {
  width: 256,
  height: 256,
  backgroundColor: '#723d46',
  type: Phaser.AUTO,
  parent: 'being-a-grown-up',
  scene: [MainScene],
  scale: {
    zoom: 2
  },
  physics: {
    "default": 'matter',
    matter: {
      debug: true,
      gravity: {
        y: 0
      }
    }
  },
  plugins: {
    scene: [{
      plugin: PhaserMatterCollisionPlugin,
      key: 'matterCollision',
      mapping: 'matterCollision'
    }]
  }
};
new Game(config);