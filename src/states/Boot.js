/*
 * Boot state
 * ==========
 *
 * The first state of the game, responsible for setting up some Phaser
 * features. Adjust the game appearance, number of input pointers, screen
 * orientation handling etc. using this game state.
 */

import assets from '../assets';

export default class Boot extends Phaser.State {

  preload() {
    // Point the Phaser Asset Loader to where your game assets live.
    this.load.path = 'assets/';

    // Initialize physics engines here. Remember that Phaser builds including
    // Arcade Physics have it enabled by default.
    //this.physics.arcade.OVERLAP_BIAS = 10;

    // Adjust how many pointers Phaser will check for input events.
    this.input.maxPointers = 2;

    // Set the alignment of the game canvas within the page.
    this.scale.pageAlignHorizontally = true;

    // Adjust the scaling mode of the game canvas.
    // Example: If you're developing a pixel-art game, set it to 'USER_SCALE'.
    this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;

    // When using 'USER_SCALE' scaling mode, use this method to adjust the
    // scaling factor.
    //this.scale.setUserScale(2);

    // Uncomment the following line to adjust the rendering of the canvas to
    // crisp graphics. Great for pixel-art!
    //Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    // Uncomment this line to disable smoothing of textures.
    //this.stage.smoothed = false;

    // If the game canvas loses focus, keep the game loop running.
    this.stage.disableVisibilityChange = true;

    // Load the graphical assets required to show the splash screen later,
    // using the asset pack data.
    this.load.pack('boot', null, assets);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

    //setup functions that you'll want globally
    this.game.nFormatter = function(num, digits = 1) { //source: http://stackoverflow.com/questions/9461621/how-to-format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900-in-javascrip
      var si = [{
          value: 1E18,
          symbol: 'E'
        }, {
          value: 1E15,
          symbol: 'P'
        }, {
          value: 1E12,
          symbol: 'T'
        }, {
          value: 1E9,
          symbol: 'G'
        }, {
          value: 1E6,
          symbol: 'M'
        }, {
          value: 1E3,
          symbol: 'k'
        }],
        rx = /\.0+$|(\.[0-9]*[1-9])0+$/,
        i;
      for (i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
          return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
        }
      }
      return num.toFixed(digits).replace(rx, '$1');
    }.bind(this);

    this.game.between = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    this.game.random = function(min, max) {
      return (Math.random() * (max - min) + min);
    };

    this.game.addBgImg = function(key, frame) {
      let img = this.game.add.image(0, 0, key, frame);
      img.width = Math.max(img.width, this.game.world.width);
      img.height = Math.max(img.height, this.game.world.height);
      return img;
    }.bind(this);
  }

  onLoadComplete() {
    //create variables that are required in the preload state
    this.game.fonts = this.game.cache.getJSON('font_styles');

    // After applying the first adjustments and loading the splash screen
    // assets, move to the next game state.
    this.state.start('Preload');
  }

}
