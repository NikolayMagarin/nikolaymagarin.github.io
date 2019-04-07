firebase.initializeApp({
  apiKey: 'AIzaSyD2ZHAuDXywN1s_97NFOFBNGAQx5gutjTw',
  authDomain: 'arifmetika-6093f.firebaseapp.com',
  projectId: 'arifmetika-6093f',
})
var db = firebase.firestore();

function add_game_into_db() {
  let name = current_vk_user.first_name + " " + current_vk_user.last_name
  let vkid = current_vk_user.id
  let score = score
  let avatar = current_vk_user.avatar

  db.collection('games').add({
    name: name,
    vkid: vkid,
    score: score,
    avatar: avatar,
    date: Date.now()
  }).then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
}

async function get_games() {
  var games = [];
  db.collection("games").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        games.push(doc.data());
    });

    var anons = games.filter(item => item.vkid == null).filter(item => item.score > 0);
    var vk_users = games.filter(item => item.vkid != null);
    vk_users = vk_users.reduce((storage, item) => {
      storage[item.vkid] ? storage[item.vkid].push(item) : (storage[item.vkid] = [item,]);
      return storage;
    }, {})
    vk_users = Object.values(vk_users).map(item => item.sort((a, b) => a.score > b.score ? -1 : 1)[0])

    // var all_users = [...vk_users, ...anons].sort((a, b) => a.score > b.score ? -1 : 1);
    var all_users = [...vk_users].sort((a, b) => a.score > b.score ? -1 : 1);
    all_users.forEach(user => {
       render_rating_item(user.name, user.avatar, user.score);
    })
  });
}