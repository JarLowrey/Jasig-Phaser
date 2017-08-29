/*
 * ParentSprite
 * ====
 *
 */
import Deserialize from '../../DataDrivenEntities/Deserialize';
import Serialize from '../../DataDrivenEntities/Serialize';

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

  reset(entityType, entityName, info) {
    super.reset(0, 0);
    if (info) {
      this.info = info;
    } else {
      this.info = this.game.entities[entityType][entityName];
    }

    Deserialize.apply(this, this.info);
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
    if (this.game.waveHandler.canStartNextState()) {
      this.game.waveHandler.endWave();
    }
  }

  amPlayer() {
    return this === this.game.data.play.player;
  }

  static setupAnimations(sprite, animations) {
    for (let animation of animations) {
      sprite.animations.add(animation.key, animation.frames, animation.frameRate, animation.looped || false);
    }
  }

  static setSize(sprite, width, isCircular = false, height) {
    if (width) {
      sprite.width = width;
      sprite.scale.y = sprite.scale.x;
    } else if (height) {
      sprite.height = height;
      sprite.scale.x = sprite.scale.y;
    } else {
      throw new Error('No sizes provided');
    }

    if (sprite.body) {
      //body must be divided by scale, does not do this automatically
      const scaledWidth = Math.abs(sprite.width / sprite.scale.x);
      const scaledHeight = Math.abs(sprite.height / sprite.scale.y);

      //Set body size a bit smaller than the actual sprite due to using Arcade Physics - don't want user to get mad that 2 bodies 'didnt really touch'
      const widthShrinkAmount = 0; //this.game.integers.bodyShrink;
      const heightShrinkAmount = 0; //this.game.integers.bodyShrink;

      /*
      if (isCircular) {
        //not sure why this works...but it does!
        const radius = sprite.width / 2;
        sprite.body.setCircle(radius, (scaledWidth - radius) / 2, (scaledHeight - radius) / 2);
      } else {
        sprite.body.setSize(scaledWidth - widthShrinkAmount, scaledHeight - heightShrinkAmount,
          widthShrinkAmount / 2, heightShrinkAmount / 2);
      }
      */
      sprite.body.setSize(scaledWidth - widthShrinkAmount, scaledHeight - heightShrinkAmount,
        widthShrinkAmount / 2, heightShrinkAmount / 2);

      /*
            const myArea = width * height;
            const playerArea = sprite.game.data.play.player.width * sprite.game.data.play.player.height;
            sprite.body.mass = myArea / playerArea;
            */
    }
  }

  serialize() {
    let serializedInfo = Serialize.serialize(this);
    serializedInfo.className = this.constructor.className();
    
    return serializedInfo;
  }

  deserialize(info) {
    Deserialize.apply(this, info);
  }

}
