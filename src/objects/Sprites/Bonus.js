/* jshint esversion: 6 */

/*
 * ParentSprite
 * ====
 *
 */
import ParentSprite from './Parents/ParentSprite';

export default class Bonus extends ParentSprite {
  static getClassName() {
    return 'Bonus';
  }

  constructor(game) {
    super(game);
  }

  reset(bonusType, enemy) {
    super.reset('bonuses', bonusType);

    this.x = enemy.x;
    this.y = enemy.y;

    this.body.velocity.y = ParentSprite.dp(100);
  }

  static bonusCollision(hero, bonus) {
    bonus.bonusFunction(hero);

    bonus.kill();
  }

  /*
    METHODS FOR BONUS FUNCTIONS APPLIED UPON COLLISION
  */

  bonusFunction(hero) {
    return Bonus[this.info.bonusFunctionName](hero); //choose the bonus function and call it
  }

  static applyHeal(hero) {
    hero.heal(hero.maxHealth / 2);
  }

  static addResources() {
    //add money
  }

}
