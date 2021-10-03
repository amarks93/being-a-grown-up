import Phaser from 'phaser';
import Nina from '../players/Nina';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  preload() {
    Nina.preload(this);
    this.load.image('title', 'assets/images/Title.png');
    this.load.image('start', 'assets/images/start.png');
    this.load.audio('opening', 'assets/audio/opening.wav');
  }

  playMusic(music, bool) {
    if (bool === true) {
      music.play();
    } else {
      music.stop();
    }
    this.bool = !this.bool;
  }

  create() {
    this.matter.world.setBounds();

    this.bool = true;
    this.music = this.sound.add('opening');
    this.playMusic(this.music, this.bool);

    const screen = this.add.image(0, 0, 'title');
    screen.setOrigin(0, 0);

    // to incorporate in the future
    const start = this.add.image(100, 215, 'start');
    start.setOrigin(0, 0);
    start.setScale(0.25, 0.25);
    start.depth = 100;
    start.visible = false;

    this.player = new Nina({
      scene: this,
      x: 128,
      y: 90,
      texture: 'nina',
      frame: '01-walk-both-front',
    });

    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      think: Phaser.Input.Keyboard.KeyCodes.O,
      sweat: Phaser.Input.Keyboard.KeyCodes.K,
      exclaim: Phaser.Input.Keyboard.KeyCodes.L,
    });

    this.inputKeys = this.input.keyboard.addKeys({
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      play: Phaser.Input.Keyboard.KeyCodes.P,
    });
  }

  update() {
    this.player.update();
    const music = this.music;
    // let bool = this.bool
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.play)) {
      this.playMusic(music, this.bool);
    }

    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.space)) {
      this.playMusic(music, false);
      this.scene.start('MainScene');
    }
  }
}
