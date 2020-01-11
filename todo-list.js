class ToDoList {
  constructor(id, title, tasks) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
    this.urgent = false;
  }

  saveToStorage() {
    window.localStorage.setItem(this.id, this);
  }

  deleteFromStorage() {
    window.localStorage.removeItem(this.id);
  }

  updateToDo(newTitle) {
    newTitle && (this.title = newTitle);
    this.urgent = !this.urgent;
  }

  updateTask(task, newContent) {
    newContent && (task.text = newContent);
    task.completed = !task.completed;
  }
}
