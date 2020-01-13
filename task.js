class Task {
  constructor(text) {
    this.id = 'task' + new Date().valueOf();
    this.text = text;
    this.completed = false;
  }
}
