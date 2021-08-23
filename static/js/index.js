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

let screen= {
    'x' : 0,
    'y' : 0,
    'width' : x,
    'height' : y
}
let spritePath = "./assets/img/";
let step = x > y ? y * 0.1 : x * 0.1;

if(!JSON.parse(localStorage.getItem("highscore"))){
    
    localStorage.setItem("highscore", JSON.stringify(0));
}
let highscore = JSON.parse(localStorage.getItem("highscore"));
console.log(highscore);
const style = new PIXI.TextStyle({
    fill: "white",
    fontFamily: "Courier New",
    fontSize: step / 2.5,
    fontWeight: 300
});

let maxText = new PIXI.Text("Max Score :"+ highscore, style);
maxText.anchor.set(0.5);
maxText.x = x * 0.48;
maxText.y = x * 0.17;
app.stage.addChild(maxText);
app.renderer.backgroundColor= 0x000000;
app.renderer.transparent= true;
app.renderer.view.style.display="block";
document.body.appendChild(app.view);

var buttonTexture = new PIXI.Texture.from(spritePath + "button_play.png");
var sprite = new PIXI.Sprite(buttonTexture);
sprite.x = x * 0.5;
sprite.y = y * 0.5;
sprite.width = 4 * step;
sprite.height = 2 * step;
sprite.anchor.set(0.5);
sprite.interactive = true;
sprite.buttonMode = true;
sprite.on('pointerdown', handler);
app.stage.addChild(sprite);

function handler(event){
    window.location.assign("./html/game.html");
}
    


