
var score = 0,
    hp = 3,
    timer = 5 * 1000, // in milliseconds
    task = {
        a: null,
        b: null,
        operator: '',
        answer: null,
        answers_list: [null, null, null, null],
    };



// Returns random num x: a <= x <= b
function generate_random_number(a, b) {
    var x = Math.round(Math.random() * (b - a) + a);
    return x;
}


// Returns random operator
function generate_random_operator() { // ==> String
    let operators_list = [ '+', '-', '×', ":" ];
    return operators_list[generate_random_number(0, 3)];
}


function generate_answers_list(right_answer) { // ==> [Integer: x, Integer: y, Integer: z]
    var answers = [];
    var min_v = right_answer - 3;
    var max_v = right_answer + 3;
    while (answers.length < 4) {
        let wrong_answer = generate_random_number(min_v, max_v);
        if (answers.indexOf(wrong_answer) === -1) {
            arr.push(wrong_answer);
        }
    }
        if (answers.indexOf(right_answer) !== -1) {
            return answers;
        } else {
            return generate_answers_list(right_answer);
        }
    return answers;
}

function generate_components(operator) {
    var a, b, answer;

    switch (operator) {
        case "+":
            a = generate_random_number(1, 50);
            b = generate_random_number(1, 50);
            answer = a + b;
            break;
        case "-":
            a = generate_random_number(2, 90);
            if (a > 10) {
                b = generate_random_number(2, a-5);
            } else {
                b = generate_random_number(2, a);
            }
            answer = a - b;
            break;
        case "×":
            a = generate_random_number(2, 10);
            b = generate_random_number(2, 10);
            answer = a * b;
        case ":":
            var res = generate_divide_components();
            a = res[0];
            b = res[1];
            answer = res[2];
            break;
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

function generate_divide_components() {
    a = generate_random_number(8, 100);
    b = generate_random_number(4, 10);
    while (Math.round(a / b) !== a / b) {
        a++;
    }
    return [a, b, a/b]
}

