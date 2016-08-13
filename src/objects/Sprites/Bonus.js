/*
 * ParentSprite
 * ====
 *
 */
import ParentSprite from '../Sprites/ParentSprite';

export default class Bonus extends ParentSprite {

  constructor(game){
    super(game);
  }

  reset(bonusType, enemy){
    this.bonusInfo = this.game.bonuses[bonusType];
    super.reset(enemy.x, enemy.y, 1, 50, 'sprites', this.bonusInfo.frame);

    this.body.velocity.y = ParentSprite.dp(100);
  }

  static bonusCollision(hero, bonus){
    bonus.bonusFunction(hero);

    bonus.kill();
  }

  /*
    METHODS FOR BONUS FUNCTIONS APPLIED UPON COLLISION
  */

  bonusFunction(hero){
    return Bonus[this.bonusInfo.bonusFunctionName](hero); //choose the bonus function and call it
  }

  static applyHeal(hero){
    hero.heal(hero.maxHealth / 2);
  }

  static addResources(){
    //add money
  }

}
