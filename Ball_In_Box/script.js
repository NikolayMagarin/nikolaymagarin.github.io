let canvas = document.getElementsByTagName("canvas")[0],
	c = canvas.getContext("2d");
let canv_w = canvas.width,
	canv_h = canvas.height;
	let gradient;
let pressed = false,
	permission = false;
let NowX = canv_w/2, NowY = canv_h/2, R = 50, //Начальные координаты и радиус шара
	startLineX = canv_w/2, startLineY = canv_h/4, LineX = canv_w/3, LineY = canv_h/6;
c.strokeStyle = "red";

function draw_ball(x, y, r, dx, dy, vx, vy, clear) {
	if (clear) {c.clearRect(0,0,canv_w,canv_h)}
	if (x>canv_w-r || x<r) {dx=-dx}
	if (y>canv_h-r || y<r) {dy=-dy}
	x+=dx;
	y+=dy;
	dx+=-Math.sign(dx)*vx/250;
	dy+=-Math.sign(dy)*vy/250;
	gradient = c.createRadialGradient(x-0.5*r-10, y-0.5*r-10, r, x+2*r, y+2*r, r);
	gradient.addColorStop(0, "rgb(255, 250, 250)");
	gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
	c.fillStyle = gradient;
	c.beginPath();
	c.arc(x, y, r, 0, Math.PI*2, false);
	c.shadowColor = "rgba(0, 0, 0, 0.7)";
	c.shadowBlur = 5;
	c.shadowOffsetX = r*(-canv_h/2+x)/500;
	c.shadowOffsetY = r*(-canv_h/2+y)/500;
	c.fill();
	if (Math.abs(dx)>vx/500) {
		setTimeout(function() {
			draw_ball(x, y, r, dx, dy, vx, vy, 1)
		}, 20)
	} else {
		x = bug_fix(x, canv_w, r);
		y = bug_fix(y, canv_h, r);
		NowX = x;
		NowY = y;
		permission = true;
	}
}

canvas.onmousedown = function(e) {
	startLineX = e.offsetX;
	startLineY = e.offsetY;
	pressed = true;
}

canvas.onmouseup = function() {
	pressed = false;
	if(permission){throw_ball()}
}

canvas.onmousemove = function(event) {
	if(pressed && permission) {
		c.clearRect(0,0,canv_w,canv_h);
		draw_ball(NowX, NowY, R, 0, 0, 0, 0, 0);
		LineX = (event.offsetX-startLineX+NowX);
		LineY = (event.offsetY-startLineY+NowY);
		draw_arrow(NowX, NowY, LineX, LineY);
	}
}

function throw_ball() {
	permission = false;
	draw_ball(NowX, NowY, R, 0.1*(LineX-NowX), 0.1*(LineY-NowY), Math.abs(0.1*(LineX-NowX)), Math.abs(-0.1*(LineY-NowY), 1));
}

function bug_fix(a, perm_val, r) {
	if (a>perm_val-r || a<r) {a=Math.abs((Math.sign(a)*0.5+0.5)*perm_val-r)}
	return a;
}

function draw_arrow(x1, y1, x2, y2) {
	let headlen = 15;
	let angle = Math.atan2(y2 - y1, x2 - x1);
	c.beginPath();
	c.moveTo(x1, y1);
	c.lineTo(x2, y2);
	c.lineTo(x2-headlen*Math.cos(angle-Math.PI/6), y2-headlen*Math.sin(angle-Math.PI/6));
	c.moveTo(x2, y2);
	c.lineTo(x2-headlen*Math.cos(angle+Math.PI/6), y2-headlen*Math.sin(angle+Math.PI/6));
	c.stroke();
}

draw_ball(NowX, NowY, R, 0, 0, 0, 0, 0);