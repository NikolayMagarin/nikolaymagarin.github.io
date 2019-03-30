
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


// Gets a, b and operator as string and returns the right answer
function calculate_value(a, b, operator) { // ==> Integer
    // need to find solution for "divide" operator
    switch (operator) {
        case "×":
            return a * b;
        // ...
    }
}



function get_range_for_operator(operator) { // ==> [Integer: min, Integer: max]
    switch (operator) {
        case "×":
            return [2, 11];
        // ...
    }
}


function generate_wrong_answers(right_answer) { // ==> [Integer: x, Integer: y, Integer: z]

}


// Generates task object 
function generate_task() { // ==> Object: { a, b, operator, answer, answers_list }
    var operator = generate_random_operator();
    var range = get_range_for_operator(operator);
    var a = generate_random_number(range[0], range[1]);
    var b = generate_random_number(range[0], range[1]);
    var answer = calcuate_value(a, b, operator);
    var answers_list = generate_wrong_answers(answer);

    return {
        a: a,
        b: b,
        operator: operator,
        answer: answer,
        answers_list: answers_list
    };
}
