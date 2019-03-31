
var score = 0,
    hp = 3,
    timer = 5 * 1000, // in milliseconds
    task = {
        a: null,
        b: null,
        operator: '',
        answer: null,
        answers_list: [null, null, null, null],
    },
    global_interval = null;



// Returns random num x: a <= x <= b
function generate_random_number(a, b) {
    var x = Math.round(Math.random() * (a - b) + a);
    return x;
}


// Returns random operator
function generate_random_operator() { // ==> String
    let operators_list = [ '+', '-', '×', ":" ];
    return operators_list[generate_random_number(0, 3)];
}


function generate_answers_list(right_answer) { // ==> [Integer: x, Integer: y, Integer: z]
    var answers = [];
    answers.push(right_answer);

    // ...

    return answers;
}

function generate_components(operator) {
    var a, b, answer;

    switch (operator) {
        case "+":
            a = generate_random_number(7, 11);
            b = generate_random_number(7, 11);
            answer = a + b;
            break;
        case "-":
            a = generate_random_number(/* ... */);
            b = generate_random_number(/* ... */);
            answer = a - b;
            break;
        case "×":
            // ...
        case ":":
            // ...
    }

    return { a: a, b: b, answer: answer };
}


// Generates task object 
function generate_task() { // ==> Object: { a, b, operator, answer, answers_list }
    var operator = generate_random_operator();
    var components = generate_components(operator);
    var answers_list = generate_answers_list(components.answer);

    return {
        a: components.a,
        b: components.b,
        operator: operator,
        answer: components.answer,
        answers_list: answers_list
    };
}


function check_answer() {
    var $button = $(this);
    var answer = +$button.text();
    if (answer == task.answer) {
        score += 10;
    } else {
        hp--;
    }
    if (hp > 0) {
        start_task();
    } else {
        game_over();
    }
}

/** DOM Opertaions **/

function show_hp(hp) {
    var $hp_point = $('<div class="hp"></div>');
    $('.hp-block-wrapper .hp').remove();
    for (var i = 0; i < hp; i++) {
        $('.hp-block-wrapper').append($hp_point.clone());
    } 
}

function show_score(score) {
    $('#score').text(score);
}

function show_task(task_data) {
    var task = task_data.a + " " + task_data.operator + " " + task_data.b;
    $('#task').text(task);
    var $answer_button_list = $('.answer-btn');
    for (var i = 0; i < task_data.answers_list.length; i++) {
        $($answer_button_list[i]).text(task_data.answers_list[i]);
    }
}

function show_timer(current_time) {
    var max_width = $('.timer-wrapper').width();
    var max_time = 5000;
    var current_width = max_width * current_time / max_time;
    $('#timer').width(current_width);
}

/*******************/


function start_task() {
    task = generate_task();
    timer = 5000;
    show_task(task);
    show_score(score);
    show_hp(hp);

    if (global_interval != null) {
        clearInterval(global_interval);
    }

    global_interval = setInterval(function() {
        timer -= 10;
        show_timer(timer);
        if (timer <= 0) {
            hp--;
            if (hp <= 0) {
                game_over();
            } else {
                start_task();
            }
        }
    }, 10)
}


function init_game() {
    $('.answer-btn').off('click', check_answer).on('click', check_answer);
    hp = 3;
    score = 0;
    start_task();
}

function game_over() {
    if (global_interval != null) {
        clearInterval(global_interval);
    }
    $('.main-game-screen').removeClass('show');
    $('.end-game-screen').addClass('show');
    $('.end-game-screen .score').text(score);
}



