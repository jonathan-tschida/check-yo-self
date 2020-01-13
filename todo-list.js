class ToDoList {
  constructor(title, tasks) {
    this.id = 'task' + new Date().valueOf();
    this.title = title;
    this.tasks = tasks;
    this.urgent = false;
  }

  saveToStorage() {
    var stringedList = JSON.stringify(this);
    window.localStorage.setItem(this.id, stringedList);
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
