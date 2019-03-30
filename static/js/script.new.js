
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
    var x = Math.round(Math.random() * (a - b) + a);
    return x;
}


// Returns random operator
function generate_random_operator() { // ==> String
    let operators_list = [ '+', '-', '×', ":" ];
    return operators_list[generate_random_number(0, 3)];
}


function generate_wrong_answers(right_answer) { // ==> [Integer: x, Integer: y, Integer: z]
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
