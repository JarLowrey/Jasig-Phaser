

export default class ProgressBar extends Phaser.Group{

  constructor(game,
      source = null,//Phaser.Sprite | Phaser.Image | Phaser.Text | Phaser.BitmapData | Phaser.RenderTexture | Image | HTMLCanvasElement | string
      width = 100, height = 12, barShrinksTowardsLeft = true, outlineLength = 4,
      fontStyle, text,
      backgroundBarColor = '0x651828',
      outlineBarColor = '0xffffff',
      barColor = [{'threshold':25, 'color': '0xff0000'}, {'threshold':50, 'color': '0xffff00'}, {'threshold':100, 'color': '0x00ff00'}]
    ){
    super(game);

    this.strokeLength = outlineLength;
    this.barShrinksTowardsLeft = barShrinksTowardsLeft;

    //create bar background source. Assign a default if one is not set in constructor. The bar must have a diff source as cropping modifies the underlying texture
    if(!source) source = this.getBarBitmapData(width, height);
    var barSource = this.game.add.bitmapData(width - this.strokeLength, height - this.strokeLength);
    barSource.copy(source,0,0,width,height,0,0,width - this.strokeLength, height - this.strokeLength);

    //Create sprites. The bars must use different texture, otherwise the cropping in setPercent will affect them all
    this.outlineSprite = this.game.add.sprite(0, 0, source);
    this.outlineSprite.anchor.setTo(0.5,0.5);
    this.addChild(this.outlineSprite);

    this.bgSprite = this.game.add.sprite(0, 0, source);
    this.bgSprite.width = width - this.strokeLength;
    this.bgSprite.height = height - this.strokeLength;
    this.bgSprite.anchor.setTo(0.5,0.5);
    this.addChild(this.bgSprite);

    this.barSprite = this.game.add.sprite(this.getBarXPosition(), 0, barSource);
    this.barSprite.anchor.setTo(this.getBarXAnchor(),0.5);
    this.addChild(this.barSprite);

    this.text = this.game.add.text(0,0);
    this.text.anchor.setTo(0.5,0.4);
    this.addChild(this.text);

    //set sprite properties
    this.setBarColor(null, backgroundBarColor, outlineBarColor, barColor);
    this.setTextStyle(fontStyle);
    this.setText(text);
    this.setPercent(100); //this also sets bar color, not that the bars are defined
    this.setTextSizeToBarSize();
  }

  makePressable(onPressedFunction, bgPressedColor, outlinePressedColor){
    this.bgPressed = this.game.add.sprite(0, 0, this.getBarBitmapData(this.width - this.strokeLength, this.height - this.strokeLength));
    this.bgPressed.anchor.setTo(0.5,0.5);
    this.addChildAt(this.bgPressed, 0);
    this.bgPressed.tint = bgPressedColor;

    this.outlinePressed = this.game.add.sprite(0, 0, this.getBarBitmapData(this.width, this.height));
    this.outlinePressed.anchor.setTo(0.5,0.5);
    this.addChildAt(this.outlinePressed, 0);
    this.outlinePressed.tint = outlinePressedColor;

    //register click listeners
    this.setAll('inputEnabled', true);
    this.callAll('events.onInputDown.add', 'events.onInputDown', this.onDown, this);
    this.callAll('events.onInputUp.add', 'events.onInputUp', this.onUp, this);
    this.pressFunction = onPressedFunction;
  }
  onUp(){
    this.swapChildren(this.bgPressed, this.bgSprite);
    this.swapChildren(this.outlinePressed, this.outlineSprite);

    this.pressFunction();
  }
  onDown(){
    this.swapChildren(this.bgPressed, this.bgSprite);
    this.swapChildren(this.outlinePressed, this.outlineSprite);
  }

  setWidth(newWidth){
    this.outlineSprite.width = newWidth;
    this.bgSprite.width = newWidth - this.strokeLength;
    this.barSprite.width = newWidth - this.strokeLength;

    this.barSprite.x = this.getBarXPosition(newWidth);
  }
  setHeight(newHeight){
    this.outlineSprite.height = newHeight;
    this.bgSprite.height = newHeight;
    this.barSprite.height = newHeight;
    this.setTextSizeToBarSize();
  }

  getBarXAnchor(){
    return (this.barShrinksTowardsLeft) ? 0 : 1;
  }
  getBarXPosition(newWidth){
    if(!newWidth) newWidth = this.width;
    return (this.barShrinksTowardsLeft) ? - newWidth / 2 + this.strokeLength / 2: newWidth / 2 - this.strokeLength / 2;
  }

  static densityPixels(pixel){
    return pixel * window.window.devicePixelRatio;
  }

  setText(text = ''){
    this.text.setText(text);
  }

  setTextStyle(fontStyle = this.game.fonts['progress_bar']){
    this.fontStyle = fontStyle;

    this.text.setStyle(this.fontStyle);
    this.setTextSizeToBarSize();
  }

  setTextSizeToBarSize(){
    this.text.fontSize = this.height  * 0.45;
//    this.text.height = this.outlineSprite.height  * 0.9;
//    this.text.scale.x = this.text.scale.y;
  }

  /*
    Edit this function to change the appearance of the bars. Peruse the bitmap data API for reference
    http://phaser.io/docs/2.6.1/Phaser.BitmapData.html
  */
  getBarBitmapData(width, height){
    const radius = height / 2;
    var bmd = this.game.add.bitmapData(width, height);

    bmd.circle(radius, radius, radius,'#ffffff');
    bmd.circle(width - radius, radius, radius,'#ffffff');

    bmd.ctx.fillStyle = '#ffffff'; //bar must have pure white bitmap data in order to be tinted effectively
    bmd.ctx.beginPath();
    bmd.ctx.rect(radius, 0, width - radius * 2, height);
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
  setBarColor(progressPercentageRemaining = 0, backgroundBarColor, outlineBarColor, barColor ){
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
    //artifacts show up if you crop <=0. Thus hide it and return instead
    this.barSprite.visible = newPercent > 0;
    if( !this.barSprite.visible ) return;

    if(newPercent > 100){ newPercent = 100; }

    this.setBarColor(newPercent);

    //Create the cropping parameters: set the new, cropped image properties.
    const newWidth = (newPercent / 100) * this.width;
    const x = (this.barShrinksTowardsLeft) ? 0 : this.width - newWidth;
    const cropRect = new Phaser.Rectangle(x, 0, newWidth, this.height);

    //perform the crop!
    this.barSprite.crop(cropRect);
  }
}
