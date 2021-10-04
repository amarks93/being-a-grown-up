/* eslint-disable no-undef */
import Phaser from 'phaser';
import Nina from '../players/Nina';
import Chore from '../chores/Chore';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.gameOver = false;
  }

  // where you load images
  preload() {
    Nina.preload(this);
    Chore.preload(this);
    this.load.image('indoorTiles', 'assets/tiles/Indoor Tileset.png');
    this.load.image('bedroomTiles', 'assets/tiles/Bedroom Tileset.png');
    this.load.image('petTiles', 'assets/tiles/Pet Tileset.png');
    this.load.image('kitchenTiles', 'assets/tiles/Kitchen Tileset.png');
    this.load.image('bathroomTiles', 'assets/tiles/Bathroom Tileset.png');
    // this.load.image('chores', 'assets/images/chores.png');
    this.load.tilemapTiledJSON('indoors', 'assets/tiles/Indoors.json');
    this.load.audio('dramatic', 'assets/audio/dramatic.wav');
    this.load.audio('opening', 'assets/audio/opening.wav');
  } //end preload

  // create game objects
  create() {
    this.matter.world.setBounds();

    // music
    // this.currentSong = 'dramatic';

    this.bool = true;
    this.music = this.sound.add('dramatic');
    this.music.loop = true;
    this.playMusic(this.music, this.bool);

    // this.openingBool = false;
    this.openingMusic = this.sound.add('opening');
    // this.playMusic(this.openingMusic, this.openingBool);

    const indoors = this.make.tilemap({ key: 'indoors' });
    this.indoors = indoors;

    const indoorTileset = indoors.addTilesetImage('Indoor Tileset', 'indoorTiles', 16, 16, 0, 0);
    const bedroomTileset = indoors.addTilesetImage('Bedroom Tileset', 'bedroomTiles', 16, 16, 0, 0);
    const petTileset = indoors.addTilesetImage('Pet Tileset', 'petTiles', 16, 16, 0, 0);
    const kitchenTileset = indoors.addTilesetImage('Kitchen Tileset', 'kitchenTiles', 16, 16, 0, 0);
    const bathroomTileset = indoors.addTilesetImage(
      'Bathroom Tileset',
      'bathroomTiles',
      16,
      16,
      0,
      0
    );

    const layer1 = indoors.createLayer('Tile Layer 1', indoorTileset, 0, 0); // floors and wallpaper
    const layer2 = indoors.createLayer('Tile Layer 2', [kitchenTileset, indoorTileset], 0, 0); // living room - tv, flower painting, lamps, table
    const layer3 = indoors.createLayer('Tile Layer 3', bedroomTileset, 0, 0); // bedroom - 2 beds
    const layer4 = indoors.createLayer('Tile Layer 4', petTileset, 0, 0); // pet things - cat tree, 3 bowls, 2 pet beds
    const layer5 = indoors.createLayer(
      'Tile Layer 5',
      [kitchenTileset, petTileset, bathroomTileset, bedroomTileset],
      0,
      0
    ); // pet litter boxes, kitchen

    layer1.setCollisionByProperty({ collides: true });
    layer2.setCollisionByProperty({ collides: true });
    layer3.setCollisionByProperty({ collides: true });
    layer4.setCollisionByProperty({ collides: true });
    layer5.setCollisionByProperty({ collides: true });

    this.matter.world.convertTilemapLayer(layer1);
    this.matter.world.convertTilemapLayer(layer2);
    this.matter.world.convertTilemapLayer(layer3);
    this.matter.world.convertTilemapLayer(layer4);
    this.matter.world.convertTilemapLayer(layer5);

    this.player = new Nina({
      scene: this,
      x: 128,
      y: 90,
      texture: 'nina',
      frame: '01-walk-both-front',
    });

    this.addChores();

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

    this.intervalId = setInterval(() => {
      this.updateTime();
    }, 1000);
  } //end create

  addChores() {
    const chores = this.indoors.getObjectLayer('Chores');
    chores.objects.forEach((chore) => {
      new Chore({ scene: this, chore });
    });
  }

  playMusic(music, bool) {
    if (bool === true) {
      music.play();
    } else {
      music.stop();
    }
    // console.log('MUSIC KEY', music.key);
    // if (music.key === 'opening') {
    //   this.currentSong = 'opening';
    //   this.openingBool = !this.openingBool;
    // } else if (music.key === 'dramatic') {
    //   this.currentSong = 'dramatic';
    this.bool = !this.bool;
    // }
  }

  updateTime() {
    this.choresDone();
    let time = document.getElementById('time-num');
    let timeInnerText = time.innerText;
    let timeArray = timeInnerText.split(':');
    let timeInMS = timeArray[0] * 60000 + timeArray[1] * 1000;
    let newTime = timeInMS - 1000;
    let minutes = Math.floor(newTime / 60000);
    let seconds = ((newTime % 60000) / 1000).toFixed(0);
    let zero = seconds < 10 ? '0' : '';
    if (newTime > 0) {
      time.innerText = `${minutes}:${zero}${seconds}`;
      let score = document.getElementById('score-num');
      if (score.innerText >= 230) {
        this.playMusic(this.music, false);
        time.innerText = 'YOU WIN!';
        this.playMusic(this.openingMusic, true);
      }
    } else if (newTime <= 0) {
      time.innerText = 'GAME OVER';
      this.gameOver = true;
      this.playMusic(this.music, false);
    }
  }

  choresDone() {
    const chores = this.indoors.getObjectLayer('Chores');
  }

  update() {
    if (this.gameOver) {
      this.scene.start('EndScene');
      this.gameOver = false;
    }
    this.player.update();

    const music = this.music;
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.play)) {
      this.playMusic(music, this.bool);
    }

    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.space)) {
      this.playMusic(music, false);
      this.playMusic(this.openingMusic, false);
      document.getElementById('score-num').innerText = '0';
      document.getElementById('time-num').innerText = '3:00';
      document.getElementById('item-num').innerText = '0';
      clearInterval(this.intervalId);
      this.scene.start('TitleScene');
    }
  }

  // update called 60 frames per second
}
