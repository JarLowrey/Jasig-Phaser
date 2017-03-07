/*
 * ParentSprite
 * ====
 *
 */

export default class ParentSprite extends Phaser.Sprite {
  static className() {
    return 'ParentSprite';
  }
  constructor(game) {
    super(game);

    this.game.physics.arcade.enableBody(this);
    this.anchor.setTo(0.5, 0.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
  }

  reset(entityType, entityName) {
    super.reset(0, 0);
    this.info = this.game.entities[entityType][entityName];

    //set size+texture
    this.loadTexture(this.info.key || 'sprites', this.info.frame);
    ParentSprite.setSize(this, this.info.width, this.info.isCircular, this.info.height);

    //set body related variables
    let v = this.info.velocity || {
      'max': {
        'x': 0,
        'y': 0
      },
      'min': {
        'x': 0,
        'y': 0
      }
    };
    let xSpd = Math.random() * (v.max.x - v.min.x) + v.min.x;
    let ySpd = Math.random() * (v.max.y - v.min.y) + v.min.y;
    this.body.velocity.set(xSpd, ySpd);
    this.body.maxVelocity.setTo(600, 600);
    this.body.drag.setTo(0, 0);

    //other properties
    this.alpha = 1;
    this.angle = 0;

    //set default position
    this.top = 0;
    this.x = (this.game.world.width * 0.9 + 0.1) * Math.random();
  }
  update() {
    //debug body
    if (!this.alive) {
      return;
    }
    /*
    this.game.debug.geom(this.getBounds());
    this.game.debug.body(this, 'rgba(255,0,0,0.8)');
    this.game.debug.bodyInfo(this, this.x, this.y);
    */
  }

  kill() {
    super.kill();
    this.startNextStateIfPossible();
  }

  startNextStateIfPossible() {
    const allEnemiesDead = this.game.waveHandler.isWaveOver() && this.game.waveHandler.livingEnemiesTotalValue() === 0;
    const noActiveBonuses = this.game.spritePools.getPool('Bonus').getFirstAlive() === null;
    const waveOver = allEnemiesDead && noActiveBonuses;
    //console.log(this.game.waveHandler.isWaveOver(), this.game.waveHandler.livingEnemiesTotalValue(), noActiveBonuses, this.game.spritePools.getPool('Bonus').getFirstAlive())

    if (this.amPlayer()) {
      this.game.state.start('GameOver', this.game.getRandomStateTransitionOut(), this.game.getRandomStateTransitionIn());
    } else if (waveOver) {
      this.game.data.saveGame();
      this.game.data.saveStats();
      this.game.state.start('Store', this.game.getRandomStateTransitionOut(), this.game.getRandomStateTransitionIn());
    }
  }

  amPlayer() {
    return this === this.game.data.play.player;
  }

  static setSize(sprite, width, isCircular = false, height) {
    sprite.width = width;
    if (height) {
      sprite.height = height;
    } else {
      sprite.scale.y = sprite.scale.x;
    }

    if (sprite.body) {
      //body must be divided by scale, does not do this automatically
      const scaledWidth = Math.abs(sprite.width / sprite.scale.x);
      const scaledHeight = Math.abs(sprite.height / sprite.scale.y);

      //Set body size a bit smaller than the actual sprite due to using Arcade Physics - don't want user to get mad that 2 bodies 'didnt really touch'
      const widthShrinkAmount = 0; //this.game.integers.bodyShrink;
      const heightShrinkAmount = 0; //this.game.integers.bodyShrink;

      if (isCircular) {
        //not sure why this works...but it does!
        const radius = sprite.width / 2;
        sprite.body.setCircle(radius, (scaledWidth - radius) / 2, (scaledHeight - radius) / 2);
      } else {
        sprite.body.setSize(scaledWidth - widthShrinkAmount, scaledHeight - heightShrinkAmount,
          widthShrinkAmount / 2, heightShrinkAmount / 2);
      }

      const myArea = width * height;
      const playerArea = sprite.game.data.play.player.width * sprite.game.data.play.player.height;
      sprite.body.mass = myArea / playerArea;
    }
  }

  serialize() {
    let serializedInfo = {
      width: this.width,
      height: this.height,

      alpha: this.alpha,
      angle: this.angle,

      x: this.x,
      y: this.y,

      className: this.constructor.className(),
      frame: this.frameName
    };

    if (this.body) {
      serializedInfo.body = {
        velocity: {
          x: this.body.velocity.x,
          y: this.body.velocity.y
        }
      };
    }

    return serializedInfo;
  }

  deserialize(info) {
    ParentSprite.setSize(this, info.width, info.isCircular, info.height);
    this.x = info.x;
    this.y = info.y;

    if (this.body) {
      this.body.velocity.x = info.body.velocity.x;
      this.body.velocity.y = info.body.velocity.y;
    }

    this.alpha = info.alpha;
  }

}
