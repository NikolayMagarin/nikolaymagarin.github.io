$('#darkLayer').hide();

document.getElementsByClassName('prev')[0].onclick = function() {
	document.getElementById('content').scrollBy(-200, 0);
}
document.getElementsByClassName('next')[0].onclick = function() {
	document.getElementById('content').scrollBy(200, 0);
}

var modal = document.getElementById('instructions-modal');

var btn = document.getElementById("information");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "flex";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.getElementById('AND').onclick = function() {
	createBlock(this.id);
}

document.getElementById('NOT').onclick = function() {
	createBlock(this.id);
}

document.getElementById('POWER').onclick = function() {
	createPowerPin();
}

document.getElementById('OUTPUT').onclick = function() {
	createOutputPin();
}

document.getElementById('LOAD').onclick = function() {
	load_pack();
}

document.getElementById('SAVE').onclick = function() {
	save_pack();
}

const canvas = $(".linesCanvas")[0];
const ctx = canvas.getContext("2d");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
ctx.lineWidth = 2;

let selectedPin;
let draggingblock;
let powerPins = [];
let outputPins = [];
let lines = [];
let blockinanim = false;

mouse = {
	x: 0,
	y: 0,
}

let Global_Blocks = {}
Global_Blocks.AND = {
	color: "#e71d36",
	inputs_num: 2,
	outputs_num: 1,
	convertMap: {
		"00": [false],
		"01": [false],
		"10": [false],
		"11": [true],
	},
}

Global_Blocks.NOT = {
	color: "#ff9f1c",
	inputs_num: 1,
	outputs_num: 1,
	convertMap: {
		"0": [true],
		"1": [false],
	},
}

function createBlock(id) {
	let color = Global_Blocks[id].color;
	let newBlockOnField = $('<div style = "position: absolute; background-color:'+ color +'" class="BlockOnField" id="'+ id + '_block' +'"><p style = "margin: 15px; position: inherit; bottom: -10px;">'+ id +'</p></div>');
	$(newBlockOnField).attr("min-width", "")

	let inputs = [];
	for (let i = 0; i < Global_Blocks[id].inputs_num; i++) {
		inputs.push("false");
	}
	let outputs = convertSignal(inputs, Global_Blocks[id].convertMap);
	$(newBlockOnField[0]).attr("inputs", inputs);
	$(newBlockOnField[0]).attr("outputs", outputs);

	newBlockOnField[0].style.left = mouse.x-25 + 'px';
	newBlockOnField[0].style.top = mouse.y-25 + 'px';
	$(newBlockOnField[0]).draggable();
	for (let i = 0; i < Global_Blocks[id].inputs_num; i++) {
		let pin = $('<div class = "pin" id = "inpin' + i + '"></div>');
		$(pin[0]).click(function() {
			if (selectedPin) {
				lines.push({
					startPin: selectedPin,
					endPin: this,
					color: "black",
				});
				selectedPin = undefined;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				drawAllLines();
			}
		})
		$(pin[0]).dblclick(function(event) {if (event.ctrlKey) removeConectedLines(this)});
		newBlockOnField[0].append(pin[0]);
	}
	for (let i = 0; i < Global_Blocks[id].outputs_num; i++) {
		let pin = $('<div class = "pin" id = "outpin' + i + '"></div>');
		$(pin[0]).click(function(event) {
			if (!(selectedPin || event.ctrlKey)) selectedPin = this
		})
		$(pin[0]).dblclick(function() {if (event.ctrlKey) removeConectedLines(this)});
		pin[0].style = "float:right; right:-"+25*i+"px; top: -"+(5+20*(Global_Blocks[id].outputs_num-i)+10*(Global_Blocks[id].inputs_num-Global_Blocks[id].outputs_num))+"px";
		newBlockOnField[0].append(pin[0]);
	}
	$(newBlockOnField[0]).mousedown(function() {draggingblock = this;})
	document.body.append(newBlockOnField[0]);

}

