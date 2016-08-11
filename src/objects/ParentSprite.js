/*
 * ParentSprite
 * ====
 *
 */

export default class ParentSprite extends Phaser.Sprite {

  constructor(game){
    super(game);
  }

  reset(x, y, health, width = 50, key, frame){
    super.reset(x, y, health);
    //this.body.reset();

    this.loadTexture(key, frame);
    this.setAreaMaintainAspectRatio(width);
    this.body.velocity.x = 20;
  }

  update(){
    this.game.debug.body(this,'rgba(255,0,0,0.8)');
    //this.game.debug.bodyInfo(this, this.x, this.y);
  }

  //give the sprite a new size while maintaining aspec
  setAreaMaintainAspectRatio(width){
    this.width = ParentSprite.dp(width);
    this.scale.y = Math.abs(this.scale.x);

    //due to the weird way Phaser works, this.body.setSize (and many other things) will cause the bounding box to be the wrong size after the Sprite's width/height changes
    //Instead, completely re-enable the body phsics on this in order for the bounding box to match the image size
    this.game.physics.arcade.enableBody(this);
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
