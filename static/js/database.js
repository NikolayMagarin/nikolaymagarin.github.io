firebase.initializeApp({
  apiKey: 'AIzaSyD2ZHAuDXywN1s_97NFOFBNGAQx5gutjTw',
  authDomain: 'arifmetika-6093f.firebaseapp.com',
  projectId: 'arifmetika-6093f',
})
var db = firebase.firestore();

function add_game_into_db(name, vkid, score, avatar) {
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