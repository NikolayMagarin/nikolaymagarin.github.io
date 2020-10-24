let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let height = 800;
let width = 800;

const PI = Math.PI;
const RANDOM = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

canvas.height = height;
canvas.width = width;

let mouse = {},
	keyboard = {};
let bullets = [],
	ammo = [],
	asteroids = [];

let GameParams = {
	fuelConsumption: 0.4,
	fuelBarLength: 500,
	maxAsteroidsOnScreen: 15,
	startAmmo: 100,
	ammoPickUpRadius: 100,
}

let asteroidTime = RANDOM(100, 200);

let shoot_SOUND = new Audio('Sounds/shoot.wav');
let box_SOUND = new Audio('Sounds/box.wav');
let gameover_SOUND = new Audio('Sounds/gameover.wav');
let ammopickup_SOUND = new Audio('Sounds/ammopickup.ogg');
let jet_SOUND = new Audio('Sounds/jet.wav');

let isPaused = false;
let MUTE = false;

class Player {
	constructor(x, y, a, b, score, bulletsquantity) { //a-ship angle; b-cannon angle
		this.x = x;
		this.y = y;
		this.allX = [];
		this.allY = [];
		this.a = a;
		this.b = b;
		this.dx = 0;
		this.dy = 0;
		this.ddx = 0.1;
		this.ddy = 0.1;
		this.max = 5;
		this.score = score || 0;
		this.bulletsquantity = bulletsquantity || 10;
	}

	rotate() {
		this.a+=0.05*(keyboard[68]||0-keyboard[65]||0);
		this.a = this.a % (2*PI);
	}

	turnCanon() {
		this.b = PI * (mouse.x < this.x) - Math.atan((this.y - mouse.y) / (mouse.x - this.x));
	}

	move() {
		if ((keyboard[87]||0)&&fuel.val) {
			this.dx+=this.ddx*(this.dx<this.max);
			this.dy+=this.ddy*(this.dy<this.max);
		} else {
			this.dx-=this.ddx*0.5*Math.sign(this.dx);
			this.dy-=this.ddy*0.5*Math.sign(this.dy);
		}
		if (!(keyboard[87]||0)&&(Math.abs(this.dx)<2*this.ddx)) {this.dx=0}
		if (!(keyboard[87]||0)&&(Math.abs(this.dy)<2*this.ddy)) {this.dy=0}
		this.x += this.dx*Math.cos(this.a);
		this.y += this.dy*Math.sin(this.a);
		if (this.x>width||this.x<0) {this.dx=-1}
		if (this.y>height||this.y<0) {this.dy=-1}
		this.allX[0] = this.x + 20*Math.cos(this.a);
		this.allX[1] = this.x + 20*Math.cos(this.a+2.4);
		this.allX[2] = this.x + 10*Math.cos(this.a+PI);
		this.allX[3] = this.x + 20*Math.cos(this.a-2.4);
		this.allY[0] = this.y + 20*Math.sin(this.a);
		this.allY[1] = this.y + 20*Math.sin(this.a+2.4);
		this.allY[2] = this.y + 10*Math.sin(this.a+PI);
		this.allY[3] = this.y + 20*Math.sin(this.a-2.4);
	}

	draw() {
		if ((keyboard[87]||0)&&fuel.val) {
			ctx.strokeStyle = 'red';
			ctx.fillStyle = 'orange';
			ctx.beginPath();
			ctx.arc(this.allX[2], this.allY[2], 5, 2*PI, false);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}
		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'white';
		ctx.beginPath();
		ctx.moveTo(this.allX[0], this.allY[0]);
		ctx.lineTo(this.allX[1], this.allY[1]);
		ctx.lineTo(this.allX[2], this.allY[2]);
		ctx.lineTo(this.allX[3], this.allY[3]);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = 'lightgray';
		ctx.beginPath();
		ctx.moveTo(this.x + 15*Math.cos(this.b-0.2), this.y + 15*Math.sin(this.b-0.2));
		ctx.lineTo(this.x + 15*Math.cos(this.b+0.2), this.y + 15*Math.sin(this.b+0.2));
		ctx.lineTo(this.x + 5*Math.cos(this.b+PI/2), this.y + 5*Math.sin(this.b+PI/2));
		ctx.lineTo(this.x + 5*Math.cos(this.b-PI/2), this.y + 5*Math.sin(this.b-PI/2));
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 2*PI, false);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}

class Bullet {
	constructor(x, y, dx, dy, a) {
		this.x = x;
		this.y = y;
		this.a = a;
		this.dx = dx;
		this.dy = dy;
	}

	move() {
		this.x += this.dx*Math.cos(this.a);
		this.y += this.dy*Math.sin(this.a);
	}

