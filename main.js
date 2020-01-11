var addTaskInput = document.getElementById('add-task-input');
var addTaskButton = document.getElementById('add-task-button');
var draftingBox = document.getElementById('drafting-box');
var taskTitleInput = document.getElementById('task-title-input');
var makeTaskListButton = document.getElementById('make-task-list-button');

addTaskButton.addEventListener('click', addNewTaskItem);
draftingBox.addEventListener('click', removeDraftedItem);
makeTaskListButton.addEventListener('click', makeNewTaskList);

function addNewTaskItem() {
  if (addTaskInput.value) {
  var newTaskItem = document.createElement('div');
  newTaskItem.classList.add('drafted-task-item');
  newTaskItem.innerHTML = `<input type='image' src='./assets/delete.svg' />
  <p>${addTaskInput.value}</p>`;
  draftingBox.appendChild(newTaskItem);
  }
}

function removeDraftedItem(event) {
  event.target.tagName === 'INPUT' &&
  event.target.parentElement.remove();
}

function makeNewTaskList() {
  var newToDo = createNewToDo();
}

function createNewToDo() {
  var newId = 'todo' + new Date().valueOf();
  var newTitle = taskTitleInput.value;
  var newTasks = createTaskArray();
  var newToDo = new ToDoList(newId, newTitle, newTasks);
  return newToDo;
}

function createTaskArray() {
  var taskArray = [];
  draftingBox.querySelectorAll('p').forEach(function(child) {
    taskArray.push(child.innerText);
  })
  return taskArray;
}
