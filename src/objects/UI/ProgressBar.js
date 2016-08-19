

export default class ProgressBar extends Phaser.Group{

  constructor(game, width = 500, height = 100, barShrinksTowardsLeft = true, outlineLength = 8,
      backgroundBarColor = '0x651828', outlineBarColor = '0xffffff', barColor = [{'threshold':25, 'color': '0xff0000'}, {'threshold':50, 'color': '0xffff00'}, {'threshold':100, 'color': '0x00ff00'}],
      fontStyle = game.fonts['progress_bar'], text =''){
    super(game);

    this.strokeLength = outlineLength;
    this.barShrinksTowardsLeft = barShrinksTowardsLeft;

    //Create sprites. The bars must use different texture, otherwise the cropping in setPercent will affect them all
    this.outlineSprite = this.game.add.sprite(0, 0, this.getRectangleBitmapData(width, height));
    this.outlineSprite.anchor.setTo(0.5,0.5);
    this.addChild(this.outlineSprite);

    this.bgSprite = this.game.add.sprite(0, 0, this.getRectangleBitmapData(width, height));
    this.bgSprite.anchor.setTo(0.5,0.5);
    this.addChild(this.bgSprite);

    this.barSprite = this.game.add.sprite(this.getBarXPosition(), 0, this.getRectangleBitmapData(width, height));
    this.barSprite.anchor.setTo(this.getBarXAnchor(),0.5);
    this.addChild(this.barSprite);

    this.text = this.game.add.text(0,0);
    this.text.anchor.setTo(0.5,0.4);
    this.addChild(this.text);

    //set sprite properties
    this.setBarColor(null, backgroundBarColor, outlineBarColor, barColor);
    this.setTextStyle(fontStyle);
    this.setText(text);
    this.setSize(width, height, outlineLength);
    this.setPercent(100); //this also sets bar color, not that the bars are defined
  }

  setSize(width, height, outlineLength, parent){
    //set width/height variables
    if(typeof width == 'string' && width.charAt(width.length-1) =='%'){     width = this.percentWidthToPixels(width, parent); }
    else if(typeof width == 'number'){                                      width = ProgressBar.densityPixels(width);}
    if(typeof height == 'string' && height.charAt(height.length-1) =='%'){  height = this.percentHeightToPixels(height, parent); }
    else if(typeof height == 'number'){                                     height = ProgressBar.densityPixels(height);}
    if(typeof outlineLength == 'number'){                                   this.strokeLength = ProgressBar.densityPixels(outlineLength); }

    this.barSprite.width = width - this.strokeLength;
    this.barSprite.height = height - this.strokeLength;

    this.bgSprite.width = width - this.strokeLength;
    this.bgSprite.height = height - this.strokeLength;

    this.outlineSprite.width = width;
    this.outlineSprite.height = height;

    this.setTextSizeToBarSize();
  }

  flip(){
    this.barShrinksTowardsLeft = !this.barShrinksTowardsLeft;

    this.barSprite.anchor.x = this.getBarXAnchor();
    this.barSprite.scale.x *= -1;
    this.barSprite.x = this.getBarXPosition();

  }

  getBarXAnchor(){
    return (this.barShrinksTowardsLeft) ? 0 : 1;
  }
  getBarXPosition(){
    return (this.barShrinksTowardsLeft) ? - this.width / 2 + this.strokeLength / 2 : this.width / 2 - this.strokeLength / 2;
  }

  static densityPixels(pixel){
    return pixel * window.window.devicePixelRatio;
  }
  percentWidthToPixels(percent, parent = this.game.world){
    return parent.width * (parseFloat(percent) / 100.0);
  }
  percentHeightToPixels(percent, parent = this.game.world){
    return parent.height * (parseFloat(percent) / 100.0);
  }

  setText(text){
    this.text.setText(text);
  }

  setTextStyle(fontStyle){
    this.fontStyle = fontStyle;

    this.text.setStyle(this.fontStyle);
    this.setTextSizeToBarSize();
  }

  setTextSizeToBarSize(){
    this.text.fontSize = this.height / 2;
  }

  getRectangleBitmapData(width, height){
    var bmd = this.game.add.bitmapData(width, height);
    bmd.ctx.fillStyle = '#ffffff'; //bar must have pure white bitmap data in order to be tinted effectively
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fill();

    return bmd;
  }

  /**
    Set background and foreground bar colors to a variety of options: Static or dynamic (depends upon progressPercentageRemaining)
    Examples:
      this.setBarColor();
        In this example, bars are set to default colors. progressPercentageRemaining defaults to 0 value.
      this.setBarColor(100);
        In this example, bars are set to default colors. If this.barColor is not static, the correct color will be chosen using progressPercentageRemaining.
      this.setBarColor(this_param_is_ignored, '0x123456', '0xffffff');
        In this example, background bar is bluish, foreground bar is white
      this.setBarColor(100, '0xffffff', [{'threshold':50, 'color': '0xff0000'}, {'threshold':100, 'color': '0x00ff00'}]);
        In this example, background bar is white, foreground is green at 50-100% and red at 0-50%. Since progress% is 100, the bar is green. You can have any number of threshold/colorCombos.
  */
  setBarColor(progressPercentageRemaining = 0, backgroundBarColor, outlineBarColor, barColor){
    //optional arguments to change colors
    if(backgroundBarColor) this.backgroundBarColor = backgroundBarColor;
    if(outlineBarColor) this.outlineBarColor = outlineBarColor;
    if(barColor) this.barColor = barColor;

    //allow Bar's color to change at different progressPercentageRemaining values
    if(typeof this.barColor != 'string'){
      this.barColor.sort(function(a,b){ return a.threshold - b.threshold; } );

      //loop thru all the elements in the barColor array, starting at the smallest theshold. If progressPercentageRemaining is under a threshold, set the color and exit the loop.
      for(var i=0; i<this.barColor.length; i++){
        const barColorInstance = this.barColor[i];
        if(progressPercentageRemaining <= barColorInstance.threshold){
          this.barSprite.tint = barColorInstance.color;
          break;
        }
      }
    }
    //Bar has a static color
    else{
      this.barSprite.tint = this.barColor;
    }

    this.outlineSprite.tint = this.outlineBarColor;
    this.bgSprite.tint = this.backgroundBarColor;
  }

  setPercent(newPercent){
    if(newPercent < 0)       { newPercent = 0; }
    else if(newPercent > 100){ newPercent = 100; }

    this.setBarColor(newPercent);

    const newWidth = (newPercent / 100) * this.width;


    const cropRect = new Phaser.Rectangle(0, 0, newWidth, this.height);
    this.barSprite.crop(cropRect);
    this.barSprite.x = this.getBarXPosition();
  }
}
