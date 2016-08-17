/*
 * WaveHandler
 * ====
 *
 */
import ParentSprite from '../objects/Sprites/ParentSprite';
import Unit from '../objects/Sprites/Unit';
import Ship from '../objects/Sprites/Ship';

import ProgressBar from '../objects/UI/ProgressBar';

export default class WaveHandler {

  constructor(game){
    this.game = game;

    this.wave = 10;

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
    this.waveTimer = game.time.create(false);

    const countDownJson = this.game.dimen['game_countdown'];
    this.progressBar = new ProgressBar(game, 0,0, countDownJson.width, countDownJson.height, countDownJson.strokeLength, '0xcccccc', '0xffffff', '0x75c9e5');
    this.progressBar.flip();
    this.progressBar.setPositionOfRightEdge(this.game.world.width - countDownJson.x, countDownJson.y);
  }

  updateProgress(){
    const percentLeft = this.waveTimer.duration / WaveHandler.timeNeededToEndWave(this.wave) ;
    this.progressBar.setPercent(percentLeft * 100);
    this.progressBar.setText(Math.round(this.waveTimer.duration / 1000) );
  }

  startWave(){
    this.spawn();

    //timer to end the wave
    this.waveTimer.add(WaveHandler.timeNeededToEndWave(this.wave), this.endWave, this);
    this.waveTimer.start();
    this.waveIsOver = false;
  }

  endWave(){
    this.spawnTimer.stop();
    this.wave++;
    //TODO save wave variables and stats to local storage
    this.waveIsOver = true;
  }

  isWaveOver(){
    return this.waveIsOver;
  }

  spawn(){
    var enemyTotal = this.livingEnemiesTotalValue();
    const enemiesThresholdValue = this.spawnValueThresholdForAdvancedEnemies();
    const meteorsThresholdValue = this.spawnValueThresholdForMeteors();


    if( enemyTotal < enemiesThresholdValue + meteorsThresholdValue ){
      this.spawnSprite('meteor', Unit);
      enemyTotal += ParentSprite.scaleValueByWave(this.wave, this.game.units.meteor.resourceValue);
    }
    if( enemyTotal < enemiesThresholdValue ){
      const enemyInfo = this.chooseEnemy();
      this.spawnSprite( enemyInfo.newEnemyJsonName, enemyInfo.newEnemyClass );
    }

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

  //min time = 20s, max time = 90s, wave increments time by 2.5s
  static timeNeededToEndWave(wave){
    var time = 1000 * 20;
    time += wave * 2.5;
    return Math.min(time, 1000 * 90);
  }

  livingEnemiesTotalValue(){
    var total = 0;
    const addToTotal = function(child){
      if(!child.isFriendly) total += child.getValue();
    };

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

  //about how much basic meteor 'Power' can be on screen at once in a given wave.
  //'power' is approximated by value
  spawnValueThresholdForMeteors(){
    const basicUnitValue = ParentSprite.scaleValueByWave(this.wave, this.game.units.meteor.resourceValue);
    var numBasicUnits = this.wave / this.wavesUntilOneMoreMeteorCanAppearOnScreen + this.minMeteors;
    numBasicUnits = Math.min(numBasicUnits, this.maxMeteors);

    return numBasicUnits * basicUnitValue;
  }

}
