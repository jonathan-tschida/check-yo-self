class ToDoList {
  constructor(toDoList) {
    this.id = toDoList.id || 'task' + new Date().valueOf();
    this.title = toDoList.title;
    this.tasks = toDoList.tasks;
    this.urgent = toDoList.urgent || false;
  }

  saveToStorage() {
    var stringedList = JSON.stringify(this);
    window.localStorage.setItem(this.id, stringedList);
  }

  deleteFromStorage() {
    window.localStorage.removeItem(this.id);
  }

  updateToDo(newTitle) {
    newTitle ? this.title = newTitle : this.urgent = !this.urgent;
  }

  updateTask(task, newContent) {
    newContent ? task.text = newContent : task.completed = !task.completed;
  }
}
