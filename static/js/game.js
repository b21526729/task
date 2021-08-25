let win = window,  
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;

let app = new PIXI.Application({
    width: x,
    height: y,
    antialias: true,
    transparent: false,
    resolution: window.devicePixelRatio


});
let status = true;
let countIncInterval = null;
let screen= {
    'x' : 0,
    'y' : 0,
    'width' : x,
    'height' : y
}
let spritePath = "../assets/img/";
app.renderer.backgroundColor= 0x000000;
app.renderer.transparent= true;
app.renderer.view.style.display="block";
document.body.appendChild(app.view);

let player;
let enemies = [];
let step = x > y ? y * 0.1 : x * 0.1;
let stepEnemy = x > y ? y * 0.065 : x * 0.065;
let enemiesTexture = [];
let enemiesInterval = null;
let enemiesBulletFire =null;
let deathEnemyCount = 0;
let highscore = JSON.parse(localStorage.getItem('highscore'));
let shieldTexture = new PIXI.Texture.from(spritePath + "shield3.png");
let playerTexture = PIXI.Texture.from(spritePath + "playerShip1_red.png");
let bulletTexture = PIXI.Texture.from(spritePath + "laserRed03.png");
let enemyBulletsTexture = PIXI.Texture.from(spritePath + "laserGreen.png");
let enemyTexture= PIXI.Texture.from(spritePath+ "ufoYellow.png");
let enemyTexture1= PIXI.Texture.from(spritePath+ "ufoGreen.png");
let enemyTexture2= PIXI.Texture.from(spritePath+ "ufoBlue.png");
const style = new PIXI.TextStyle({
    fill: "white",
    fontFamily: "Courier New",
    fontSize: step / 2,
    fontWeight: 300
});

let loText = new PIXI.Text("Dead enemy :"+ deathEnemyCount, style);
loText.anchor.set(0.5);
loText.x = loText.width / 2;
loText.y = loText.height / 2;
app.stage.addChild(loText);

enemiesTexture.push(enemyTexture);
enemiesTexture.push(enemyTexture1);
enemiesTexture.push(enemyTexture2);

enemiesBullets=[];

enemy= new PIXI.Sprite(enemyTexture);


enemies.push(enemy);

enemy.move = function(){

    this.x += this.vx;
}

function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

player = new PIXI.Sprite(playerTexture);
player.x = x * 0.5;
player.y = screen.height -  player.height/2 ; 
player.width = step;
player.height = step;
player.anchor.set(0.5);
player.vx = 0;
player.vy = 0;
player.rotation = 0;
player.fireStatus = true;   //  Checking for fire limit per 350ms
player.maxEnergy = 100;
player.move = function(){
    let x = contain(this, screen);
    if(x !== undefined){
        console.log(x);
    }
    this.x += this.vx;
    this.y += this.vy;
    
}
player.bullets= [];

player.fire= function(){
    if(player.fireStatus){ // Checking for fire limit per 350ms. fireStatus converts to true in 350ms. 
        player.fireStatus = false;
        bullet= new PIXI.Sprite(bulletTexture);
        bullet.x= player.x + (step) * Math.sin(player.rotation); // Bullet rotation but The bullet only moves upwards.
        bullet.y = player.y - (step) * Math.cos(player.rotation); // Checking rotation and player rotation for up.
        bullet.rotation = player.rotation;
        bullet.vx=6* Math.sin(player.rotation);
        bullet.vy=6* Math.cos(player.rotation);
        bullet.anchor.set(0.5);
        app.stage.addChild(bullet);
        this.bullets.push(bullet);
    }
}

player.intervalId = null;

player.checkStatus = function(){ 
    if(!this.fireStatus){
        this.fireStatus = true;
    }
}




