class Task {
  constructor(text) {
    this.id = 'task' + new Date().valueOf() + Math.floor(Math.random() * 10000);
    this.text = text;
    this.completed = false;
  }
}
