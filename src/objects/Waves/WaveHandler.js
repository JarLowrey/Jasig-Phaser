/*
 * WaveHandler
 * ====
 *
 */
import ParentSprite from '../../objects/Sprites/ParentSprite';
import Unit from '../../objects/Sprites/Unit';
import Ship from '../../objects/Sprites/Ship';

export default class WaveHandler {

  constructor(game){
    this.game = game;

    this.wave = 0;

    //variables to determine how much stuff can be on screen at once
    this.minMeteors = 4;
    this.minShips = 1;
    this.maxShips = 15;
    this.maxMeteors = 7;
    this.wavesUntilOneMoreShipCanAppearOnScreen = 5;
    this.wavesUntilOneMoreMeteorCanAppearOnScreen = 7;

    //variables to control spawn timing
    this.timeToCheckForNewSpawn = 1000;
    this.spawnTimer = game.time.create(false);
  }

  spawn(){
    const enemyTotal = this.livingEnemiesTotalValue();
    const enemiesThresholdValue = this.spawnValueThresholdForAdvancedEnemies();
    const meteorsThresholdValue = this.spawnValueThresholdForMeteors();

    if( enemyTotal < enemiesThresholdValue + meteorsThresholdValue ){
      const enemyInfo = this.chooseEnemy();
      this.spawnSprite( enemyInfo.newEnemyJsonName, enemyInfo.newEnemyClass );
    }
    if( enemyTotal < this.minShipThreshold() + meteorsThresholdValue ){
      this.spawnSprite('meteor', Unit);
    }
    //console.log(enemyTotal, enemiesThresholdValue , meteorsThresholdValue)

    this.spawnTimer.add(this.timeToCheckForNewSpawn, this.spawn, this);
    this.spawnTimer.start();
  }

  spawnSprite( newEnemyJsonName, newEnemyClass,
      x = this.game.world.width * (Math.random() * 0.9 + 0.1) , //spawn in middle 90% of screen
      y = - ParentSprite.dp(5), //spawn a bit offscreen
      isFriendly = false){

    var newEnemy = ParentSprite.getNewSprite(newEnemyClass, isFriendly, this.game);
    newEnemy.reset(newEnemyJsonName, x, y, isFriendly);

    return newEnemy;
  }

  chooseEnemy(){
    var newEnemyJsonName = 'diagonal';
    var newEnemyClass = Ship;
    return {'newEnemyJsonName': newEnemyJsonName, 'newEnemyClass': newEnemyClass};
  }

  stop(){
    this.spawnTimer.stop();
  }

  //min time = 30s, max time = 90s, wave increments time by 2.5s
  static timeNeededToEndWave(wave){
    var time = Phaser.Second * 30;
    time += wave * 2.5;
    return Math.min(time, Phaser.Second * 90);
  }

  livingEnemiesTotalValue(){
    var total = 0;
    const addToTotal = function(child){ total += child.getValue(); };

    ParentSprite.getPool(Unit, false, this.game).forEachAlive(addToTotal);       //enemy units
    ParentSprite.getPool(Ship, false, this.game).forEachAlive(addToTotal);       //enemy ships

    return total;
  }

  //about how much Ship 'Power' can be on screen at once in a given wave.
  //'power' is approximated by value
  spawnValueThresholdForAdvancedEnemies(){
    const basicShipValue = ParentSprite.scaleValueByWave(this.wave, this.game.ships.diagonal.resourceValue);
    var numBasicShips = this.wave / this.wavesUntilOneMoreShipCanAppearOnScreen + this.minShips;
    numBasicShips = Math.min(numBasicShips, this.maxShips);

    return numBasicShips * basicShipValue;
  }

  //power level of the minimum amount of ships
  minShipThreshold(){
    const basicShipValue = ParentSprite.scaleValueByWave(this.wave, this.game.ships.diagonal.resourceValue);
    return this.minShips * basicShipValue;
  }

  //about how much basic meteor 'Power' can be on screen at once in a given wave.
  //'power' is approximated by value
  spawnValueThresholdForMeteors(){
    const basicUnitValue = ParentSprite.scaleValueByWave(this.wave, this.game.units.meteor.resourceValue);
    var numBasicUnits = this.wave / this.wavesUntilOneMoreMeteorCanAppearOnScreen + this.minMeteors;
    numBasicUnits = Math.min(numBasicUnits, this.maxMeteors);

    return numBasicUnits * basicUnitValue;
  }

}
