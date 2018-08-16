import LocalStorage from './local-storage';

export default class Auth {
  constructor(client) {
    this.client = client;
    this.auth = this.client.app.auth();
    this.currentUser = () => this.client.app.auth().currentUser;
    this.listenToAuthStateChanges();
  }

  listenToAuthStateChanges() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        LocalStorage.set(LocalStorage.KEYS.USER_AUTHENTICATED, '1');
        LocalStorage.set(LocalStorage.KEYS.USER, JSON.stringify(user));
      } else {
        LocalStorage.delete([LocalStorage.KEYS.USER_AUTHENTICATED, LocalStorage.KEYS.USER]);
      }
    });
  }

  /**
   * To create an email account with a `displayName`, we need to first
   * create the account, then sign in to be able to update the `displayName`
   * user property.
   * Only then we consider the account to be created.
   */
  createEmailAccount({ email, password, displayName }) {
    return new Promise((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          this.signInWithEmail(email, password).then(() => {
            this.client.app.auth().currentUser
              .updateProfile({ displayName })
              .then(() => resolve(user))
              .catch(reject);
          });
        })
        .catch(reject)
    });
  }

  signInWithEmail(email, password) {
    return new Promise((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(email, password)
        .then(resolve)
        .catch(reject);
    });
  }

  signOut() {
    return this.auth.signOut();
  }
}
