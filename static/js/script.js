var current_vk_user = {
    first_name: 'Аноним',
    last_name: '',
    id: null,
    avatar: '/static/images/anonymous.png',
};

var game = null;

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
    $answer_button_list.css('color', 'white')
    for (var i = 0; i < task_data.answers_list.length; i++) {
        $($answer_button_list[i]).text(task_data.answers_list[i]);
        if (task_data.answers_list[i] === task_data.answer) {
            $($answer_button_list[i]).css('color', 'red')
        }
    }
}

function show_timer(width) {
    $('#timer').width(width);
}

function generate_vk_share_btn(score) {
    var share_options = {
        title: "Я набрал " + score + " очков в игре \"Арифметика\"! А сколько наберешь ты?"
    };
    var button_options = {
        type: "custom", 
        text: "<img src=\"https://vk.com/images/share_32.png\" width=\"32\" height=\"32\" />",
    }
    $('#vk_share_btn').html(VK.Share.button(share_options, button_options));
}

function show_current_user() {
    var name = current_vk_user.first_name + " " + current_vk_user.last_name;
    var avatar = current_vk_user.avatar;
    $('.profile-info .profile-avatar').attr('src', avatar);
    $('.profile-info .profile-name').text(name);

    if (current_vk_user.id) {
        $('.profile-info .profile-logout').removeClass('hide');
        $('.login-vk-button').addClass('hide');

    } else {
        $('.profile-info .profile-logout').addClass('hide');
        $('.login-vk-button').removeClass('hide');
    }
}

function render_rating_item(name, avatar, score) {
    var template = ''+
    '<div class="rating-item">' +
        '<div class="rating-profile-info">' +
            '<img src="${avatar}" alt="" class="profile-avatar"/>' +
            '<div class="profile-name">${name}</div>' +
        '</div>' +
        '<div class="rating-score">${score}</div>' +
    '</div>';

    template = template.replace('${name}', name);
    template = template.replace('${avatar}', avatar);
    template = template.replace('${score}', score);
    $('.rating-list').append($(template));
}

function back_to_main_menu() {
    $('.screen.show').removeClass('show');
    $('.start-screen').addClass('show');
}

function init_game() {
    $('.end-game-screen').removeClass('show');
    $('.start-screen').removeClass('show');
    $('.main-game-screen').addClass('show');
    game = new Game()
    game.start_task()
}