function createEnemy(texture, x, y, width, height,enemyBulletTexture){
    
  
    
    var enemy = new PIXI.Sprite(texture);
  
    enemy.x = x;
    enemy.y = y;
    enemy.vx=randomInt(-2,-1);
    enemy.width=width;
    enemy.height=height;
    enemy.anchor.set(0.5);
    enemy.move = function(){ // Enemies moving leftside.
        console.log("move");
        enemy.x += enemy.vx;
    };
   
    enemy.fire = setInterval (function(){ // Enemies fire random time.

        

        
        let enemyBullet = new PIXI.Sprite(enemyBulletTexture);
        enemyBullet.height= 0.4 * step;
        enemyBullet.width= 0.1 * step;
        enemyBullet.x= enemy.x ;
        enemyBullet.y = enemy.y + enemy.height;
       
       

        enemyBullet.vy=randomInt(1,2);
        enemyBullet.anchor.set(0.5);
        app.stage.addChild(enemyBullet);
        enemiesBullets.push(enemyBullet);
        console.log("ates");
        
    }, randomInt(750,3400)); // Fires randomly between 750 ms and 3400 ms. 
    app.stage.addChild(enemy);
    enemies.push(enemy);
  

}




function contain(player, screen) { // Understand that the textures in the game go out 
                                    //of the screen and to prevent them from going out of the screen.
                                    //It was made to prevent the items used in the game from remaining and slowing down.
    let ret = undefined;
    if (player.x + player.width / 2  > screen.width) {
        player.x = screen.width - player.width / 2;
        ret = "right";
    }
    if (player.x- player.width/2  < screen.x) {
        player.x = screen.x + player.width / 2;
        ret = "left";
    }
    if (player.y+ player.height/2 > screen.height) {
        player.y=screen.height-(player.height/2);
        ret = "down";
    }
    if (player.y- player.height/2  < screen.y) {
        player.y=screen.y + (player.height / 2);
        ret = "up";
    }
    return ret;
  }

document.addEventListener('keydown', function(event){ // To check the keyboard input
    let name = event.name;
    let code = event.keyCode;
    if (event.defaultPrevented) {
        return;
    }
    if((code == 65 || code == 37) && player.vx>-6 ){
       
        player.vx += -2;
    } 
    
    
    if((code == 68 || code == 39) && player.vx<6 ){
        player.vx += 2;
   
    }
   
    if(code == 32){
        player.fire();


    }

});

document.addEventListener('keyup', function(event){ // To check the keyboard input
    let name = event.name; 
    let code = event.keyCode;
    if (event.defaultPrevented) {
        return;
    }
    if(code == 65 || code == 37 ){
        player.vx = 0;
    }
    if(code == 87 || code == 38 ){
        player.vy = 0;
    }
    if(code == 68 || code == 39 ){
        player.vx = 0;
    }
    if(code == 83 || code == 40){
        player.vy = 0;
    }
})
app.stage.addChild(player);
app.stage.addChild(enemy);

app.ticker.add(function(){
    player.move();
    player.bullets = player.bullets.filter(element => { // Checking the bullets that go off the screen and deleting the ones that come out
        let ret = true; // Used for the "filter" function. It causes the element to be deleted from the array list when it returns false.
        element.x=element.x + element.vx;
        element.y= element.y - element.vy;
        if(contain(element, screen) !== undefined){
            app.stage.removeChild(element);
            ret = false;
        }
        return ret;
    });

    enemiesBullets=enemiesBullets.filter(function(eB){
        
        let ret = true;
        if(hitTestRectangle(player, eB)){ // Checking enemy bullet if hit the player.
            player.maxEnergy -= 10;
            energyCounter.counter.width = player.maxEnergy * energyStep;
            app.stage.removeChild(eB);
            ret =false;
            if(player.maxEnergy<=0){
                stop();

            }
        }
        eB.alpha=1;
        enemies.forEach(function(enemy){

            if(hitTestRectangle(enemy,eB)){
                eB.alpha=0;

            }
           



        });

        eB.y += eB.vy;
        return ret;

    })
    enemies = enemies.filter(function(e){
        e.move();
        let ret = true;

        if(contain(e, screen) !== undefined){ // Enemy hit is sent off the map.
           
            clearInterval(e.fire);               // The enemy that goes out of the map is deleted from the game.
            app.stage.removeChild(e);

            ret = false;
        }
       

        player.bullets.forEach(function(b){
            if(hitTestRectangle(b, e)){ // If the player's bullets hit the enemy. That enemy will die.
                clearInterval(e.fire);
                app.stage.removeChild(b);
                app.stage.removeChild(e);
               
                b.x = x * 10;               // the bullet must be deleted so the bullet is taken out of the map.
                b.y = y * 10;
                deathEnemyCount+=1;
                loText.text = "Dead enemy :"+ deathEnemyCount;
                ret = false
            }
        });
        if(hitTestRectangle(player,e)){
            stop();
        }
    

        
        return ret;
    });

})
let count=1;
function createEnemyWithCount(c){ //Creating enemy for checking count difficulty
    console.log(count);
    for(let i = 0; i < c; i++){  
      
        
        createEnemy(enemiesTexture[randomInt(0, 2)],screen.width-(stepEnemy/2) - i * stepEnemy, 
        randomInt(stepEnemy, y/2 - stepEnemy/2), stepEnemy, stepEnemy, enemyBulletsTexture);
        
    }
}
enemiesInterval = setInterval(function(){
    createEnemyWithCount(count);  //Creating enemy for checking count difficulty between 3500 ms and 6500ms.
}, randomInt(3500,6500)); 