function createPowerPin() {
	let newPowerPin = $('<div class = "bigPin" style = "clear: transition"></div>')[0];
	$(newPowerPin).click(function(event) {
		if (event.altKey) {
			if (newPowerPin.style.background == "red") newPowerPin.style.background = "grey"
				else newPowerPin.style.background = "red"
		} else if (!selectedPin && event.shiftKey) selectedPin = this;
	})
	newPowerPin.style.left = mouse.x-20 + 'px';
	newPowerPin.style.top = mouse.y-120-40*(powerPins.length + outputPins.length) + 'px';
	$(newPowerPin).draggable();
	$(newPowerPin).mousedown(function() {draggingblock = this;})
	$(newPowerPin).dblclick(function() {if (event.ctrlKey) removeConectedLines(this)});
	powerPins.push(newPowerPin);
	document.body.append(newPowerPin);
}

function createOutputPin() {
	let newOutputPin = $('<div class = "bigPin" style = "clear: transition; border-radius: 40%"></div>')[0];
	$(newOutputPin).click(function(event) {
		if (selectedPin) {
			lines.push({
					startPin: selectedPin,
					endPin: this,
					color: "black",
				});
				selectedPin = undefined;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				drawAllLines();
		};
	})
	newOutputPin.style.left = mouse.x-20 + 'px';
	newOutputPin.style.top = mouse.y-120-40*(outputPins.length + powerPins.length) + 'px';
	$(newOutputPin).draggable();
	$(newOutputPin).mousedown(function() {draggingblock = this;})
	$(newOutputPin).dblclick(function() {if (event.ctrlKey) removeConectedLines(this)});
	outputPins.push(newOutputPin);
	document.body.append(newOutputPin);
}

window.onmousemove = function(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
}

$(".deleter").draggable();

$(".deleter").click(function() {
	if (selectedPin) {
		selectedPin = undefined;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawAllLines();
	}
	else if (draggingblock) {
		if (powerPins.indexOf(draggingblock) != -1) {
			powerPins.splice(powerPins.indexOf(draggingblock), 1);
		}
			else if (outputPins.indexOf(draggingblock) != -1) {
				outputPins.splice(outputPins.indexOf(draggingblock), 1)
			}
		draggingblock.remove();
		draggingblock = undefined
	};
})

$(".deleter").dblclick(function(event) {
	if (event.ctrlKey) clearField();
})

