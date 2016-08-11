/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Stars from '../objects/Stars';
import Gun from '../objects/Gun';
import Unit from '../objects/Unit';
import Ship from '../objects/Ship';
import Protagonist from '../objects/Protagonist';
import UiHandler from '../objects/UiHandler';

export default class Game extends Phaser.State {

  create() {
    this.stars = new Stars(this.game);
    this.stars.showStars();

    this.game.time.advancedTiming = true;


    this.UiHandler = new UiHandler(this.game);

    this.hero = new Protagonist(this.game);
    this.hero.reset(this.game.world.centerX, this.game.world.height );

    var enemy = Ship.getNewShip();
    enemy.reset(this.game.world.centerX, this.game.world.centerY, 100, 50, 'sprites', 'ship_enemy_array_shooter', false);
  }

  update(){
    //this.UiHandler.showGold(10,window.innerWidth * Math.random(),this.game.world.centerY);

    //these groups are created in their respective classes' static init functions
    this.game.physics.arcade.overlap(Ship.friendlyShips, Unit.enemyUnits, Unit.unitCollision, null, this);
    this.game.physics.arcade.overlap(Ship.friendlyShips, Ship.enemyShips, Unit.unitCollision, null, this);
    this.game.physics.arcade.overlap(Gun.friendlyBullets, Unit.enemyUnits, Gun.bulletCollision, null, this);
    this.game.physics.arcade.overlap(Gun.friendlyBullets, Ship.enemyShips, Gun.bulletCollision, null, this);
    this.game.physics.arcade.overlap(Gun.enemyBullets, Ship.friendlyShips, Gun.bulletCollision, null, this);
  }

  render(){
    this.game.debug.text('fps='+this.game.time.fps || '--', this.game.world.centerX,100, '#ffff00');
  }

}
