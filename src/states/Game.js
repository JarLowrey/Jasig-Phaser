/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Bonus from '../objects/Sprites/Bonus';
import Unit from '../objects/Sprites/Unit';
import Ship from '../objects/Sprites/Ship';
import Protagonist from '../objects/Sprites/Protagonist';
import SpritePooling from '../objects/Sprites/SpritePooling';

import WaveHandler from '../objects/WaveHandler';

import Stars from '../objects/UI/Stars';
import IconText from '../objects/UI/IconText';

export default class Game extends Phaser.State {

  create() {
    this.stars = new Stars(this.game);
    this.stars.showStars();

    this.spritePools = new SpritePooling(this.game);
    this.spritePools.initPool('friendlyShip',Ship);
    this.spritePools.initPool('enemyShip',Ship);
    this.spritePools.initPool('enemyUnit',Unit);
    this.spritePools.initPool('Bonus',Bonus);

    this.game.time.advancedTiming = true;

    this.hero = new Protagonist(this.game);
    this.hero.reset(this.game.world.centerX, this.game.world.height );

    this.game.waveHandler = new WaveHandler(this.game, this.hero);
    this.game.waveHandler.startWave();

    this.totalMoney = new IconText(this.game,20,'score', 'text', 'icons', 'coins', 0);
    this.totalMoney.right = this.game.waveHandler.progressBar.right;
    this.totalMoney.top = this.game.waveHandler.progressBar.bottom;
    this.incrementGameResources(0);
  }

  update(){
    this.game.waveHandler.updateProgressBar();

    this.collisionDectection();
  }

  incrementGameResources(amt){
    this.game.waveHandler.earnedResources += amt;
    this.totalMoney.setText( this.game.nFormatter(this.game.waveHandler.earnedResources + this.game.getConfig('resources') ) );
  }

  collisionDectection(){
    const friendlyShips = this.spritePools.getPool('friendlyShip');
    const enemyShips = this.spritePools.getPool('enemyShip');
    const enemyUnits = this.spritePools.getPool('enemyUnit');
    const bonuses = this.spritePools.getPool('Bonus');

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
