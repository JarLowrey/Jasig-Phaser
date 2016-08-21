/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import ParentSprite from '../objects/Sprites/ParentSprite';
//import Bullet from '../objects/Sprites/Bullet';
import Bonus from '../objects/Sprites/Bonus';
import Unit from '../objects/Sprites/Unit';
import Ship from '../objects/Sprites/Ship';
import Protagonist from '../objects/Sprites/Protagonist';

import WaveHandler from '../objects/WaveHandler';

import ProgressPie from '../objects/UI/ProgressPie';

import Stars from '../objects/UI/Stars';
import UiHelper from '../objects/UI/UiHelper';

export default class Game extends Phaser.State {

  create() {
    this.stars = new Stars(this.game);
    this.stars.showStars();

    this.game.time.advancedTiming = true;


    this.UiHelper = new UiHelper(this.game);

    this.hero = new Protagonist(this.game);
    this.hero.reset(this.game.world.centerX, this.game.world.height );

    this.game.waveHandler = new WaveHandler(this.game, this.hero);
    this.game.waveHandler.startWave();

    new ProgressPie(this.game, this.game.world.centerX, this.game.world.centerY);
  }

  update(){
    //this.UiHelper.showGold(10,window.innerWidth * Math.random(),this.game.world.centerY);
    this.game.waveHandler.updateProgress();
    this.collisionDectection();
  }

  collisionDectection(){
    const friendlyShips = ParentSprite.getPool(Ship, true, this.game);
    const enemyShips = ParentSprite.getPool(Ship, false, this.game);

    //const friendlyUnits = ParentSprite.getPool(Unit, true, this.game);
    const enemyUnits = ParentSprite.getPool(Unit, false, this.game);

    const bonuses = ParentSprite.getPool(Bonus, null, this.game);

    this.game.physics.arcade.overlap(
      friendlyShips,
      enemyUnits,
      Unit.unitCollision, null, this);

    this.game.physics.arcade.overlap(
      friendlyShips,
      enemyShips,
      Unit.unitCollision, null, this);

    this.overlapBullets(enemyShips, friendlyShips);
    this.overlapBullets(friendlyShips, enemyUnits);
    this.overlapBullets(friendlyShips, enemyShips);

    this.game.physics.arcade.overlap(
      this.hero,
      bonuses,
      Bonus.bonusCollision, null, this);
  }

  //each ship has a list of weapons, and each weapon has its own pool of bullets
  overlapBullets(ships, overlapGroup){
    for(var i=0;i<ships.length;i++){
      const ship = ships.getChildAt(i);

      if(ship.alive){
        ship.weapons.forEach(function(weapon){
          this.game.physics.arcade.overlap(weapon.bullets, overlapGroup, Ship.bulletCollision, null, this);
        }.bind(this));
      }
    }
  }

  render(){
    this.game.debug.text('fps='+this.game.time.fps || '--', this.game.world.centerX,100, '#ffff00');
  }

}
