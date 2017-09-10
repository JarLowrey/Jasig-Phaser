/*
 * Sprite
 * ====
 *
 */
export default class MoveController {

  constructor(sprite) {
    this.sprite = sprite;
    this.game = sprite.game;

    document.addEventListener('dblclick', this.toggleAllowRotation.bind(this));

    this.minSpeed = 500;
    this.maxAccel = Math.abs(this.sprite.width) * 10;
    this.minDist = Math.abs(this.sprite.width);

    this.keys = {
      left: [Phaser.Keyboard.LEFT, Phaser.Keyboard.A],
      right: [Phaser.Keyboard.RIGHT, Phaser.Keyboard.D],
      up: [Phaser.Keyboard.UP, Phaser.Keyboard.W],
      down: [Phaser.Keyboard.DOWN, Phaser.Keyboard.S],
      fire: [Phaser.Keyboard.SPACE]
    };
  }

  move() {
    const activePointerPos = this.game.input.activePointer.position;
    const distToPointer = Phaser.Point.distance(this.sprite, activePointerPos);
    const radianToPointer = this.game.physics.arcade.angleBetween(this.sprite, activePointerPos);
    const scale = Phaser.Math.clamp(distToPointer / this.maxAccel, 0, 1) * this.minSpeed;
    let x = Math.cos(radianToPointer) * scale,
      y = Math.sin(radianToPointer) * scale;
    this.sprite.body.velocity.setTo(x, y);

    this.sprite.body.rotation = Phaser.Math.radToDeg(radianToPointer + Math.PI / 2);
  }

  /*
    moveKeyboard() {
      if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        this.sprite.body.rotation -= 5;
      } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.sprite.body.rotation += 5;
      }
    }
  */

  toggleAllowRotation() {
    this.sprite.body.allowRotation = !this.sprite.body.allowRotation;
  }



  /*
    move() {
      const speed = this.getSpeed();

      if (speed > this.minSpeed) {
        //set angle
        const bank = this.sprite.body.velocity.x / this.minSpeed;
        const normalizedAngle = Math.min(Math.abs(bank * 10), 90);
        this.sprite.angle = normalizedAngle * Math.sign(bank);
      } else {
        this.sprite.angle = 0;
      }

      this.game.physics.arcade.moveToPointer(this.sprite, speed);
    }

  getSpeed(activePointer = this.game.input.activePointer) {
    const activePointerPos = activePointer.position;
    const distToPointer = Phaser.Point.distance(this.sprite, activePointerPos);

    var speed = distToPointer * 5;
    speed = Math.max(speed, this.minSpeed); //set a min speed. This causes a shaking effect when still

    return speed;
  }
  */
}
