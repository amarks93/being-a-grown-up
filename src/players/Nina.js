import Phaser from 'phaser';

export default class Nina extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    let { scene, x, y, texture, frame } = data;
    super(scene.matter.world, x, y, texture, frame);
    this.scene.add.existing(this);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;

    // circular collider instead of square - first is collider, second is sensor
    // the num is the radius
    var ninaCollider = Bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: 'collider',
    });
    var ninaSensor = Bodies.circle(this.x, this.y, 24, {
      isSensor: true,
      label: 'sensor',
    });
    const compoundBody = Body.create({
      parts: [ninaCollider, ninaSensor],
      frictionAir: 0.35,
    });

    this.setExistingBody(compoundBody);
  }

  static preload(scene) {
    scene.load.atlas(
      'nina',
      'assets/sprites/nina.png',
      'assets/sprites/nina_atlas.json'
    );
    scene.load.animation('nina_anim', 'assets/sprites/nina_anim.json');
  }

  get velocity() {
    return this.body.velocity;
  }

  update() {
    // this.anims.play('walk-front', true);
    const speed = 1.0;
    let playerVelocity = new Phaser.Math.Vector2();
    if (this.inputKeys.left.isDown) {
      playerVelocity.x = -1;
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = 1;
    }

    if (this.inputKeys.up.isDown) {
      playerVelocity.y = -1;
    } else if (this.inputKeys.down.isDown) {
      playerVelocity.y = 1;
    }

    //multiply unit vector by the speed
    playerVelocity.normalize();
    playerVelocity.scale(speed);

    this.setVelocity(playerVelocity.x, playerVelocity.y);

    if (this.velocity.x > 0) {
      this.anims.play('walk-right', true);
    } else if (this.velocity.x < 0) {
      this.anims.play('walk-left', true);
    } else if (this.velocity.y > 0) {
      this.anims.play('walk-front', true);
    } else if (this.velocity.y < 0) {
      this.anims.play('walk-back', true);
    } else {
      this.anims.stop();
    }
  } //end update
}
