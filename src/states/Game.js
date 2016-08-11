/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import ParentSprite from '../objects/Sprites/ParentSprite';
import Bullet from '../objects/Sprites/Bullet';
import Bonus from '../objects/Sprites/Bonus';
import Unit from '../objects/Sprites/Unit';
import Ship from '../objects/Sprites/Ship';
import Protagonist from '../objects/Sprites/Protagonist';

import Stars from '../objects/Stars';
import UiHandler from '../objects/UiHandler';

export default class Game extends Phaser.State {

  create() {
    this.stars = new Stars(this.game);
    this.stars.showStars();

    this.game.time.advancedTiming = true;


    this.UiHandler = new UiHandler(this.game);

    this.hero = new Protagonist(this.game);
    this.hero.reset(this.game.world.centerX, this.game.world.height );

    var enemy = ParentSprite.getNewSprite(Ship, false, this.game);
    enemy.reset('diagonal', this.game.world.centerX, this.game.world.centerY, false);

    //var bonus = Bonus.getNewBonus();
  }

  update(){
    //this.UiHandler.showGold(10,window.innerWidth * Math.random(),this.game.world.centerY);

    this.collisionDectection();
  }

  collisionDectection(){
    this.game.physics.arcade.overlap(
      ParentSprite.getPool(Ship, true, this.game),        //friendly ships
      ParentSprite.getPool(Unit, false, this.game),       //enemy units
      Unit.unitCollision, null, this);

    this.game.physics.arcade.overlap(
      ParentSprite.getPool(Ship, true, this.game),        //friendly ships
      ParentSprite.getPool(Ship, false, this.game),       //enemy ships
      Unit.unitCollision, null, this);

    this.game.physics.arcade.overlap(
      ParentSprite.getPool(Bullet, true, this.game, 25),  //friendly bullets
      ParentSprite.getPool(Unit, false, this.game),       //enemy units
      Bullet.bulletCollision, null, this);

    this.game.physics.arcade.overlap(
      ParentSprite.getPool(Bullet, true, this.game, 25),  //friendly bullets
      ParentSprite.getPool(Ship, false, this.game),       //enemy ships
      Bullet.bulletCollision, null, this);

    this.game.physics.arcade.overlap(
      ParentSprite.getPool(Bullet, true, this.game, 25),  //enemy bullets
      ParentSprite.getPool(Ship, false, this.game),       //friendly ships
      Bullet.bulletCollision, null, this);

    this.game.physics.arcade.overlap(
      this.hero,                                          //hero
      ParentSprite.getPool(Bonus, null, this.game),       //bonuses
      Bonus.bonusCollision, null, this);
  }

  render(){
    this.game.debug.text('fps='+this.game.time.fps || '--', this.game.world.centerX,100, '#ffff00');
  }

}
