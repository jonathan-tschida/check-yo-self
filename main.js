var toDos = [];
var addTaskInput = document.getElementById('add-task-input');
var addTaskButton = document.getElementById('add-task-button');
var draftingBox = document.getElementById('drafting-box');
var taskTitleInput = document.getElementById('task-title-input');
var makeTaskListButton = document.getElementById('make-task-list-button');
var clearAllButton = document.getElementById('clear-all-button');
var cardSection = document.querySelector('.card-section');

addTaskButton.addEventListener('click', addNewTaskItem);
draftingBox.addEventListener('click', removeDraftedItem);
addTaskInput.addEventListener('input', preventDefault);
taskTitleInput.addEventListener('input', preventDefault);
draftingBox.addEventListener('click', preventDefault);
addTaskButton.addEventListener('click', preventDefault);
makeTaskListButton.addEventListener('click', makeNewTaskList);
clearAllButton.addEventListener('click', clearAll);

function addNewTaskItem() {
  var newTaskItem = document.createElement('div');
  newTaskItem.classList.add('drafted-task-item');
  newTaskItem.innerHTML = `<input type='image' src='./assets/delete.svg' />
                           <p>${addTaskInput.value}</p>`;
  draftingBox.appendChild(newTaskItem);
  addTaskInput.value = '';
}

function removeDraftedItem(event) {
  event.target.tagName === 'INPUT' &&
  event.target.parentElement.remove();
}

function enableButton(input, button) {
  input.value && (button.disabled = false);
  input.value || (button.disabled = true);
}

function preventDefault() {
  addTaskInput.value ?
    addTaskButton.disabled = false :
    addTaskButton.disabled = true;
  (draftingBox.innerText && taskTitleInput.value) ?
    makeTaskListButton.disabled = false :
    makeTaskListButton.disabled = true;
  (draftingBox.innerText || taskTitleInput.value) ?
    clearAllButton.disabled = false :
    clearAllButton.disabled = true;
}

function makeNewTaskList() {
  var newToDo = createNewToDo();
  toDos.push(newToDo);
  var newTask = document.createElement('article');
  newTask.classList.add('to-do-list');
  newTask.id = newToDo.id;
  newTask.innerHTML = `<h2>${newToDo.title}</h2>
                      <div class="list-of-tasks">
                      </div>
                      <div class="button-box">
                        <div class="urgent-box">
                          <input type="image" src="./assets/urgent.svg"
                          <p>URGENT</p>
                        </div>
                        <div class="delete-box">
                          <input type="image" src="./assets/delete.svg" />
                          <p>DELETE</p>
                        </div>
                      </div>`;
  newToDo.tasks.forEach(function(taskItem) {
    var newTaskItem = document.createElement('div');
    newTaskItem.classList.add('task-item');
    newTaskItem.innerHTML = `<input type="image" src="./assets/checkbox.svg" />
    <p>${taskItem.text}</p>`;
    newTask.querySelector('.list-of-tasks').appendChild(newTaskItem);
  });
  cardSection.insertBefore(newTask, cardSection.childNodes[0]);
  clearAll();
}

function createNewToDo() {
  var newId = 'todo' + new Date().valueOf();
  var newTitle = taskTitleInput.value;
  var newTasks = createTasks();
  var newToDo = new ToDoList(newId, newTitle, newTasks);
  return newToDo;
}

function createTasks() {
  var newTasks = [];
  draftingBox.querySelectorAll('p').forEach(function(child) {
    newTasks.push(new Task (child.innerText));
  })
  return newTasks;
}

function clearAll() {
  taskTitleInput.value = '';
  addTaskInput.value = '';
  draftingBox.innerHTML = '';
  makeTaskListButton.disabled = true;
  clearAllButton.disabled = true;
}
