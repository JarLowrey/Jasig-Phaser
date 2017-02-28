/* jshint esversion: 6 */

/*
 * ParentSprite
 * ====
 *
 */

import ExplosionRecycler from '../../UI/ExplosionRecycler';


export default class ParentSprite extends Phaser.Sprite {
  static getClassName() {
    return 'ParentSprite';
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
    return this == this.game.play.player;
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
      const playerArea = this.game.play.player.width * this.game.play.player.height
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
      }
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
