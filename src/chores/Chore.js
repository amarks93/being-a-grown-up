import Phaser from 'phaser';

export default class Chore extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    let { scene, chore } = data;
    super(scene.matter.world, chore.x, chore.y, 'chores', chore.type);
    this.scene.add.existing(this);
    this.name = chore.type;
    this.health = 3;

    this.sound = this.scene.sound.add(this.name);

    this.x += this.width / 2;
    this.y -= this.width / 2;
    this.y = this.y + 3.2;
    const { Bodies } = Phaser.Physics.Matter.Matter;
    var circleCollider = Bodies.circle(this.x, this.y, 3, {
      isSensor: false,
      label: 'collider',
    });

    if (
      chore.type === 'female_dress1' ||
      chore.type === 'female_dress2' ||
      chore.type === 'male_shirt1' ||
      chore.type === 'male_pants6'
    ) {
      circleCollider = Bodies.circle(this.x, this.y, 8, {
        isSensor: false,
        label: 'collider',
      });
    }
    if (chore.type === 'cup') {
      this.height = 4;
      circleCollider = Bodies.circle(this.x, this.y - 4, 3, {
        isSensor: false,
        label: 'collider',
      });
    }
    this.setExistingBody(circleCollider);
    this.setStatic(true);
  }

  get done() {
    return this.health <= 0;
  }

  updateItemHealthDisplay(health) {
    const healthDisplay = document.getElementById('item-num');
    if (!undefined) {
      healthDisplay.innerText = health;
    } else {
      healthDisplay.innerText = 0;
    }
  }

  action = () => {
    if (this.sound) this.sound.play();
    this.health--;
    this.updateItemHealthDisplay(this.health);

    console.log(`Chore Item: ${this.name}, Health: ${this.health}`);
  };

  static preload(scene) {
    scene.load.atlas('chores', 'assets/images/chores.png', 'assets/images/chores_atlas.json');
    scene.load.audio('poop', 'assets/audio/litter.wav');
    scene.load.audio('cup', 'assets/audio/dishes.wav');
    scene.load.audio('plate', 'assets/audio/dishes.wav');
    scene.load.audio('female_dress1', 'assets/audio/clothes.wav');
    scene.load.audio('female_dress2', 'assets/audio/clothes.wav');
    scene.load.audio('male_shirt1', 'assets/audio/clothes.wav');
    scene.load.audio('male_pants6', 'assets/audio/clothes.wav');
    scene.load.audio('oranges', 'assets/audio/chew.wav');
    scene.load.audio('apples-bowl', 'assets/audio/chew.wav');
  }
}
