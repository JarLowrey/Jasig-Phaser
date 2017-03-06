/* jshint esversion: 6 */

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
    this.events.onOutOfBounds.add(this.silentKill, this);
  }

  reset(entityType, entityName) {
    super.reset();
    this.info = this.game.entities[entityType][entityName];

    //set size+texture
    this.loadTexture(this.info.key || 'sprites', this.info.frame);
    this.setSize(this.info.width, this.info.isCircular, this.info.height);

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

  silentKill() {
    this.kill();
  }
  kill() {
    this.startNextStateIfPossible();
    super.kill();
  }
  startNextStateIfPossible() {
    const allEnemiesDead = this.game.waveHandler.isWaveOver() && this.game.waveHandler.livingEnemiesTotalValue() === 0;
    const noActiveBonuses = this.game.spritePools.getPool('Bonus').getFirstAlive() === null;
    const gameOver = allEnemiesDead && noActiveBonuses;

    if (this.amPlayer()) {
      this.game.state.start('GameOver', this.game.getRandomStateTransitionOut(), this.game.getRandomStateTransitionIn());
    } else if (gameOver) {
      this.game.state.start('Store', this.game.getRandomStateTransitionOut(), this.game.getRandomStateTransitionIn());
      this.game.waveHandler.saveWaveValues();
    }
  }

  amPlayer() {
    return this == this.game.data.play.player;
  }

  setSize(width, isCircular = false, height) {
    this.width = width;
    if (height) {
      this.height = height;
    } else {
      this.scale.y = this.scale.x;
    }

    if (this.body) {
      //body must be divided by scale, does not do this automatically
      const scaledWidth = Math.abs(this.width / this.scale.x);
      const scaledHeight = Math.abs(this.height / this.scale.y);

      //Set body size a bit smaller than the actual sprite due to using Arcade Physics - don't want user to get mad that 2 bodies 'didnt really touch'
      const widthShrinkAmount = scaledWidth * 0; //this.game.integers.bodyShrink;
      const heightShrinkAmount = scaledHeight * 0; //this.game.integers.bodyShrink;

      if (isCircular) {
        const radius = (scaledWidth + scaledHeight) / 2;
        this.body.setCircle(radius, (scaledWidth - radius) / 2, (scaledHeight - radius) / 2);
      } else {
        this.body.setSize(scaledWidth - widthShrinkAmount, scaledHeight - heightShrinkAmount,
          widthShrinkAmount / 2, heightShrinkAmount / 2);
      }

      const myArea = width * height;
      const playerArea = this.game.data.play.player.width * this.game.data.play.player.height;
      this.body.mass = myArea / playerArea;
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

      className: this.className(),
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
    this.setSize(info.width, info.height);
    this.x = info.x;
    this.y = info.y;

    if (this.body) {
      this.body.velocity.x = info.body.velocity.x;
      this.body.velocity.y = info.body.velocity.y;
    }

    this.alpha = info.alpha;
  }

}