	draw() {
		ctx.fillStyle = 'lightgray';
		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.moveTo(this.x + 5*Math.cos(this.a-0.1), this.y + 5*Math.sin(this.a-0.1));
		ctx.lineTo(this.x + 5*Math.cos(this.a+0.1), this.y + 5*Math.sin(this.a+0.1));
		ctx.lineTo(this.x + 5*Math.cos(this.a+PI/2-0.1), this.y + 5*Math.sin(this.a+PI/2-0.1));
		ctx.lineTo(this.x + 5*Math.cos(this.a-PI/2+0.1), this.y + 5*Math.sin(this.a-PI/2+0.1));
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}

class Ammo {
	constructor(x, y, a) {
		this.x = x;
		this.y = y;
		this.dx = 1;
		this.dy = 1;
		this.a = a;
	}
	move() {
		this.x+=this.dx*Math.cos(this.a);
		this.y+=this.dy*Math.sin(this.a);
		this.dx-=0.01;
		this.dy-=0.01;
		if (Math.abs(this.dx)<0.02) {this.dx = 0}
		if (Math.abs(this.dy)<0.02) {this.dy = 0}
	}
	draw() {
		ctx.fillStyle = 'white';
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 2*PI, false);
		ctx.closePath();
		ctx.fill();
	}
}

class Asteroid {
	constructor(x, r, n, a) {
		this.x = x;
		this.y = -r;
		this.dy = Math.random()+0.5;
		this.r = r;
		this.n = n;
		this.const = 2*PI/n;
		this.a = a; //angle
		this.da = (RANDOM(0, 3)-1.5)/100;
		this.allX = [];
		this.allY = [];
		for (let i = 0; i < this.n; i++) {
			this.allX[i] = this.r*Math.cos(this.const*i+this.a) + this.x;
			this.allY[i] = this.r*Math.sin(this.const*i+this.a) + this.y;
		}
	}

	move() {
		this.y+=this.dy;
		this.a+=this.da;
		for (let i = 0; i < this.n; i++) {
			this.allX[i] = this.r*Math.cos(this.const*i+this.a) + this.x;
			this.allY[i] = this.r*Math.sin(this.const*i+this.a) + this.y;
		}
	}

	draw() {
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'DimGrey';
		ctx.beginPath();
		ctx.moveTo(this.allX[0], this.allY[0]);
		for (var i in this.allX) {
			ctx.lineTo(this.allX[i], this.allY[i])
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = 'white';
		// ctx.fillText(Math.ceil((this.r-20)/(20-2*this.n)), this.x, this.y);
	}
}

class FuelBar {
	constructor(l) {
		this.l = l;
		this.val = 100; //max = 100%
	}

	getfuel(val) {
		this.val += val
		if (this.val>100) {this.val = 100}
	}

