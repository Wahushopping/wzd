const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceAccount.json"); // path to the key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
