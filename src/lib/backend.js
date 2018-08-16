import FirebaseClient from './firebase-client';
import LocalStorage from './local-storage';
import * as config from '../config/firebase.json';
import Auth from './auth';
import Database from './database';
import Storage from './storage';

const aliments = ['chocolate', 'banana', 'apple', 'pineapple', 'toast', 'french fries', 'burger'];
const authors = ['Arnaud', 'Antoine', 'Nicolas', 'Thomas', 'Léa', 'Robert'];
const avatars = [
  'https://pbs.twimg.com/profile_images/1000483318264102913/U6OJQtLs_reasonably_small.jpg',
  'https://pbs.twimg.com/profile_images/972170159614906369/0o9cdCOp_reasonably_small.jpg',
  'https://pbs.twimg.com/profile_images/632821853627678720/zPKK7jql_reasonably_small.png',
  'https://pbs.twimg.com/profile_images/1019548245326852097/Q3giU2_S_reasonably_small.jpg',
];
const attachments = [
  'https://pbs.twimg.com/media/DkVKU-GWsAAoc2m.jpg',
  'https://pbs.twimg.com/media/DkW7JdsW0AA40lV.jpg',
];
function generateTweets(limit) {
  const tweets = [];
  for (let i = 0; i < limit; i++) {
    const displayName = authors[Math.floor(Math.random() * authors.length)];
    const name = displayName.toLowerCase();
    const avatar = avatars[Math.floor((Math.random() * avatars.length))];

    let attachment;

    if (Math.random() > 0.8) {
      attachment = { url: attachments[Math.floor((Math.random() * attachments.length))] };
    }

    tweets.push({
      key: '' + i,
      tweet: `I love eating ${aliments[Math.floor(Math.random() * aliments.length)]}!`,
      author: {
        displayName,
        name,
        avatar,
        id: i,
      },
      postedAt: new Date(Date.now() - (i * 1000 * 1000)),
      attachments: attachment ? [attachment] : [],
    });
  }
  return tweets;
}
const tweets = generateTweets(30);

const client = new FirebaseClient({
  API_KEY: config.API_KEY,
  AUTH_DOMAIN: config.AUTH_DOMAIN,
  DATABASE_URL: config.DATABASE_URL,
  STORAGE_BUCKET: config.STORAGE_BUCKET,
});

const database = new Database(client);
const auth = new Auth(client);
const storage = new Storage(client);

const Backend = {
  client,
  auth,
  database,
  storage,
}

export default Backend;
