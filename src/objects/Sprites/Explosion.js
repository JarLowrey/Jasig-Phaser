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
      this.game.animations.regularExplosion,
      this.game.animations.sonicExplosion,
    ];

    ParentSprite.setupAnimations(this, this.explosions);
  }

  reset(x, y) {
    super.reset(x, y);

    this.width = 50;
    this.height = 50;

    let randAnimationJSON = this.explosions[Math.floor(Math.random() * this.explosions.length)];
    this.play(randAnimationJSON.key, null, null, true);
  }

}
