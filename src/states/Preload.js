/*
 * Preload state
 * =============
 *
 * Takes care of loading the main game assets, including graphics and sound
 * effects, while displaying a splash screen with a progress bar, showing how
 * much progress were made during the asset load.
 */

import assets from '../assets';
import UiHandler from '../objects/UiHandler';

export default class Preload extends Phaser.State {

  preload() {
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.showSplashScreen();
    this.load.pack('game', null, assets);

  }

  create() {
    // Here is a good place to initialize plugins that depend on any game
    // asset. Don't forget to `import` them first. Example:
    //this.add.plugin(MyPlugin/*, ... initialization parameters ... */);
  }

  // --------------------------------------------------------------------------

  showSplashScreen() {
    //add logo and loading bar
    UiHandler.addImage(this.game, this.game.world.centerX, this.game.world.centerY * 0.5, 'preload_sprites', 'j_tron_labs_logo');
    const loadingBar =  UiHandler.addImage(this.game, this.game.world.centerX, this.game.world.centerY * 1.5, 'progress-bar'); //new Image(this.game, this.game.world.centerX ,this.game.world.centerY,'progress');
    this.load.setPreloadSprite(loadingBar);


    //show splash screen for a few seconds. then call onLoadComplete
    this.splashScreenOver = false;
    this.game.time.events.add(Phaser.Timer.SECOND * 0, this.finishedSplashScreen, this);
  }

  finishedSplashScreen(){
    this.splashScreenOver = true;

    this.moveOnToNextState();
  }

  onLoadComplete(){
    this.game.ships = this.game.cache.getJSON('ships');
    this.game.guns = this.game.cache.getJSON('guns');
    this.game.bullets = this.game.cache.getJSON('bullets');
    this.game.bonuses = this.game.cache.getJSON('bonuses');

    this.moveOnToNextState();
  }

  moveOnToNextState(){
    if(this.splashScreenOver && this.load.hasLoaded){ //splash screen has been shown for a minimum amount of time, and loading assets is finished
      this.state.start('Menu');
    }
  }

}
