/*
 * Ship
 * ====
 *
 */

import Unit from '../Sprites/Unit';
import ProgressBar from '../../objects/UI/ProgressBar';
import ParentSprite from '../Sprites/ParentSprite';

export default class Ship extends Unit {

  constructor(game){
    super(game);

    this.healthbar = new ProgressBar(this.game);
    this.healthbar.visible = false; //since many sprites are preallocated in pools, you need to manually hide the healthbar upon creation
  }

  update(){
    if(!this.alive) return;

    super.update();
    if(this.getClassName() != 'Protagonist'){
      this.healthbar.x = this.x;
      this.healthbar.y = this.top - this.healthbar.height / 2;
    }
    if(this.canShoot) this.fireWeapons();
  }

  reset(shipName, x, y, isFriendly){
    //super.reset(x, y, this.jsonInfo.health, this.jsonInfo.width, 'sprites', this.jsonInfo.frame, isFriendly, this.jsonInfo.explosionFrame, this.jsonInfo.destYInPercentOfScreen);
    super.reset(shipName, x, y, isFriendly, 'ships');

    //this.healthbar.width = this.width;
    this.healthbar.setPercent(100);
    this.healthbar.setText( this.getHealthbarText() );
    this.healthbar.setWidth(this.width);
    this.healthbar.visible = true;

    this.canShoot = false;

    //add all the weapons from the json file
    this.weapons = [];
    for(var weaponName in this.jsonInfo.weapons){
      const weaponInfo = this.jsonInfo.weapons[weaponName];
      const bulletType = weaponInfo.bulletType || 'default';
      const bulletInfo = this.game.bullets[bulletType];

      var weapon = this.game.add.weapon(30, bulletInfo.key, bulletInfo.frame);
      weapon.weaponName = weaponName;
      weapon.bulletType = bulletType;

      weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
      weapon.bulletSpeed = ParentSprite.dp(300);
      weapon.fireAngle = (this.isFriendly) ? Phaser.ANGLE_UP : Phaser.ANGLE_DOWN;
      weapon.fireRate = weaponInfo.fireRate;
      weapon.autoFire = true;

      weapon.bullets.dmg = 25; //this is

      const offset = (weaponInfo.xPercentOffset || 50) / 100;
      weapon.trackSprite(this, this.width * offset, 0);

      this.weapons.push(weapon);
    }
  }

  getHealthbarText(){
    return Math.max(this.health,0);
  }

  arrivedAtYDestionation(){
    super.arrivedAtYDestionation();

    this.startShooting();
  }

  fireWeapons(){
    this.weapons.forEach(function(weapon){
      const bulletWasFired = weapon.fire();

      if(bulletWasFired && this.game.bullets[weapon.bulletType].isTinted){
        const bullet = weapon.bullets.getChildAt(0); //TODO get the proper bullet, this is not right!!!!!!!!!!!!1111
        bullet.tint = (this.isFriendly) ? '0x00ff00' : '0xff0000'; //friendly is green, enemy is red
      }
    }.bind(this));
  }

  startShooting(){  this.canShoot = true; }
  stopShooting(){   this.canShoot = false; }

  damage(amount){
    super.damage(amount);

    //little tween to show damage occurred
    //const tempAngle = this.angle;
    const resetAngle = function(){ this.angle = 0; }.bind(this);
    const tweenAngle = 10 + 10 * Math.random();
    const tweenTime = 4;
    var tween = this.game.add.tween(this)
      .to({angle: -tweenAngle}, tweenTime, Phaser.Easing.Linear.In)
      .to({angle:  tweenAngle}, tweenTime, Phaser.Easing.Linear.In)
      .repeatAll(1);
    tween.onComplete.add(resetAngle, this);
    tween.start();

    this.setHealthBarPercentage();
    this.healthbar.setText( this.getHealthbarText() );
  }

  heal(amount){
    super.heal(amount);

    this.setHealthBarPercentage();
    this.healthbar.setText( this.getHealthbarText() );
  }

  setHealthBarPercentage(){
    const healthPercentLeft = 100 * (this.health / this.maxHealth);
    this.healthbar.setPercent(healthPercentLeft);
  }

  //set isBeingKilled to true to signal that death has beweapon. Call the cool tweens, and actually kill() 'this' after the tween.
  //You will need check if isBeingKilled when doing most a lot of stuff from now on. If this is omitted, and kill() is immediately called,
  //'this' will be added back into the recycling pools. This causes problems as it can be recycled and completing the tween simultaneously
  kill(showCoolStuff = true){
    if(this.isBeingKilled) return;

    this.isBeingKilled = true;
    this.stopShooting();
    this.healthbar.visible = false;

    if(showCoolStuff){
      this.visible = true;
      this.playDeathTween(); //super.kill is called after tween finishes
    }
  }

  playDeathTween(){
    //setup tween to be played upon this.kill()
    const xTweenLen = ParentSprite.dp(15) * Math.random() + ParentSprite.dp(15);
    const tweenAngle = 30 + 30 * Math.random();
    const tweenTime = 35;
    var tween = this.game.add.tween(this)
      .to({x:'-'+xTweenLen}, tweenTime, Phaser.Easing.Linear.In) //tween it relative to the current position. Needs to be a string
      .to({x:'+'+xTweenLen}, tweenTime, Phaser.Easing.Linear.In)
      .to({angle: -tweenAngle}, tweenTime, Phaser.Easing.Linear.In)
      .to({angle:  tweenAngle}, tweenTime, Phaser.Easing.Linear.In)
      .repeatAll(1);
    tween.start();
    tween.onComplete.add(this.finishKill, this);
  }

  finishKill(){
    this.isBeingKilled = false;

    super.kill(false); //do not show explosion upon death, instead show it after deathTween completes
    this.goldText.showGoldText(this.jsonInfo.resourceValue, this.x, this.y);
    this.showExplosion();
  }

  static bulletCollision(bullet, unit){
    if( unit.isAlive() ) bullet.kill();
    if( unit.isAlive() ) unit.damage(bullet.parent.dmg);
  }

}
