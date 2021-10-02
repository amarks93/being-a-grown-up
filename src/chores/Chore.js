import Phaser from 'phaser';

export default class Chore extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    let { scene, chore } = data;
    super(scene.matter.world, chore.x, chore.y, 'chores', chore.type);
    this.scene.add.existing(this);
    this.x += this.width / 2;
    this.y -= this.width / 2;
    this.y = this.y + 3.2;
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    var circleCollider = Bodies.circle(this.x, this.y, 8, {
      isSensor: false,
      label: 'collider',
    });
    if (chore.type === 'cup') {
      circleCollider = Bodies.circle(this.x, this.y, 3, {
        isSensor: false,
        label: 'collider',
      });
    }
    this.setExistingBody(circleCollider);
    this.setStatic(true);
    // this.add.existing(this);
  }

  static preload(scene) {
    scene.load.atlas(
      'chores',
      'assets/images/chores.png',
      'assets/images/chores_atlas.json'
    );
  }
}
