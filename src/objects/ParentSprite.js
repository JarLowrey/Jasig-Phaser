/*
 * ParentSprite
 * ====
 *
 */

export default class ParentSprite extends Phaser.Sprite {

  constructor(game){
    super(game);

    this.game.physics.arcade.enableBody(this);
  }

  reset(x, y, health, width, key, frame){
    super.reset(x,y,health);

    this.loadTexture(key, frame);
    this.setAreaMaintainAspectRatio(width);
  }

  //give the sprite a new size while maintaining aspec
  setAreaMaintainAspectRatio(width){
    this.width = ParentSprite.dp(width);
    this.scale.y = Math.abs(this.scale.x);

    //set body to new sprite size, otherwise collisions (and other physics actions) will be messed up
    if(this.body) {
      this.body.setSize(this.width,this.height);
    }
    console.log(this.width, this.height, this.body.width, this.body.height);
  }

  //density independent pixels
  static dp(length, heightOrWidth, parent){
    var dp;

    if(typeof length =='string' && length.includes('%')){ //string that contains '%'
      dp = (heightOrWidth == 'h') ? ParentSprite.percentHeightToPixels(length, parent) : ParentSprite.percentWidthToPixels(length, parent);
    }
    else{ dp = length * window.devicePixelRatio;}

    return dp;
  }

  static percentWidthToPixels(percent, parent){
    const width = (parent) ? parent.width : window.innerWidth;

    return width * (parseFloat(percent) / 100.0);
  }

  static percentHeightToPixels(percent, parent){
    const height = (parent) ? parent.height : window.innerHeight;

    return height * (parseFloat(percent) / 100.0);
  }


}