function clearField() {
	selectedPin = undefined;
	powerPins = [];
	outputPins = [];
	lines = [];
	$(".BlockOnField").remove();
	$(".bigPin").remove();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function removeConectedLines(element) {
	for (let i in lines) {
		if (lines[i].startPin == element || lines[i].endPin == element) {
			lines.splice(i, 1, "0");
		}
	}
	while (lines.indexOf("0") != -1) {
		lines.splice(lines.indexOf("0"), 1);
	}
}

function drawAllLines() {
	for (let i in lines) {
		if ($(lines[i].startPin).offset().left+$(lines[i].startPin).offset().top == 0 || $(lines[i].endPin).offset().left+$(lines[i].endPin).offset().top == 0) {
			lines.splice(i, 1);
		} else {
			ctx.beginPath();
			ctx.strokeStyle = String(lines[i].color);
			ctx.moveTo($(lines[i].startPin).offset().left+$(lines[i].startPin).width()*0.5, $(lines[i].startPin).offset().top+$(lines[i].startPin).height()*0.5);
			ctx.lineTo($(lines[i].endPin).offset().left+$(lines[i].endPin).width()*0.5, $(lines[i].endPin).offset().top+$(lines[i].endPin).height()*0.5);
			ctx.stroke();
			ctx.closePath();
		}
	}
}

function frame() {
	let blocks = document.getElementsByClassName("BlockOnField");
	for (let i = 0; i < blocks.length; i++) {
		let id = String($(blocks[i]).attr('id')).split('_')[0];
		let inputs = $(blocks[i]).attr('inputs').split(',');
		let outputs = convertSignal(inputs, Global_Blocks[id].convertMap);
		$(blocks[i]).attr("outputs", outputs);
	}

	for (let i in lines) {
		let StartPinIndex = -1;
		let endPinIndex = -1;

		if ($(lines[i].startPin).attr('id')) StartPinIndex = Number($(lines[i].startPin).attr('id').replace(/[^0-9]/g, ''));
		if ($(lines[i].endPin).attr('id')) endPinIndex = Number($(lines[i].endPin).attr('id').replace(/[^0-9]/g, ''));


		if (StartPinIndex >=0) {

			if ($(lines[i].startPin).parent().attr('outputs').split(',')[StartPinIndex] == "true") {

				lines[i].color = "red";

				if (endPinIndex >= 0) {

					inputs = $(lines[i].endPin).parent().attr('inputs').split(',');
					inputs[endPinIndex] = "true";
					$(lines[i].endPin).parent().attr('inputs', inputs);

				} else {

					lines[i].endPin.style.background = "red";
				}

			} else {

				lines[i].color = "black";

				if (endPinIndex >= 0) {

					inputs = $(lines[i].endPin).parent().attr('inputs').split(',');
					inputs[endPinIndex] = "false";
					$(lines[i].endPin).parent().attr('inputs', inputs);

				} else {

					lines[i].endPin.style.background = "grey";
				}
			}
		}

		else if (lines[i].startPin.style.background == "red") {

			lines[i].color = "red";

			if (endPinIndex >= 0) {
				inputs = $(lines[i].endPin).parent().attr('inputs').split(",");
				inputs[endPinIndex] = "true";
				$(lines[i].endPin).parent().attr('inputs', inputs);

			} else {

				lines[i].endPin.style.background = "red";
			}
		}

		else {

			lines[i].color = "black";

			if (endPinIndex >= 0) {

				inputs = $(lines[i].endPin).parent().attr('inputs').split(',');
				inputs[endPinIndex] = "false";
				$(lines[i].endPin).parent().attr('inputs', inputs);

			} else {

				lines[i].endPin.style.background = "grey";
			}
		}
	}

	if (!blockinanim) {

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawAllLines();

		if (selectedPin) {
			ctx.strokeStyle = "black";
			ctx.beginPath();
			ctx.moveTo($(selectedPin).offset().left+$(selectedPin).width()*0.5, $(selectedPin).offset().top+$(selectedPin).height()*0.5);
			ctx.lineTo(mouse.x, mouse.y);
			ctx.stroke();
			ctx.closePath();
		}

		window.requestAnimationFrame(frame);
	}
}

function convertSignal(inputs, convertMap) {
	let bin_inputs = "";
		for (let i in inputs) {
			if (Bool(inputs[i])) bin_inputs += "1"
				else bin_inputs += "0";
		}
		return convertMap[bin_inputs].map(String);
}

function Bool(string) {
	if (string == "true") return true
		else return false
}

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}

$("#CUSTOM").click(function() {
	$('#darkLayer').show();
	$('#darkLayer').animate({opacity: 0.8})
	setTimeout(function() {
		blockinanim = true;
		create_Global_Block();
		blockinanim = false;
		frame();
		$('#darkLayer').animate({opacity: 0})
		$('#darkLayer').hide();
	}, 500);
})

