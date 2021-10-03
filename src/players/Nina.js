import Phaser from 'phaser';
// eslint-disable-next-line no-unused-vars

export default class Nina extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    let { scene, x, y, texture, frame } = data;
    super(scene.matter.world, x, y, texture, frame);
    this.setScale(0.25, 0.25);

    this.touching = [];
    this.scene.add.existing(this);

    //Thought Bubble
    this.spriteThought = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'items', 3);
    this.spriteThought.setOrigin(0.05, 1.25);
    this.scene.add.existing(this.spriteThought);
    this.spriteThought.visible = false;
    this.spriteThought.depth = 100;

    this.spriteSweat = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'sweat');
    this.spriteSweat.setOrigin(0.05, 1.15);
    this.scene.add.existing(this.spriteSweat);
    this.spriteSweat.visible = false;
    this.spriteSweat.depth = 100;

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;

    // circular collider instead of square - first is collider, second is sensor
    // the num is the radius
    var ninaCollider = Bodies.circle(this.x, this.y, 8, { isSensor: false, label: 'collider' });
    var ninaSensor = Bodies.circle(this.x, this.y, 12, { isSensor: true, label: 'sensor' });
    const compoundBody = Body.create({ parts: [ninaCollider, ninaSensor], frictionAir: 0.35 });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();

    this.CreateChoreCollisions(ninaSensor);
    // this.scene.input.on('')
  }

  static preload(scene) {
    scene.load.atlas('nina', 'assets/sprites/nina.png', 'assets/sprites/nina_atlas.json');
    scene.load.animation('nina_anim', 'assets/sprites/nina_anim.json');
    scene.load.spritesheet('items', 'assets/images/items.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    scene.load.image('sweat', 'assets/images/sweat.png');
  }

  get velocity() {
    return this.body.velocity;
  }

  update() {
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

    this.spriteThought.setPosition(this.x, this.y);
    this.spriteSweat.setPosition(this.x, this.y);
    this.thoughtAppears();
    this.sweatAppears();
  } //end update

  thoughtAppears() {
    let thinking = this.inputKeys.think;
    thinking.type = 'thinking';
    if (Phaser.Input.Keyboard.JustDown(thinking)) {
      this.spriteThought.visible = true;
      this.doChore(thinking.type);
    } else if (thinking.isUp) {
      this.spriteThought.visible = false;
    }
  }

  sweatAppears() {
    let sweating = this.inputKeys.sweat;
    sweating.type = 'sweating';
    if (Phaser.Input.Keyboard.JustDown(sweating)) {
      this.spriteSweat.visible = true;
      this.doChore(sweating.type);
    } else if (sweating.isUp) {
      this.spriteSweat.visible = false;
    }
  }

  CreateChoreCollisions(ninaSensor) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: [ninaSensor],
      callback: (other) => {
        if (other.bodyB.isSensor) return;
        this.touching.push(other.gameObjectB);
        // console.log(this.touching.length, other.gameObjectB.name);
      },
      context: this.scene,
    });

    this.scene.matterCollision.addOnCollideEnd({
      objectA: [ninaSensor],
      callback: (other) => {
        this.touching = this.touching.filter((gameObject) => gameObject != other.gameObjectB);
        // console.log(this.touching.length);
      },
      context: this.scene,
    });
  }

  doChore(type) {
    this.touching = this.touching.filter((gameObject) => gameObject.action && !gameObject.done);
    this.touching.forEach((gameObject) => {
      // console.log('GAMEOBJ***', gameObject.name);
      // console.log('TYPE ***', type);
      // if (gameObject.name === 'poop' || 'cup' || 'plate') && type === 'sweating') {
      //   gameObject.action();
      // } else {
      //   console.log('oops');
      // }
      gameObject.action();
      if (gameObject.done) gameObject.destroy();
    });
  }
}
