import * as firebase from 'firebase';

export default class FirebaseClient {
  constructor(config) {
    const firebaseConfig = {
      apiKey: config.API_KEY,
      authDomain: config.AUTH_DOMAIN,
      databaseURL: config.DATABASE_URL,
      storageBucket: config.STORAGE_BUCKET,
    };

    this.app = firebase.initializeApp(firebaseConfig);
  }
}
