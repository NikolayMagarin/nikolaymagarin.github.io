// let SIZE = Math.round(prompt("Input field size:", 10)) || 10;
const SIZE = 10;
let blocks;
let horse;
let possible_crosses = [...new Array(SIZE*SIZE)].map((item, index) => index)
let autoplay_interval;

let clicked_on_the_horse = 0;


for (let i = 1; i <= SIZE*SIZE; i++) {
    blocks = document.createElement('div');
    back.appendChild(blocks);
    blocks.classList.add('block_gray');
    blocks.classList.add('block_silver');
}

let style = document.createElement('style');
style.innerText = ".block_gray{width: calc(" + (100 / SIZE) + "% - 2px);}"; 
document.querySelector('head').appendChild(style);

blocks = document.getElementsByClassName('block_gray');

function start() {
    $('.block_gray').off('click', move).on('click', move);
    possible_crosses = [...new Array(SIZE*SIZE)].map((item, index) => index)
}

function move() {
    let $block = $(this);
    if ($block.hasClass('block_silver')) {
        $('.horse').removeClass('horse');
        $block.addClass('horse');
        $('.block_silver').removeClass('block_silver');
        clicked_on_the_horse = 0;
        opponent_move().then(show_movement_options);
    }
    else {
        if ($block.hasClass('horse')) {
            clicked_on_the_horse++;
            if (clicked_on_the_horse >= 5) {
                autoplay()
            }
        } else {
            clicked_on_the_horse = 0;
        }

        $('.alert-container').append($('<div class="alert alert-warning fade show" role="alert">' +
            'You can move only on the selected cells!' +
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
              '</button>' +
            '</div>'))

        setTimeout(function() {
            $('.alert').alert('close');
        }, 1500)
    }
    
}

function show_movement_options() {
    let possible_moves = [
        [ 2,  -1],
        [ 2,   1],
        [ 1,   2],
        [-1,   2],
        [-2,   1],
        [-2,  -1],
        [-1,  -2],
        [ 1,  -2]
    ]
    let horse_index = [...blocks].indexOf(document.querySelector('.horse'))
    let horse_coord = [horse_index % SIZE, Math.floor(horse_index / SIZE)]

    $(".block_silver").removeClass('block_silver');
    setTimeout(function() {
        possible_moves.forEach(function(coord) {
            let block_silver_coords = [(coord[0] + horse_coord[0]), (coord[1] + horse_coord[1])]
            let block_silver_index = (block_silver_coords[0]) + SIZE * block_silver_coords[1];

            if (0 <= block_silver_coords[0] && block_silver_coords[0] < SIZE
             && 0 <= block_silver_coords[1] && block_silver_coords[1] < SIZE 
             && 0 <= block_silver_index && block_silver_index < SIZE*SIZE
             && !blocks[block_silver_index].classList.contains('cross')) {
                    blocks[block_silver_index].classList.add('block_silver')
            }
        })

        if (document.querySelectorAll(".block_silver:not(.cross)").length <= 0) {
            game_over("It's no available moves.")
        }
    }, 10)
}

function opponent_move() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() { 
            let opponent_index = possible_crosses.splice(
                Math.floor(Math.random() * possible_crosses.length), 1);
            let opponent_block = blocks[opponent_index];

            if (opponent_block.classList.contains('horse')) {
                (new Promise(function(resolve, reject) {
                    opponent_block.classList.add('cross');
                    resolve()
                })).then(function() {
                    game_over("You have been catched by The Red Cross!")
                })
            }
            opponent_block.classList.add('cross');
            resolve();
        }, Math.random() * 100);
    })
}

function game_over(reason) {
    reason = reason || ''
    if (autoplay_interval) {
        clearInterval(autoplay_interval)
    }
    $("#gameOverModal .modal-body").text(reason + " Would you like to play again?");
    $("#gameOverModal").modal('show');
}

function reset() {
    possible_crosses = [...new Array(SIZE*SIZE)].map((item, index) => index)
    $('#back .block_gray')
        .removeClass('horse')
        .removeClass('cross')
        .addClass('block_silver');
}

function play_again() {
    reset();
    start();
    $("#gameOverModal").modal('hide')
}

function autoplay() {
    autoplay_interval = setInterval(function() {
        if ($(".block_silver").length) {
            let index = Math.floor(Math.random() * $(".block_silver").length);
            $(".block_silver")[index].click();
        }
    }, 400)
}

start();
