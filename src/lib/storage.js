export default class Storage {
  constructor(client) {
    this.client = client;
    this.storage = this.client.app.storage();
  }

  uploadFile(contents) {
    return this.storage.ref().putString(contents);
  }
}
