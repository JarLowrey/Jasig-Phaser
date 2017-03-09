/*
 * Explosion
 * ====
 *
 */
import ParentSprite from './Parents/ParentSprite';

export default class Explosion extends Phaser.Sprite {

  constructor(game) {
    super(game);

    //this.game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);
    this.loadTexture('sprites');

    this.explosions = [
      this.game.animations.sonicExplosion,
      this.game.animations.regularExplosion
    ];

    ParentSprite.setupAnimations(this, this.explosions);
  }

  reset(x, y) {
    super.reset(x, y);

    let randAnimationJSON = this.explosions[Math.floor(Math.random() * this.explosions.length)];
    this.play(randAnimationJSON.key, null, null, true);

    this.width = 75;
    this.height = 75;
    this.angle = Math.random() * 360;
  }

}
