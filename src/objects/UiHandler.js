/*
 * UiHandler
 * ====
 *
 */

import IconText from '../objects/IconText';
import ParentSprite from '../objects/ParentSprite';

export default class UiHandler {


  constructor(game){
    this.game = game;

    this.goldTextPool = new Phaser.Group(game);
  }

  showGold(amt,x,y){
    var goldText = this.getGoldTextFromPool();
    goldText.setText(amt);

    goldText.x = x;
    goldText.y = y;

    goldText.goldTween.start();
  }

  getGoldTextFromPool(){
    var goldText = this.goldTextPool.getFirstExists(false);

    if(!goldText){
      goldText = new IconText(this.game, this.game.world.centerX, this.game.world.centerY, 20,
        'score', 'text', 'sprites', 'resources', 'left', 0);

      goldText.goldTween = this.game.add.tween(goldText).to({y:'-'+UiHandler.dp(25), //tween it relative to the current position. Needs to be a string
       alpha: 0}, 750, Phaser.Easing.Linear.In);
      goldText.goldTween.onComplete.add(this.goldTextOver, this);

      this.goldTextPool.add(goldText);
    }else{
      goldText.reset();
    }

    return goldText;
  }

  goldTextOver(goldText){
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

    width = ParentSprite.dp(width, 'w');
    height = ParentSprite.dp(height, 'h');

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

}