	draw() {
		ctx.fillStyle = 'silver';
		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.rect(width-10, 10, -this.l, 10);
		ctx.closePath();
		ctx.stroke();
		ctx.beginPath();
		ctx.rect(width-10, 10, -this.l*this.val/100, 10);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = 'red';
		ctx.linewidth = 2;
		ctx.font = '12px sans-serif';
		ctx.fillText('FUEL', width-50, 20, 30);
	}
}

function clear () {
	ctx.clearRect(0, 0, width, height);
}

let player = new Player(width/2, height/2, -PI/2, 0, 0, GameParams.startAmmo);
let fuel = new FuelBar(GameParams.fuelBarLength);


function frame () {
	if (!isPaused) {


	clear();
	player.turnCanon();
	player.rotate();
	player.move();
	player.draw();

	(keyboard[87]||0)&&fuel.val ? (!MUTE ? jet_SOUND.play():0) : jet_SOUND.pause()

	if (asteroidTime) {
		asteroidTime--
	} else if (asteroids.length<GameParams.maxAsteroidsOnScreen) {
		asteroidTime = player.score>=50*Math.floor(player.score/50) &&
		player.score<55*Math.floor(player.score/50) ?
		RANDOM(10, 50) : RANDOM(100, 200);
		asteroids.push(new Asteroid(RANDOM(60, width-50), 50, RANDOM(5,7), 0))
	}
	
	for (let i in asteroids) {
		asteroids[i].move();
		if (asteroids[i].y>height+asteroids[i].r) {
			player.bulletsquantity-= player.bulletsquantity<asteroids[i].n?player.bulletsquantity:asteroids[i].n;
			asteroids.splice(i, 1);
		} else asteroids[i].draw();
	}

	for (let i in bullets) {
		bullets[i].move();
		let res = inPolyArray(bullets[i].x, bullets[i].y, asteroids);
		if (bullets[i].x>width||bullets[i].x<0||bullets[i].y>height||bullets[i].y<0) {
			bullets.splice(i, 1);
		}

		else if (res) {
			!MUTE ? box_SOUND.cloneNode(true).play():0; 
			asteroids[res-1].r-=20-2*asteroids[res-1].n;
			if (asteroids[res-1].r<=20) {
				fuel.getfuel(RANDOM(5, 20)*asteroids[res-1].n*0.2);
				let ammoQuant = RANDOM(asteroids[res-1].n-3, asteroids[res-1].n);
				for (let i = 0; i < ammoQuant; i++) {
					ammo.push(new Ammo(asteroids[res-1].x, asteroids[res-1].y, i*2*PI/ammoQuant))
				}
				player.score+=5;
				asteroids.splice(res-1, 1);
			}
			bullets.splice(i, 1);
		}

		else bullets[i].draw();
	}

	for (let i in ammo) {
		ammo[i].move();

		if (inPoly(ammo[i].x, ammo[i].y, player.allX, player.allY)) {
			!MUTE ? ammopickup_SOUND.play():0;
			player.bulletsquantity++;
			ammo.splice(i, 1);
		}

		else if ((ammo[i].x-player.x)**2 + (ammo[i].y-player.y)**2 <= GameParams.ammoPickUpRadius**2) {
			ammo[i].a = Math.atan(Math.abs((player.y-ammo[i].y)/(player.x-ammo[i].x)));
			ammo[i].dx += (player.x-ammo[i].x)/100;
			ammo[i].dy += (player.y-ammo[i].y)/100;
			ammo[i].draw();
		}
		
		else if(ammo[i].x>width || ammo[i].x<0 ||
			ammo[i].y>height || ammo[i].y<0
			) {ammo.splice(i, 1);}
		else ammo[i].draw();
	}

	keyboard[87] ? fuel.val -= (fuel.val > 0) ? GameParams.fuelConsumption : fuel.val : 0;
	fuel.draw();

	ctx.fillStyle = 'white';
	ctx.font = '10px sans-serif';
	// Text(bullets.length, 10, 30);
	// Text(asteroids.length, 10, 40);
	// Text(ammo.length, 10, 50)
	ctx.font = '20px sans-serif';
	Text(player.score, 10, 45);
	Text(player.bulletsquantity, width-50, 45);

	if (inPolyArray(player.x, player.y, asteroids)) {RestartGame()}

	} else {
		jet_SOUND.pause();
		PauseScreen();
	}

	window.requestAnimationFrame(frame);
}

function inPolyArray(x, y, arr) {
	for (let i = 0; i < arr.length; i++) {
		if (inPoly(x, y, arr[i].allX, arr[i].allY)) {
			return i+1;
			break;
		}
	}
}

function inPoly(x, y, xp, yp){
	npol = xp.length;
	j = npol - 1;
	var c = 0;
	for (i = 0; i < npol;i++){
		if ((((yp[i]<=y) && (y<yp[j])) || ((yp[j]<=y) && (y<yp[i]))) &&
			(x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
			c = !c
		}
		j = i;
	}
	return c;
}

function PauseScreen() {
	ctx.globalAlpha = 0.1;
	ctx.fillStyle = 'gray';
	ctx.strokeStyle = 'black';
	ctx.font = '25px sans-serif';
	ctx.fillRect(width/2-25,height/2-30,20,60);
	ctx.fillRect(width/2+25,height/2-30,-20,60);
	Text('Your score', 10, 70);
	Text('Your ammo', width-140, 70);
	Text('You can turn off sounds', 50, height-15);
	Text('Controls', width-345, height-60)
	ctx.strokeStyle = 'gray';
	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.rect(width-200, height-100, 30, 30);
	ctx.rect(width-235, height-65, 30, 30);
	ctx.rect(width-165, height-65, 30, 30);
	ctx.fill();
	ctx.stroke();
	Text('W', width-197, height-75, 30);
	Text('A', width-228, height-41, 30);
	Text('D', width-158, height-41, 30);
	ctx.beginPath();
	ctx.ellipse(width-105, height-85, 15, 10, 0, 0, PI, true);
	ctx.lineTo(width-120, height-45);
	ctx.ellipse(width-105, height-45, 15, 5, 0, PI, 0, true);
	ctx.lineTo(width-90, height-85);
	ctx.moveTo(width-90, height-75);
	ctx.lineTo(width-120, height-75);
	ctx.moveTo(width-105, height-75);
	ctx.lineTo(width-105, height-95);
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(width-105, height-75);
	ctx.lineTo(width-105, height-95);
	ctx.ellipse(width-105, height-85, 15, 10, 0, 1.5*PI, PI, true);
	ctx.lineTo(width-120, height-75);
	ctx.closePath();
	ctx.fill();
	ctx.globalAlpha = 1;
}

function Text(text, x, y, maxW) {
	ctx.fillText(text, x, y, maxW);
	ctx.strokeText(text, x, y, maxW);

}

function RestartGame() {
	!MUTE ? gameover_SOUND.play():0;
	isPaused = true;
	player = new Player(width/2, height/2, -PI/2, 0, 0, GameParams.startAmmo);
	fuel = new FuelBar(GameParams.fuelBarLength);
	bullets = [];
	asteroids = [];
	ammo = [];
}

canvas.onmousemove = function (e) {
	mouse.x = e.offsetX;
	mouse.y = e.offsetY;
}

function keyDown(event) {
	if (event.keyCode == 32) {isPaused = !isPaused} else
	keyboard[event.keyCode] = 1;
}

function keyUp(event) {
	keyboard[event.keyCode] = 0;
}

canvas.onclick = function () {
	if (player.bulletsquantity && !isPaused) {
		bullets.push(new Bullet(player.x, player.y, player.dx+5, player.dy+5, player.b));
		player.bulletsquantity--;
		!MUTE ? shoot_SOUND.cloneNode(true).play():0;
	}
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.requestAnimationFrame(frame);
