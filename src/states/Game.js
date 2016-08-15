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

import WaveHandler from '../objects/WaveHandler';

import Stars from '../objects/Stars';
import UiHelper from '../objects/UI/UiHelper';

export default class Game extends Phaser.State {

  create() {
    this.stars = new Stars(this.game);
    this.stars.showStars();

    this.game.time.advancedTiming = true;


    this.UiHelper = new UiHelper(this.game);

    this.hero = new Protagonist(this.game);
    this.hero.reset(this.game.world.centerX, this.game.world.height );

    this.game.waveHandler = new WaveHandler(this.game);
    this.game.waveHandler.startWave();
  }

  update(){
    //this.UiHelper.showGold(10,window.innerWidth * Math.random(),this.game.world.centerY);
    this.game.waveHandler.updateProgress();
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
      ParentSprite.getPool(Bullet, false, this.game, 25),  //enemy bullets
      ParentSprite.getPool(Ship, true, this.game),       //friendly ships
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