player.intervalId = setInterval(function(){
    player.checkStatus();
}.bind(count), 350); // Checking for fire limit per 350ms

countIncInterval = setInterval(function(){
    count++;
}, 10000);     // The difficulty is increased every 10 seconds.

function hitTestRectangle(r1, r2) {

    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    hit = false;

      r1.centerX = r1.x;
      r1.centerY = r1.y;
      r2.centerX = r2.x;
      r2.centerY = r2.y;

      r1.halfWidth = r1.width / 2;
      r1.halfHeight = r1.height / 2;
      r2.halfWidth = r2.width / 2;
      r2.halfHeight = r2.height / 2;

      vx = r1.centerX - r2.centerX;
      vy = r1.centerY - r2.centerY;

      combinedHalfWidths = r1.halfWidth + r2.halfWidth;
      combinedHalfHeights = r1.halfHeight + r2.halfHeight;

      if (Math.abs(vx) < combinedHalfWidths){

        if (Math.abs(vy) < combinedHalfHeights){

              hit = true;
        }else{

              hit = false;
        }
      }else{

        hit = false;
      }

      return hit;
}



let energyCounter = new PIXI.Container();
energyCounter.x = x-step - step / 5;
energyCounter.y = step/4 + step / 5 ;


app.stage.addChild(energyCounter);

let graphic = new PIXI.Graphics();
graphic.beginFill(0x343b3d, 0.5);
graphic.lineStyle(Math.ceil(step / 40), 0xeeeeee, 0.5);
graphic.drawRoundedRect(0, 0, 2 * step, step / 2, step / 5);
graphic.endFill();
energyCounter.addChild(graphic);

let graphic1 = new PIXI.Graphics();
graphic1.beginFill(0xac3939, 0.5);
graphic1.drawRoundedRect(0, 0, 2 * step, step / 2, step / 5);
graphic1.endFill();
energyCounter.addChild(graphic1);

let energyStep = (2 * step) / (player.maxEnergy);

energyCounter.counter = graphic1;
energyCounter.pivot.x = energyCounter.width /2 ;
energyCounter.pivot.y = energyCounter.height / 2 ;
function stop(){
    clearInterval(player.intervalId);
    clearInterval(enemiesInterval);
    
    enemies.forEach(function(b){
       
            clearInterval(b.fire);
       });
    
    enemies=[];
    player.x=x*10;
    player.y=y*10;

    app.stage.removeChildren();
   
    let goText = new PIXI.Text("GAME OVER", style);
    goText.anchor.set(0.5);
    goText.x = x * 0.5;
    goText.y = y * 0.5;
    app.stage.addChild(goText);
    if(deathEnemyCount > highscore){
       
        localStorage.setItem('highscore', JSON.stringify(deathEnemyCount)); // Max score hiding in local storage.
    }
    setTimeout(function(){
        window.location.assign("../index.html")  ;
    }, 3000);

}
function hitTestCircle(c0,c1) {
    var combinedHalfWidths = c0.width/2 + c1.width/2;

    if (calculateDistance(c0,c1) <= combinedHalfWidths) {
        return true;
    }
    return false;
}
function calculateDistance(obj0, obj1){

    var distance, dx, dy, spod;

    dx = obj0.x - obj1.x;
    dy = obj0.y - obj1.y;

    spod = Math.pow(dx,2) + Math.pow(dy,2);
    distance = Math.pow(spod, 0.5);

    return Math.ceil(distance);
}