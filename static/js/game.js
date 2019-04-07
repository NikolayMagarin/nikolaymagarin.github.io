// Helpers
const randInt = (a, b) => Math.round(Math.random() * (b - a) + a)
const components = {
    '+': () => { 
        let a = randInt(1, 50)
        let b = randInt(1, 50)
        return { a, b, answer: a + b }
    },
    '-': () => {
        let a = randInt(1, 50)
        let b = a > 10 ? randInt(2, a - 5) : randInt(2, a)
        return { a, b, answer: a - b }
    },
    '×': () => {
        let a = randInt(2, 10)
        let b = randInt(2, 10)
        return { a, b, answer: a * b }
    },
    ':': () => {
        let a = randInt(8, 100)
        let b = randInt(4, 10)
        while (Math.round(a / b) !== a / b) {
            a++;
        }
        return { a, b, answer: a / b }
    }
}
const randAnswers = (operator, answer) => {
    let answers = []
    while (answers.length < 4) {
        let wrong_answer = randInt(answer - 3, answer + 3);
        if (answers.indexOf(wrong_answer) === -1 && wrong_answer !== answer) {
            answers.push(wrong_answer);
        }
    }
    if (~['+', '-'].indexOf(operator)) {
        while (true) {
            const [i1, i2] = [randInt(0, 3), randInt(0, 3)]
            if (i1 !== i2) {
                answers[i1] = answer + ([-10, 10])[randInt(0, 1)]
                answers[i2] = answer
                break
            }
        }
    } else {
        answers[randInt(0, 3)] = answer
    }
    return answers
}


class Game {
    constructor() {
        this.level = 1
        this.score = 0
        this.hp = 3
        this.task = {}
        this.timer = this.time_per_task
        this.request_id = null
        this.start = null
    }

    start_task() {
        this.task = Game.generateTask()
        this.timer = this.time_per_task
        this.start = null
        this.level++

        $('.answer-btn').off('click', this.check_answer)
        $('.answer-btn').on('click', this.check_answer);
        show_hp(this.hp)
        show_task(this.task)
        show_score(this.score)

        this.request_id = window.requestAnimationFrame(this.update)
    }

    update = timestamp => {
        this.start = this.start ? this.start : timestamp
        let progress = timestamp - this.start
        if (this.timer <= 0) {
            this.hp--;
            if (this.hp <= 0) {
                this.game_over();
            } else {
                window.cancelAnimationFrame(this.request_id) 
                this.start_task();
            }
        } else {
            this.timer = this.time_per_task - progress
            this.request_id = window.requestAnimationFrame(this.update)    
        }
        this.render()
    }

    check_answer = (event) => {
        let answer = +event.target.innerText;
        if (answer == this.task.answer) {
            this.score += 10;
            console.log('RIGHT')
        } else {
            this.hp--;
            console.log("WRONG")
        }
        window.cancelAnimationFrame(this.request_id)
        if (this.hp > 0) {
            this.start_task()
        } else {
            this.game_over()
        }
    }

    game_over() {
        window.cancelAnimationFrame(this.request_id) 
        $('.screen.show').removeClass('show');
        $('.end-game-screen').addClass('show');
        $('.end-game-screen .score').text(this.score);
        $('.answer-btn').off('click', this.check_answer)
        generate_vk_share_btn(score);
        // add_game_into_db()
        console.log(`Game Over! Your score: ${this.score}`)
    }

    render() {
        show_timer(`${(this.timer / this.time_per_task) * 100}%` )
    }

    get time_per_task() {
        let l_level = this.level
        let time = 5000
        while (l_level > 10) {
            time -= 100
            l_level -= 5
        } 
        return time
    }

    static generateTask() {
        let operator = (['+', '-', '×', ':'])[randInt(0, 3)]
        const { a, b, answer } = components[operator]()
        const answers_list = randAnswers(operator, answer)
        return { a, b, operator, answer, answers_list }
    }
}