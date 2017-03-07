/*
 * ParentSprite
 * ====
 *
 */
import ParentSprite from './Parents/ParentSprite';

export default class Bonus extends ParentSprite {
  static className() {
    return 'Bonus';
  }

  constructor(game) {
    super(game);
  }

  reset(bonusType, x, y) {
    super.reset('bonuses', bonusType);

    this.x = x;
    this.y = y;
  }

  kill() {
    super.kill();
  }

  static bonusCollision(hero, bonus) {
    bonus.bonusFunction(hero);

    bonus.kill();
  }
  update() {
    //debug body
    if (!this.alive) {
      return;
    }

    //this.game.debug.geom(this.getBounds());
    //this.game.debug.body(this, 'rgba(255,0,0,0.8)');
  }

  /*
    METHODS FOR BONUS FUNCTIONS APPLIED UPON COLLISION
  */

  bonusFunction(hero) {
    return Bonus[this.info.bonusFunctionName](hero); //choose the bonus function on this object by using JSON and call it
  }

  static applyHeal(hero) {
    hero.heal(hero.maxHealth / 2);
  }

  static addResources() {
    //add money
  }

}
