let c, r, field = document.querySelector(".game-field");
function create_field(q) {
	field.innerHTML = "";
	for (let i = 1; i <= q; i++) {
		let block = document.createElement('div');
		block.classList.add('block');
		field.appendChild(block);
		block.style.width=((field.offsetWidth-2)/c-20) + 'px';
		block.style.height=((field.offsetWidth)/r) + 'px';
		block.id = i;
		block.onclick = function(){move(this.id)}
	}
	document.getElementById((r-1)*c+1).classList.add('poisoned-block');
}
function move(id) {
	let this_id = id;
	for (let k = Math.ceil(this_id/c); k > 0; k--) {
		for (let i = this_id; i <= Math.ceil(id/c)*c; i++) {
			document.getElementById(i-c*(Math.ceil(this_id/c)-k)).onclick = function(){}
			document.getElementById(i-c*(Math.ceil(this_id/c)-k)).classList.add('block_after');
		}
	}
	if (id == c*(r-1)+1) {setTimeout(function(){create_field(c*r)}, 1400);}
}
document.querySelector(".newgame-button").onclick = function(){
	c = +document.querySelector("#c").value;
	r = +document.querySelector("#r").value;
	create_field(c*r);
}