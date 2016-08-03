/*
 * UiHandler
 * ====
 *
 */

 import IconText from '../objects/IconText';

export default class UiHandler {


  constructor(game){
    this.game = game;

    this.goldTextPool = new Phaser.Group(game);
  }

  showGold(amt,x,y){
    var goldText = this.getGoldTextFromPool();
    goldText.setText(amt);

    goldText.x = x;
    goldText.y = y

    goldText.goldTween.start();
  }

  getGoldTextFromPool(){
    var goldText = this.goldTextPool.getFirstExists(false);

    if(!goldText){
      goldText = new IconText(this.game, this.game.world.centerX, this.game.world.centerY, 20,
        "score", "text", "sprites", "resources", "left", 0);

      goldText.goldTween = this.game.add.tween(goldText).to({y:'-'+UiHandler.dp(25), //tween it relative to the current position. Needs to be a string
       alpha: 0}, 750, Phaser.Easing.Linear.In);
      goldText.goldTween.onComplete.add(this.goldTextOver, this);

      this.goldTextPool.add(goldText);
    }else{
      goldText.revive();
    }

    return goldText;
  }

  goldTextOver(goldText, tween){
    goldText.kill();
    //this.game.global.score += goldText.score
  }




  static addImage(game, x, y, key, frameName, width, height){
    if( !(width || height) ){
      const imgName = (frameName && frameName != '') ? frameName : key;
      const loadingBarDimen = game.dimen[imgName];
      width = loadingBarDimen.width;
      height = loadingBarDimen.height;
    }

    width = UiHandler.dp(width, 'w');
    height = UiHandler.dp(height, 'h');

    var img = game.add.image(x,y,key,frameName);
    img.width = width;

    if(height){
      img.height = height;
    }else{
      img.scale.y = img.scale.x;
    }

    img.anchor.setTo(0.5,0.5);

    return img;
  }

  //density independent pixels
  static dp(length, heightOrWidth, parent){
    var dp;

    if(typeof length =='string' && length.includes('%')){ //string that contains '%'
      dp = (heightOrWidth == 'h') ? UiHandler.percentHeightToPixels(length, parent) : UiHandler.percentWidthToPixels(length, parent);
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
