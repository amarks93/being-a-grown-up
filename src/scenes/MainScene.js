/* eslint-disable no-undef */
import Phaser from 'phaser';
import Nina from '../players/Nina';
import Chore from '../chores/Chore';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  // where you load images
  preload() {
    // console.log('preload');
    Nina.preload(this);
    Chore.preload(this);
    this.load.image('indoorTiles', 'assets/tiles/Indoor Tileset.png');
    this.load.image('bedroomTiles', 'assets/tiles/Bedroom Tileset.png');
    this.load.image('petTiles', 'assets/tiles/Pet Tileset.png');
    this.load.image('kitchenTiles', 'assets/tiles/Kitchen Tileset.png');
    this.load.image('bathroomTiles', 'assets/tiles/Bathroom Tileset.png');
    // this.load.image('chores', 'assets/images/chores.png');
    this.load.tilemapTiledJSON('indoors', 'assets/tiles/Indoors.json');
  } //end preload

  // create game objects
  create() {
    console.log(this);
    this.matter.world.setBounds();
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
    });
  } //end create

  addChores() {
    const chores = this.indoors.getObjectLayer('Chores');
    chores.objects.forEach((chore) => {
      new Chore({ scene: this, chore });
    });
  }

  update() {
    this.player.update();
    // console.log('X', this.player.x);
    // console.log('Y', this.player.y);
  }

  // update called 60 frames per second
}
