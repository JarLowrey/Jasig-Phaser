/*
 * Stars
 * ====
 *
 */

export default class Stars {

  static getStarManager(game){
    if(!Stars.singleton){
      Stars.singleton = new Stars(game);
      Stars.singleton.setupStars();
    }

    return Stars.singleton;
  }

  constructor(game){
    this.game = game;

    this.maxNumParticles = 100;
    this.lifespan = 10000;
    this.emitFreq = 150;
    this.numEmitPer = 2;
  }

  //private function to create and setup particle properties
  setupStars(){
    //	Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
    var emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, this.maxNumParticles);

    // A particle can emit from anywhere in the range (emitter.x - emitter.width, emitter.x + emitter.width), same for y&height
    emitter.width = this.game.world.width ;
    emitter.height = this.game.world.height ;

    emitter.makeParticles('sprites','star');

    emitter.minParticleSpeed.set(0, 5);
    emitter.maxParticleSpeed.set(0, 15);
    emitter.gravity = 0;

    emitter.setRotation(0, 0);
    emitter.setAlpha(0.75, 1);

    emitter.minParticleScale = 0.05;
    emitter.maxParticleScale = 0.1;

    /*
    emitter.forEach(function(particle) {  // tint every particle white
      particle.tint = 0xff0000;
    });
    */

    this.emitter = emitter;
  }


  //expose showStars on a global level so other states can take advantage of it
  showStars(){
    //set some stars onto the screen all at once to populate it a bit before flow can get established
    this.emitter.start(true, this.lifespan / 2, null, this.maxNumParticles / 2);
    //flow(lifespan, frequency, quantity, total, immediate)
    this.emitter.flow(this.lifespan, this.emitFreq, this.numEmitPer, -1, true);
  }
}

//ES6 does not support static vars, thus need define it this way (Note: must be after the class)
Stars.singleton = null;
