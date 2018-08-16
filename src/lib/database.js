import * as firebase from 'firebase';
import md5 from 'md5';

function tweetComparator(a, b) {
  if (a.postedAt < b.postedAt) {
    return 1;
  }

  if (a.postedAt > b.postedAt) {
    return -1;
  }

  return 0;
}

export default class Database {
  constructor(client) {
    this.client = client;
    this.database = this.client.app.database();
    this.cache = {};
  }

  forceFetchAllTweets() {
    return this.fetchAllTweets(true);
  }

  fetchAllTweets(forceRefresh=false) {
    console.log('current', this.client.app.auth().currentUser);

    if (!forceRefresh && this.cache.tweets) {
      console.log('Fetching all tweets: used cache');
      return new Promise.resolve(this.cache.tweets);
    }

    return this.database.ref('tweets')
      .orderByChild('postedAt')
      .once('value')
      .then((snapshot) => {
        console.log('Fetching all tweets' + (forceRefresh ? ': FORCED' : ''));

        const tweets = Object.values(snapshot.val()).sort(tweetComparator);
        this.cache.tweets = tweets;
        return tweets;
      });
  }

  async fetchUserTweets(uid) {
    let tweets;

    if (this.cache.tweets) {
      tweets = this.cache.tweets;
    } else {
      tweets = await this.fetchAllTweets();
    }

    return tweets.filter((tweet) => tweet.author.id === uid);
  }

  realTimeTweets(callback) {
    const tweetsRef = this.database.ref('tweets');
    let tweets = [];

    tweetsRef.on('child_added', (data) => {
      tweets.push(data.val());
      tweets = tweets.sort(tweetComparator)
      callback(tweets);
      this.cache.tweets = tweets;
    });

    tweetsRef.on('child_changed', (data) => {
      const updatedTweet = data.val();
      tweets = tweets.map((tweet) => {
        if (tweet.key === updatedTweet.key) {
          return updatedTweet;
        }
        return tweet;
      });
      callback(tweets);
      this.cache.tweets = tweets;
    });

    tweetsRef.on('child_removed', (data) => {
      tweets = tweets.filter((tweet) => tweet.key !== data.val().key);
      callback(tweets);
      this.cache.tweets = tweets;
    });

    return {
      unsubscribe: () => {
        tweetsRef.off();
      }
    };
  }

  postTweet(message) {
    const currentUser = this.client.app.auth().currentUser;

    if (!currentUser) {
      alert('No current user logged in. Please sign in again first.');
      return;
    }

    const tweetRef = this.database.ref('tweets').push();
    const tweetKey = tweetRef.key;
    const avatar = `https://www.gravatar.com/avatar/${md5(currentUser.email.toLowerCase())}`;

    return tweetRef.set({
      author: {
        avatar,
        displayName: currentUser.displayName,
        id: currentUser.uid,
        name: currentUser.displayName.toLowerCase(),
      },
      key: tweetKey,
      postedAt: firebase.database.ServerValue.TIMESTAMP,
      tweet: message,
    });
  }

  deleteTweet(key) {
    return this.database.ref('tweets').child(key).remove();
  }
}
