function get_user(vk_user_id) {
    return new Promise(function(resolve, reject) {
        VK.api('users.get', 
            {
                "user_ids": vk_user_id, 
                "fields": "photo_max", 
                "v":"5.73"
            }, 
            function(data) { 
                try {
                    resolve(data.response[0])
                } catch {
                    reject(data)
                }
            }
        )
    })
}

async function get_avatar(vk_user_id) {
    var user = await get_user(vk_user_id);
    return user.photo_max;
}

function get_login_status() {
    return new Promise(function(resolve, reject) {
        VK.Auth.getLoginStatus(function(data) {
            try {
                resolve(data)
            } catch {
                reject(data)
            }
        })
    })
}


async function login_callback(data) {
    if (data.session) {
        current_vk_user.first_name = data.session.user.first_name;
        current_vk_user.last_name = data.session.user.last_name;
        current_vk_user.id = data.session.user.id;
        current_vk_user.avatar = await get_avatar(current_vk_user.id);
        $('vk-login-button').hide()
    }
    show_current_user()
}

function logout() {
    current_vk_user = {
        first_name: 'Аноним',
        last_name: '',
        id: null,
        avatar: '/static/images/anonymous.png',
    };
    VK.Auth.logout();
    show_current_user()
}

async function get_user_status() {
    data = await get_login_status();
    if (data.session) {
        var user = await get_user(data.session.mid);
        current_vk_user.first_name = user.first_name;
        current_vk_user.last_name = user.last_name;
        current_vk_user.id = user.id;
        current_vk_user.avatar = await get_avatar(current_vk_user.id);
        show_current_user()
    } else {
        $('.login-vk-button').removeClass('hide');
    }
}