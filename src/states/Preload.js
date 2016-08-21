/*
 * Preload state
 * =============
 *
 * Takes care of loading the main game assets, including graphics and sound
 * effects, while displaying a splash screen with a progress bar, showing how
 * much progress were made during the asset load.
 */

import assets from '../assets';
import UiHelper from '../objects/UI/UiHelper';

export default class Preload extends Phaser.State {

  preload() {
    this.minSplashScreenShowTime = 0; //seconds

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.showSplashScreen();
    this.load.pack('game', null, assets);

    this.initConfig();
  }

  create() {
    // Here is a good place to initialize plugins that depend on any game
    // asset. Don't forget to `import` them first. Example:
    //this.add.plugin(MyPlugin/*, ... initialization parameters ... */);
  }

  // --------------------------------------------------------------------------

  initConfig(){
    const configsToDefaultToZero = [
      'gunLevel', 'damageLevel', 'fireRateLevel', 'defenseLevel', 'scoreBoostLevel', 'allyLevel',
      'resources', 'waveNumber'
    ];
    var needToInitConfig = false;

    //loop through each config entry. Initialize if any are uninitialized
    configsToDefaultToZero.forEach(
      function(element){
        const config = this.game.getConfig(element);
        needToInitConfig = needToInitConfig || isNaN(config) || config == null || typeof config == 'undefined';
      }.bind(this)
    );

    //already initialized: exit the function now
    if(!needToInitConfig) return;

    //still here! Need to initialize
    configsToDefaultToZero.forEach(
      function(element){
        this.game.storeConfig(element, 0);
      }.bind(this)
    );
  }

  showSplashScreen() {
    //add logo and loading bar
    UiHelper.addImage(this.game, this.game.world.centerX, this.game.world.centerY * 0.5, 'preload_sprites', 'j_tron_labs_logo');
    const loadingBar =  UiHelper.addImage(this.game, this.game.world.centerX, this.game.world.centerY * 1.5, 'progress-bar'); //new Image(this.game, this.game.world.centerX ,this.game.world.centerY,'progress');
    this.load.setPreloadSprite(loadingBar);

    //show splash screen for a few seconds. then call onLoadComplete
    this.splashScreenOver = false;
    this.game.time.events.add(Phaser.Timer.SECOND * this.minSplashScreenShowTime, this.finishedSplashScreen, this);
  }

  finishedSplashScreen(){
    this.splashScreenOver = true;

    this.moveOnToNextState();
  }

  onLoadComplete(){
    this.game.units = this.game.cache.getJSON('units');
    this.game.ships = this.game.cache.getJSON('ships');
    this.game.weapons = this.game.cache.getJSON('weapons');
    this.game.bullets = this.game.cache.getJSON('bullets');
    this.game.bonuses = this.game.cache.getJSON('bonuses');

    this.moveOnToNextState();
  }

  moveOnToNextState(){
    if(this.splashScreenOver && this.load.hasLoaded){ //splash screen has been shown for a minimum amount of time, and loading assets is finished
      this.state.start('Store');
    }
  }

}
