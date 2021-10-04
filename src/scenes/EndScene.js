import Phaser from 'phaser';

export default class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene');
  }

  preload() {
    this.load.image('game-over', 'assets/images/game-over.png');
    this.load.audio('opening', 'assets/audio/opening.wav');
  }

  create() {
    const screen = this.add.image(0, 0, 'game-over');
    screen.setOrigin(0, 0);

    this.bool = true;
    this.music = this.sound.add('opening');
    this.playMusic(this.music, this.bool);

    this.inputKeys = this.input.keyboard.addKeys({
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      play: Phaser.Input.Keyboard.KeyCodes.P,
    });
  }

  playMusic(music, bool) {
    if (bool === true) {
      music.play();
    } else {
      music.stop();
    }
    this.bool = !this.bool;
  }

  update() {
    const music = this.music;

    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.play)) {
      this.playMusic(music, this.bool);
    }

    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.space)) {
      this.playMusic(music, false);
      document.getElementById('score-num').innerText = '0';
      document.getElementById('time-num').innerText = '3:00';
      document.getElementById('item-num').innerText = '0';
      // @todo need to find a better way to do this
      for (let i = 0; i < 10; i++) {
        clearInterval(i);
      }
      this.scene.start('TitleScene');
    }
  }
}