function create_Global_Block() {
	let inputs_num = powerPins.length;
	let outputs_num = outputPins.length;

	if (inputs_num*outputs_num == 0) {
		alert("Sorry, but your custom logic gate must have at least one input and one output.")
		return
	}
	if (lines.length == 0) {
		if (!confirm("Your custom logic gate is not using any wires, are you sure you want to continue?"))
			return
	}

	let inputprompt = prompt('Enter Name and Color of you custom logic gate. Example: 32bitCALC, #90be6d');
	if (inputprompt == null) {
		return
	}
	let newBlockProps = inputprompt.replace(/[^a-zа-яё0-9,#]/gi, '').split(",");
	while (newBlockProps.length != 2) {
		inputprompt = prompt('Error! Please enter TWO parameters, use ",". Example: >>, grey');
		if (inputprompt == null) {
			return
		}
		newBlockProps = inputprompt.replace(/[^a-zа-яё0-9,#]/gi, '').split(",");
	}

	if (!newBlockProps[0]) {
		newBlockProps[0] = "unnamed";
	}
	let sameNameCounter = 0;
	$(".internal").each(function() {
		if (String($(this).attr("id")).split("(")[0] == newBlockProps[0]) sameNameCounter++;
	})
	if (sameNameCounter) {
		newBlockProps[0] += "("+sameNameCounter+")";
	}



	powerPins.sort((a, b) => parseFloat(($(a).offset().left**2+$(a).offset().top**2)**0.5) - parseFloat(($(b).offset().left**2+$(b).offset().top**2)**0.5));
	outputPins.sort((a, b) => parseFloat(($(a).offset().left**2+$(a).offset().top**2)**0.5) - parseFloat(($(b).offset().left**2+$(b).offset().top**2)**0.5));

	let convertMap = {}

	for (let i = 0; i < 2**inputs_num; i++) {
		let bin_i = dec2bin(i);
		bin_i = (new Array(inputs_num + 1).join('0') + String(bin_i)).slice(-inputs_num)
		for (let j = 0; j < inputs_num; j++) {
			if (Number(bin_i[j])) powerPins[j].style.background = "red"
				else powerPins[j].style.background = "grey";

		}

		for (let c = 0; c < lines.length*2; c++) {
			frame()
		}

		convertMap[String(bin_i)] = [];
		for (let o = 0; o < outputs_num; o++) {
			convertMap[String(bin_i)].push(outputPins[o].style.background == "red");
		}
	}

	Global_Blocks[newBlockProps[0]] = {
		color: String(newBlockProps[1]),
		inputs_num: inputs_num,
		outputs_num: outputs_num,
		convertMap: convertMap,
	}

	$("#content").append($('<div class=internal id="'+ newBlockProps[0] +'"><p>'+ newBlockProps[0] +'</p></div>'))
	document.getElementById(newBlockProps[0]).onclick = function() {
		createBlock(this.id);
	}

	clearField();
}

function load_pack(){
	let input = $("<input type='file' onchange='readFile(this)'>")
	input.click();
}

function save_pack(){
	downloadTXT(SringBlockPack(), "BlockPack")
}

function downloadTXT(data, filename) {
	let link = document.createElement('a');
	link.download = filename + '.txt';
	let blob = new Blob([data], {type: 'text/plain'});
	link.href = URL.createObjectURL(blob);
	link.click();
	URL.revokeObjectURL(link.href);
}

function readFile(input) {
	let file = input.files[0];
	let reader = new FileReader();
	reader.readAsText(file);
	reader.onerror = function() {
		console.log(reader.error);
	};
	reader.onload = function() {
		addBlockPack(reader.result);
	};
}

function SringBlockPack() {
	let str = "";

	let transformed = Object.entries(Global_Blocks);

	for (let i in transformed) {
		let block = transformed[i];
		str+= block[0] + " = {\n";
		str+= "color: " + "'"+block[1].color+"'" + ",\n";
		str+= "inputs_num: " + block[1].inputs_num + ",\n";
		str+= "outputs_num: " + block[1].outputs_num + ",\n";
		let map = Object.entries(block[1].convertMap);
		str+= "convertMap: {\n";
		for (let j in map) {
			str+= "'"+map[j][0]+"'" + ": [";
			for (let k in map[j][1]) {
				str+= map[j][1][k] + ",";
			}
			str = str.slice(0,-1);
			str+= "],\n";
		}
		str = str.slice(0,-2);
		str+= "\n";
		str+= "}\n}^&*";
	}

	str = str.slice(0,-3);

	return str
}

function addBlockPack(str) {
	let transformed = Object.keys(Global_Blocks);
	for (let i in transformed) {
		$("#"+ transformed[i]).remove();
	}

	Global_Blocks = {};

	let blocks_str = str.split("^&*");
	for (let i in blocks_str) {
		let block = blocks_str[i].split("=");
		let id = block[0];
		eval("Global_Blocks[id] = "+block[1]);

		$("#content").append($('<div class=internal id="'+ id +'"><p>'+ id +'</p></div>'))
		document.getElementById(id).onclick = function() {
			createBlock(this.id);
		}
		clearField();

	}
}

window.requestAnimationFrame(frame);
