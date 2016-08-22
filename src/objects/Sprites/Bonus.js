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
    super.reset('bonuses', bonusType, enemy.x, enemy.y);

    this.body.velocity.y = ParentSprite.dp(100);
  }

  static bonusCollision(hero, bonus){
    bonus.bonusFunction(hero);

    bonus.kill();
  }

  kill(){
    super.kill();
    this.startNextStateIfPossible();
  }
  startNextStateIfPossible(stateToStartAfterwards = 'Store'){
    const allEnemiesDead = this.game.waveHandler.isWaveOver() && this.game.waveHandler.livingEnemiesTotalValue() == 0;
    const noActiveBonuses = ParentSprite.getPool(Bonus, null, this.game).getFirstAlive() == null;
    if( this.getClassName() == 'Protagonist' || (allEnemiesDead && noActiveBonuses) ){
      this.game.state.start(stateToStartAfterwards);
      this.game.waveHandler.saveWaveValues();
    }
  }
  /*
    METHODS FOR BONUS FUNCTIONS APPLIED UPON COLLISION
  */

  bonusFunction(hero){
    return Bonus[this.jsonInfo.bonusFunctionName](hero); //choose the bonus function and call it
  }

  static applyHeal(hero){
    hero.heal(hero.maxHealth / 2);
  }

  static addResources(){
    //add money
  }

}
