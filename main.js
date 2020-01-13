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
addTaskInput.addEventListener('input', enableButtons);
taskTitleInput.addEventListener('input', enableButtons);
draftingBox.addEventListener('click', enableButtons);
addTaskButton.addEventListener('click', enableButtons);
makeTaskListButton.addEventListener('click', makeNewTaskList);
clearAllButton.addEventListener('click', clearAll);
cardSection.addEventListener('click', toggleCheckbox);
cardSection.addEventListener('click', deleteTaskList);
cardSection.addEventListener('click', toggleUrgent);
window.addEventListener('load', loadStoredLists);

function addNewTaskItem() {
  var newTask = new Task(addTaskInput.value);
  var newTaskItem = document.createElement('div');
  toDos.push(newTask);
  newTaskItem.classList.add('drafted-task-item');
  newTaskItem.id = newTask.id;
  newTaskItem.innerHTML = `<input type='image' src='./assets/delete.svg' />
                           <p>${addTaskInput.value}</p>`;
  draftingBox.appendChild(newTaskItem);
  addTaskInput.value = '';
}

function removeDraftedItem(event) {
  event.target.tagName === 'INPUT' &&
  event.target.parentElement.remove();
  event.target.tagName === 'INPUT' &&
  toDos.splice(toDos.indexOf(toDos.find(function(task) {
    return task.id === event.target.closest('.drafted-task-item').id
  })), 1);
}

function enableButtons() {
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
  var newTaskList = createNewToDo();
  newTaskList.saveToStorage();
  var newToDoCard = createToDoCard(newTaskList);
  cardSection.insertBefore(newToDoCard, cardSection.childNodes[2]);
  clearAll();
}

function createToDoCard(toDoList) {
  var newToDoCard = document.createElement('article');
  newToDoCard.classList.add('to-do-list');
  newToDoCard.id = toDoList.id;
  newToDoCard.innerHTML = `<h2>${toDoList.title}</h2>
                      <div class="list-of-tasks">
                      </div>
                      <div class="button-box">
                        <div class="urgent-box">
                          <input type="image" src="./assets/urgent.svg" class="urgent-button" />
                          <p>URGENT</p>
                        </div>
                        <div class="delete-box">
                          <input type="image" src="./assets/delete.svg" class="delete-button" />
                          <p>DELETE</p>
                        </div>
                      </div>`;
  toDoList.tasks.forEach(function(task) {
    var newTaskItem = document.createElement('div');
    newTaskItem.classList.add('task-item');
    newTaskItem.id = task.id;
    newTaskItem.innerHTML = `<input type="image" src="./assets/checkbox.svg" class="check-box" />
    <p>${task.text}</p>`;
    newToDoCard.querySelector('.list-of-tasks').appendChild(newTaskItem);
  });
  return newToDoCard;
}

function createNewToDo() {
  var newTitle = taskTitleInput.value;
  var newTasks = [...toDos];
  var newToDo = new ToDoList({title: newTitle, tasks: newTasks});
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
  toDos = [];
  makeTaskListButton.disabled = true;
  clearAllButton.disabled = true;
}

function toggleCheckbox(event) {
  if (event.target.classList.contains('check-box')) {
    // var thisToDo = toDos.find(function(todo) {
    //     return todo.id === event.target.closest('.to-do-list').id;
    //   });
    var thisToDo = pullFromStorage(event.target.closest('.to-do-list').id);
    var thisTask = thisToDo.tasks.find(function(task) {
        return task.id === event.target.parentNode.id;
    });
    thisToDo.updateTask(thisTask);
    thisToDo.saveToStorage();
    event.target.parentNode.classList.toggle('checked');
  }
}

function deleteTaskList(event) {
  if (event.target.classList.contains('delete-button')) {
    var thisToDo = pullFromStorage(event.target.closest('.to-do-list').id);
    if (thisToDo.tasks.every(function(task) {
      return task.completed;
    })) {
      thisToDo.deleteFromStorage();
      event.target.closest('.to-do-list').remove();
    }
  }
}

function toggleUrgent() {
  if (event.target.classList.contains('urgent-button')) {
    // var thisToDo = toDos.find(function(todo) {
    //     return todo.id === event.target.closest('.to-do-list').id;
    //   });
    var thisToDo = pullFromStorage(event.target.closest('.to-do-list').id);
    thisToDo.updateToDo();
    thisToDo.saveToStorage();
    event.target.closest('.to-do-list').classList.toggle('urgent');
  }
}

function loadStoredLists() {
  var sortedStorage = Object.entries(window.localStorage).sort(function(a, b) {
    return a > b ? 1 : -1;
  });
  sortedStorage.forEach(function(storedItem) {
    var parsedObject = new ToDoList (JSON.parse(storedItem[1]));
    cardSection.insertBefore(createToDoCard(parsedObject), cardSection.childNodes[2]);
    checkBoxes(parsedObject.id);
    markUrgent(parsedObject.id);
  });
}

function pullFromStorage(id) {
  return new ToDoList(JSON.parse(window.localStorage.getItem(id)));
}

function checkBoxes(id) {
  var thisToDoList = pullFromStorage(id);
  var thisCard = document.getElementById(id);
  thisToDoList.tasks.forEach(function(task) {
  task.completed && document.getElementById(task.id).classList.add('checked');
  });
}

function markUrgent(id) {
  var thisToDoList = pullFromStorage(id);
  var thisCard = document.getElementById(id);
  thisToDoList.urgent && thisCard.classList.add('urgent');
}
