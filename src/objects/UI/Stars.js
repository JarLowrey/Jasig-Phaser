/* jshint esversion: 6 */

/*
 * Stars
 * ====
 *
 */

export default class Stars {

  constructor(game) {
    this.game = game;

    this.maxNumParticles = 75;
    this.lifespan = 10000;
    this.emitFreq = 150;
    this.numEmitPer = 2;

    this.setupStars();
  }

  //private function to create and setup particle properties
  setupStars() {
    //	Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
    this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, this.maxNumParticles);

    this.setEmitAreaToGameArea();

    this.emitter.makeParticles('sprites', 'circle');

    this.emitter.minParticleSpeed.set(0, 5);
    this.emitter.maxParticleSpeed.set(0, 15);
    this.emitter.gravity.set(0,0);

    this.emitter.setRotation(0, 0);
    this.emitter.setAlpha(0.75, 1);

    this.emitter.minParticleScale = 0.05;
    this.emitter.maxParticleScale = 0.1;

    /*
    this.emitter.forEach(function(particle) {  // tint every particle white
      particle.tint = 0xff0000;
    });
    */
  }

  setEmitAreaToGameArea() {
    this.emitter.x = this.game.world.centerX;
    this.emitter.y = this.game.world.centerY;

    this.emitter.width = this.game.world.width;
    this.emitter.height = this.game.world.height;
  }


  //expose showStars on a global level so other states can take advantage of it
  showStars() {
    //set some stars onto the screen all at once to populate it a bit before flow can get established
    this.emitter.start(true, this.lifespan / 2, null, this.maxNumParticles / 2);
    //flow(lifespan, frequency, quantity, total, immediate)
    this.emitter.flow(this.lifespan, this.emitFreq, this.numEmitPer, -1, true);
  }
}
