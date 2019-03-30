$("#replay").hide();
$("#body_").hide();
$("#start").hide();
let vvdcs = 1,
    operation, value, a, b, min, max, w, x, y, true_answer_location, J, z, c, d = 3,
    score = -1;
let hps = document.getElementById("hp_block_wrapper");
let body = document.getElementById("body");
let time_interv, ghgj, time, new_fls_ans_numb, new_fls_ans_val


function operation_generation() {
    operation = Math.round(Math.random() * (4 - 1) + 1);
    switch (operation) {
        case 1:
            task.innerHTML = a + " + " + b;
            value = a + b;
            break;
        case 2:
            task.innerHTML = a + " - " + b;
            value = a - b;
            break;
        case 3:
            value = a * b;
            break;
        case 4:
            task.innerHTML = a + " : " + b;
            value = a / b;
            break;
    }

    if (value == a - b) {
        a = Math.round(Math.random() * (90 - 2) + 2);
        if (a > 10) {
            c = a - 5;
        } else {
            c = a
        }
        b = Math.round(Math.random() * (c - 2) + 2);
        task.innerHTML = a + " - " + b;
        value = a - b;
    }

    if (value == a * b) {
        a = Math.round(Math.random() * (11 - 2) + 2);
        b = Math.round(Math.random() * (11 - 2) + 2);
        task.innerHTML = a + " × " + b;
        value = a * b;
    }

    if (value == a / b) {
        a = Math.round(Math.random() * (100 - 8) + 8);
        b = Math.round(Math.random() * (10 - 4) + 4);
        for (i = 0; i < 1; i--) {
            if (Math.round(a / b) == a / b) {
                i = 2;
                task.innerHTML = a + " : " + b;
                value = a / b;
            } else a = a + 1
        }
    }
}


function task_generation() {
    a = Math.round(Math.random() * (50 - 1) + 1);
    b = Math.round(Math.random() * (50 - 1) + 1);
}


function false_answers() {
    min = value - 3;
    max = value + 3;

    no_name();

    function no_name() {
        w = Math.round(Math.random() * (max - min) + min);
        x = Math.round(Math.random() * (max - min) + min);
        y = Math.round(Math.random() * (max - min) + min);
        z = Math.round(Math.random() * (max - min) + min);
        if (w == x || w == y || w == z || x == y || x == z || y == z || w == value || x == value || y == value || z == value) {
            no_name()
        } else {
            answer1.innerHTML = w;
            answer2.innerHTML = x;
            answer3.innerHTML = y;
            answer4.innerHTML = z;
            answer1.onclick = function() { next_task(-1); }
            answer2.onclick = function() { next_task(-1); }
            answer3.onclick = function() { next_task(-1); }
            answer4.onclick = function() { next_task(-1); }
        }

    }

}


function true_answer() {
    true_answer_location = Math.round(Math.random() * (4 - 1) + 1);
    switch (true_answer_location) {
        case 1:
            answer1.innerHTML = value;
            answer1.onclick = function() { next_task(0); }
            break;
        case 2:
            answer2.innerHTML = value;
            answer2.onclick = function() { next_task(0); }
            break;
        case 3:
            answer3.innerHTML = value;
            answer3.onclick = function() { next_task(0); }
            break;
        case 4:
            answer4.innerHTML = value;
            answer4.onclick = function() { next_task(0); }
            break;
    }
}


function next_task(minus_hp) {
    $("#replay").hide();

    time = 600;

    score = score + minus_hp + 1;
    d = d + minus_hp;

    if (d == 3) {
        vvdcs = 1;
        times();
    }
    if (d == 2) {
        vvdcs = 1;
        $("#hp3").hide();
        times();
    }
    if (d == 1) {
        vvdcs = 1;
        $("#hp2").hide();
        times();
    }
    if (d == 0) {
        vvdcs = 1;
        $("#hp1").hide();
        let h = document.createElement("br");
        let hh = document.createElement("br");
        $('#hp_block_wrapper').append(h);
        $('#hp_block_wrapper').append(hh);
    }
    if (d < 1) {
        if (score == 0) {
            J = "ов"
        }
        if (score == 1) {
            J = ""
        } else if (1 < score) {
            if (score < 5) {
                J = "а"
            } else if (score > 4) { J = "ов" }
        }
        setTimeout(function() {
            alert(" Вы решили " + score + " пример" + J);
            $("br").remove()
            $("#body").hide();
            $("#replay").show();
        }, 80);

    }

    task_generation();
    operation_generation();
    false_answers();
    true_answer();
    new_false_answer()
}

function replay() {
    $("#body").show();
    score = -1;
    d = 3;
    $("#hp1").show();
    $("#hp2").show();
    $("#hp3").show();
    next_task(0);
    times();
}

function times() {
    if (vvdcs != 1) {
        time = time - 6;
        let old_w = $('#timer').width();

        document.getElementById('timer').setAttribute('width', time);
        let ghgj = setTimeout(function() {
            if (time < 7) {
                next_task(-1);
                times();
            } else times();
        }, 40)
    } else { 
    	vvdcs = 0; 
    }
}

function start() {
    $("#body_").show();
    $("#noth1").hide();
    $("#start").hide();
    next_task(0);
    times();
}

function new_false_answer() {
    if (value == a - b || value == a + b) {
        new_fls_ans_numb = Math.round(Math.random() * (3 - 1) + 1);
        new_fls_ans_val = Math.round(Math.random() * (2 - 1) + 1);

        if (new_fls_ans_val == 2) {
            new_fls_ans_val = 10;
        } else if (new_fls_ans_val == 1) {
            new_fls_ans_val = -10;
        }

        switch (new_fls_ans_numb) {
            case 1:
                if (answer1.innerHTML != value) {
                    answer1.innerHTML = value + new_fls_ans_val;
                } else new_false_answer()
                break;
            case 2:
                if (answer2.innerHTML != value) {
                    answer2.innerHTML = value + new_fls_ans_val;
                } else new_false_answer()

                break;
            case 3:
                if (answer4.innerHTML != value) {
                    answer4.innerHTML = value + new_fls_ans_val;
                } else new_false_answer()

                break;
            case 4:
                if (answer4.innerHTML != value) {
                    answer4.innerHTML = value + new_fls_ans_val;
                } else new_false_answer()

                break;
        }

    }

}

setTimeout(function() {
    $("#start").show();
    $("#ghthtghtgh__BR").hide();
}, 50)
