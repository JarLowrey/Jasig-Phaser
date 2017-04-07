/*
 * Preload state
 * =============
 *
 * Takes care of loading the main game assets, including graphics and sound
 * effects, while displaying a splash screen with a progress bar, showing how
 * much progress were made during the asset load.
 */

import assets from '../assets';

import GameData from '../objects/Data/GameData';
import * as PhaserUI from 'phaser-ui';

import 'phaser-state-transition'; //only needs an import to setup ^.^
import 'phaser-kinetic-scrolling-plugin';

export default class Preload extends Phaser.State {

  preload() {
    this.minSplashScreenShowTime = this.game.cache.getJSON('preloadJSON').minSplashScreenShowTime; //seconds
    this.showSplashScreen();

    this.game.load.onFileComplete.add(this.fileComplete, this);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.pack('game', null, assets);

    this.copyDataToCache();
  }

  create() {
    // Here is a good place to initialize plugins that depend on any game
    // asset. Don't forget to `import` them first.
    this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

    this.game.kineticScrolling.configure({
      horizontalScroll: false,
      verticalScroll: true,
      horizontalWheel: false,
      verticalWheel: true
    });

    this.game.getRandomStateTransitionOut = function() {
      //return true; //ClearWorld param to normal state.start function
      return Phaser.Plugin.StateTransition.Out.SlideTop;
    };
    this.game.getRandomStateTransitionIn = function() {
      return false; //ClearCache param to normal state.start function
    };
  }

  // --------------------------------------------------------------------------

  async copyDataToCache() {
    this.savedGameLoaded = false;

    this.game.data = new GameData(this.game);
    await this.game.data.load();

    this.savedGameLoaded = true;
    this.checkPreloadFinishedAndTryStartNextState();
  }

  fileComplete(progress) {
    this.loadingBar.progress = progress / 100;
  }


  showSplashScreen() {
    //add logo and loading bar
    this.logo = this.add.sprite(0, 0, 'preload_sprites', 'j_tron_labs_logo');
    this.logo.width = 50;
    this.logo.scale.y = this.logo.scale.x;
    this.logo.anchor.setTo(0.5, 0.5);
    this.logo.x = this.game.world.centerX;
    this.logo.y = this.game.world.height / 4;

    this.loadingBar = new PhaserUI.ProgressBar(this.game, this.game.world.width / 2, 20, null, 2);
    this.loadingBar.x = this.game.world.centerX;
    this.loadingBar.y = this.game.world.centerY;

    //show splash screen for a few seconds. then call onLoadComplete
    this.splashScreenOver = false;
    this.game.time.events.add(this.minSplashScreenShowTime, this.finishedSplashScreen, this);
  }

  finishedSplashScreen() {
    this.splashScreenOver = true;

    this.checkPreloadFinishedAndTryStartNextState();
  }

  onLoadComplete() {
    this.game.entities = {
      'units': this.game.cache.getJSON('units'),
      'ships': this.game.cache.getJSON('ships'),
      'bonuses': this.game.cache.getJSON('bonuses')
    };
    this.game.animations = this.game.cache.getJSON('animations');
    this.game.dimen = this.game.cache.getJSON('dimen');

    this.checkPreloadFinishedAndTryStartNextState();
  }

  checkPreloadFinishedAndTryStartNextState() {
    if (this.splashScreenOver && this.load.hasLoaded && this.savedGameLoaded) { //splash screen has been shown for a minimum amount of time, and loading assets is finished
      this.state.start('Menu');
    }
  }

}
