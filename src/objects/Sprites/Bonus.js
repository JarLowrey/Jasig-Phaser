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

    this.bonusType = bonusType;
  }

  static bonusCollision(hero, bonus){
    const bonusApplication = Bonus[this.bonusType];
    bonusApplication(hero);

    bonus.kill();
  }

  /*
    STATIC METHODS FOR BONUS APPLICATION UPON COLLISION
    NOTE: name of the bonus function must exactly match the name of the entry in the 'bonuses.json' hash
  */

  static heal(){
    return function(hero){
      hero.heal(hero.maxHealth / 2);
    };
  }

  static money(){
    return function(hero){
      hero.heal(hero.maxHealth / 2);
    };
  }

}
