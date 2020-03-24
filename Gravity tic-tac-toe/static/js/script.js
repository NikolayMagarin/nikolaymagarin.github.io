		let size = Math.abs(prompt("Set the field size.", 6)) || 6, last_size,
			canvas = document.getElementById('canvas'),
			c = canvas.getContext("2d"),
			gravitation = 1, //0.1 - 10
			leap_strength = 2, //0.1 - 10
			y_change = -leap_strength/gravitation,
			occupied = {},
			all = [],
			permissionToMove = true,
			moves = 0,
			turn = "red";
			
		if (window.innerHeight > window.innerWidth) {
			c.canvas.width = window.innerWidth - 30;
		}
			else {
				c.canvas.width = window.innerHeight - 30;
			}
		c.canvas.height = c.canvas.width;
		for (let i = 1; i <= size; i++) {
			let line = "line" + i;
			occupied[line] = 1;
		}
		for (let i = size*size; i >= 0; i--) {
			all[i] = 0;
		}

		c.lineCap = "round";
		c.mozImageSmoothingEnabled = false;
		c.webkitImageSmoothingEnabled = false;
		c.msImageSmoothingEnabled = false;
		c.imageSmoothingEnabled = false;
		for (let i = 1; i <= size-1 ; i++) {
			c.fillRect(c.canvas.width/size*i, 0, 4, c.canvas.height)
		}

		canvas.addEventListener('mouseup', function (e) {
    		var touch_x = e.pageX - e.target.offsetLeft,
        		touch_y = e.pageY - e.target.offsetTop;
        		move(touch_x, touch_y);
			});

		function reverse_cl(cl_to_reverse) {
			if (cl_to_reverse == "blue") {
				return "Red"
			} else {
				return "Blue"
			}
		}

		function move(x, y) {
			if (permissionToMove) {
				if (!(y > c.canvas.width-(occupied["line" + (Math.floor(x/(c.canvas.width/size))+1)]-1) * (Math.floor(c.canvas.width/size))-Math.floor(c.canvas.width/size)*0.5)) {
					x = Math.floor(c.canvas.width/size*Math.floor(x/(c.canvas.width/size)));
					draw(x, y-4-c.canvas.width/size/2);
					permissionToMove = false;
				}
				else {
					alert("This place is already taken!");
				}
			}
		}
		function draw(x, y) {
			if (turn == "blue") {
				turn = "red";
				c.strokeStyle = "blue";
			}
			else {
				turn = "blue";
				c.strokeStyle = "red";
			}
			x = x + (x/x*4) + 3 || x+5;
			fall(turn, x, y, Math.floor(c.canvas.width/size)-10);
		}

		function fall(color, x, y, elem_size, last) {
			if (!last) {
				c.clearRect(x,y-Math.abs(y_change)-1,elem_size,elem_size+(Math.abs(y_change/Math.abs(y_change)-1) || 1)*Math.abs(y_change)+2)
			}
			if (color == "blue") {
				c.lineWidth = Math.ceil(c.canvas.width/size/5);
				c.beginPath();
				c.moveTo(x+elem_size-c.lineWidth/2,y+elem_size-c.lineWidth/2);
				c.lineTo(x+c.lineWidth/2,y+c.lineWidth/2);
				c.stroke();
				c.beginPath();
				c.moveTo(x+c.lineWidth/2,y+elem_size-c.lineWidth/2);
				c.lineTo(x+elem_size-c.lineWidth/2,y+c.lineWidth/2);
				c.stroke();
			}
			else {
				c.lineWidth = Math.ceil(c.canvas.width/size/6)
				c.beginPath();
				c.arc(x+elem_size/2,y+elem_size/2,elem_size/2-c.lineWidth/2, 0, 2*Math.PI,true);
				c.stroke();
			}
			if (!last) {
				setTimeout(function() {
					let line_n = Math.floor(x/(c.canvas.width/size))+1;
					if (y > c.canvas.width-(occupied["line" + line_n] * (elem_size+10))) {
						c.clearRect(x,y,elem_size,elem_size+1);
						fall(color, x, c.canvas.width-occupied["line" + line_n] * (elem_size+10), elem_size, true);
						all[(occupied["line" + line_n]-1)*size + line_n]++;
						if (color == "blue") {all[(occupied["line" + line_n]-1)*size + line_n]++}
						check((occupied["line" + line_n]-1)*size + line_n, reverse_cl(color));
						occupied["line" + line_n]++;
						permissionToMove = true;
						y_change = -leap_strength/gravitation;
					}
					else {
						y_change+=gravitation/10;
						fall(color, x, y+y_change, elem_size);
					}
				}, 10)
			}
		}

		function check(i, cl) {
			moves++;
			// console.log(i);
			let a = all[i];

			if (a == all[i+1] && a == all[i+2] && a == all[i+3] && (((i+3) % size) || size) > ((( i ) % size) || size) || 
				a == all[i-1] && a == all[i+1] && a == all[i+2] && (((i+2) % size) || size) > (((i-1) % size) || size) ||
				a == all[i-2] && a == all[i-1] && a == all[i+1] && (((i+1) % size) || size) > (((i-2) % size) || size) ||
				a == all[i-3] && a == all[i-2] && a == all[i-1] && ((( i) % size) || size) > (((i-3) % size) || size) ||
				a == all[i+1*size] && a == all[i+2*size] && a == all[i+3*size] || 
				a == all[i-1*size] && a == all[i+1*size] && a == all[i+2*size] ||
				a == all[i-2*size] && a == all[i-1*size] && a == all[i+1*size] ||
				a == all[i-3*size] && a == all[i-2*size] && a == all[i-1*size] ||
				a == all[i+1*(+size+1)] && a == all[i+2*(+size+1)] && a == all[i+3*(+size+1)] && (((i+3*(+size+1)) % size) || size) > (((      i      ) % size) || size) || 
				a == all[i-1*(+size+1)] && a == all[i+1*(+size+1)] && a == all[i+2*(+size+1)] && (((i+2*(+size+1)) % size) || size) > (((i-1*(+size+1)) % size) || size) ||
				a == all[i-2*(+size+1)] && a == all[i-1*(+size+1)] && a == all[i+1*(+size+1)] && (((i+1*(+size+1)) % size) || size) > (((i-2*(+size+1)) % size) || size) ||
				a == all[i-3*(+size+1)] && a == all[i-2*(+size+1)] && a == all[i-1*(+size+1)] && (((      i      ) % size) || size) > (((i-3*(+size+1)) % size) || size) ||
				a == all[i+1*(+size-1)] && a == all[i+2*(+size-1)] && a == all[i+3*(+size-1)] && (((i+3*(+size-1)) % size) || size) < (((      i      ) % size) || size) || 
				a == all[i-1*(+size-1)] && a == all[i+1*(+size-1)] && a == all[i+2*(+size-1)] && (((i+2*(+size-1)) % size) || size) < (((i-1*(+size-1)) % size) || size) ||
				a == all[i-2*(+size-1)] && a == all[i-1*(+size-1)] && a == all[i+1*(+size-1)] && (((i+1*(+size-1)) % size) || size) < (((i-2*(+size-1)) % size) || size) ||
				a == all[i-3*(+size-1)] && a == all[i-2*(+size-1)] && a == all[i-1*(+size-1)] && (((      i      ) % size) || size) < (((i-3*(+size-1)) % size) || size)) {
				if (confirm(cl + " won! Would you like to play again?")) {
					start_new_game();
				}
			} else if (moves >= size*size) {
				if (confirm("Draw! Would you like to play again?")) {
					start_new_game();
				}
			}
		}

		function start_new_game() {
			setTimeout(function() {
				moves = 0;
				c.clearRect(0, 0, c.canvas.width, c.canvas.width);
				last_size = size;
				size = prompt("Set the field size.", last_size) || last_size;
				occupied = {};
				all = [];
				for (let i = 1; i <= size; i++) {
					let line = "line" + i;
					occupied[line] = 1;
				}
				for (let i = size*size; i >= 0; i--) {
					all[i] = 0;
				}
				for (let i = 1; i <= size-1 ; i++) {
					c.fillRect(c.canvas.width/size*i, 0, 4, c.canvas.height)
				}
				y_change = -leap_strength/gravitation;
				let turn = "red";
			}, 1000)
		}