// QuerySelectors
// Inputs
var searchInput = document.getElementById('search-input');
var taskTitleInput = document.getElementById('task-title-input');
var draftTaskInput = document.getElementById('draft-task-input');
// Buttons
var draftTaskButton = document.getElementById('draft-task-button');
var makeTaskListButton = document.getElementById('make-task-list-button');
var clearAllButton = document.getElementById('clear-all-button');
var filterUrgencyButton = document.getElementById('filter-urgency-button');
// Containers
var sidebar = document.querySelector('.sidebar');
var draftingBox = document.getElementById('drafting-box');
var cardSection = document.querySelector('.card-section');
// Extensions
var searchDropDown = document.getElementById('search-drop-down');
// Global Variables
var toDos = [];
// Event Listeners
window.addEventListener('load', loadStoredLists);
// Header
searchInput.addEventListener('input', searchToDos);
searchDropDown.addEventListener('input', searchToDos);
// Sidebar
sidebar.addEventListener('click', sidebarClickHandler);
taskTitleInput.addEventListener('input', enableButtons);
draftTaskInput.addEventListener('input', enableButtons);
draftTaskInput.addEventListener('keydown', draftTaskHandler);
// Card Section
cardSection.addEventListener('click', toDoListHandler);
// Editable Text
cardSection.addEventListener('focusout', editHandler);
cardSection.addEventListener('keydown', enterHandler);
// Adding New Tasks
cardSection.addEventListener('input', enableNewTask);
// Functions
// Sidebar
function sidebarClickHandler(event) {
  event.target === draftTaskButton &&
    draftTaskItem();
  event.target.classList.contains('remove-task-button') &&
    removeDraftedItem(event);
  event.target === makeTaskListButton &&
    makeNewTaskList();
  event.target === clearAllButton &&
    clearAll();
  event.target === filterUrgencyButton &&
    toggleUrgentFilter();
  enableButtons();
}

function draftTaskHandler(event) {
  (event.which === 13 && draftTaskButton.disabled === false) &&
    draftTaskItem();
  enableButtons();
}

function draftTaskItem() {
  var newTask = new Task(draftTaskInput.value);
  var draftedTaskItem = document.createElement('div');
  toDos.push(newTask);
  draftedTaskItem.classList.add('drafted-task-item');
  draftedTaskItem.id = newTask.id;
  draftedTaskItem.innerHTML = `<input type='image' src='./assets/delete.svg' class='remove-task-button' />
                           <p>${newTask.text}</p>`;
  draftingBox.appendChild(draftedTaskItem);
  draftTaskInput.value = '';
}

function removeDraftedItem(event) {
  var thisDraftedTaskItem = toDos.find(function(task) {
    return task.id === event.target.closest('.drafted-task-item').id
  });
  event.target.parentElement.remove();
  toDos.splice(toDos.indexOf(thisDraftedTaskItem), 1);
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
  newToDoCard.innerHTML = `<h2 contenteditable='true'>${toDoList.title}</h2>
                          <div class='list-of-tasks'>
                          </div>
                          <div class='button-box'>
                            <div class='urgent-box'>
                              <input type='image' src='./assets/urgent.svg' class='urgent-button' />
                              <p>URGENT</p>
                            </div>
                            <div class='new-task-box'>
                              <input type='text' />
                              <input type='button' value='+' disabled='true' class='add-task-button' />
                            </div>
                            <div class='delete-box'>
                              <input type='image' src='./assets/delete.svg' class='delete-button' />
                              <p>DELETE</p>
                            </div>
                          </div>`;
  toDoList.tasks.forEach(function(task) {
    newToDoCard.querySelector('.list-of-tasks').appendChild(generateTaskItem(task));
  });
  return newToDoCard;
}

function generateTaskItem(task) {
  var newTaskItem = document.createElement('div');
  newTaskItem.classList.add('task-item');
  newTaskItem.id = task.id;
  newTaskItem.innerHTML = `<input type='image' src='./assets/checkbox.svg' class='check-box' />
                          <p contenteditable='true'>${task.text}</p>`;
  return newTaskItem;
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
  draftTaskInput.value = '';
  draftingBox.innerHTML = '';
  toDos = [];
  makeTaskListButton.disabled = true;
  clearAllButton.disabled = true;
}

function enableButtons() {
  draftTaskButton.disabled = !(draftTaskInput.value)
  makeTaskListButton.disabled = !(draftingBox.innerText && taskTitleInput.value);
  clearAllButton.disabled = !(draftingBox.innerText || taskTitleInput.value);
}
// Card Section
function toDoListHandler(event) {
  var thisToDo = event.target.closest('.to-do-list') &&
    pullFromStorage(event.target.closest('.to-do-list').id);
  event.target.classList.contains('check-box') &&
    toggleCheckbox(event, thisToDo);
  event.target.classList.contains('delete-button') &&
    deleteTaskList(event, thisToDo);
  event.target.classList.contains('urgent-button') &&
    toggleUrgent(event, thisToDo);
  event.target.classList.contains('add-task-button') &&
    addNewTask(event, thisToDo);
}

function toggleCheckbox(event, toDo) {
  var thisTask = toDo.tasks.find(function(task) {
    return task.id === event.target.parentNode.id;
  });
  toDo.updateTask(thisTask);
  toDo.saveToStorage();
  event.target.parentNode.classList.toggle('checked');
}

function deleteTaskList(event, toDo) {
  if (toDo.tasks.every(function(task) {
    return task.completed;
  })) {
    toDo.deleteFromStorage();
    event.target.closest('.to-do-list').remove();
  }
}

function toggleUrgent(event, toDo) {
  toDo.updateToDo();
  toDo.saveToStorage();
  event.target.closest('.to-do-list').classList.toggle('urgent');
}
// Storage and Searching
function loadStoredLists() {
  var sortedStorage = Object.entries(window.localStorage).sort(function(a, b) {
    return a > b ? 1 : -1;
  });
  cardSection.querySelectorAll('article').forEach(function(article) {
    article.remove();
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

function toggleUrgentFilter() {
  filterUrgencyButton.classList.toggle('filtered');
  filterUrgencyButton.classList.contains('filtered') ?
    showUrgentOnly() :
    searchToDos();
}

function showUrgentOnly() {
  cardSection.querySelectorAll('article').forEach(function(article) {
    article.classList.contains('urgent') ||
      article.remove();
  });
}
// Extensions
// Editable Text
function editHandler(event) {
  var thisToDo = event.target.closest('.to-do-list') &&
    pullFromStorage(event.target.closest('.to-do-list').id);
  event.target.tagName === 'H2' &&
    editTitle(event, thisToDo);
  event.target.tagName === 'P' &&
    editTask(event, thisToDo);
}

function enterHandler(event) {
  var thisToDo = event.target.closest('.to-do-list') &&
    pullFromStorage(event.target.closest('.to-do-list').id);
  if (event.target.tagName === 'H2' && event.which === 13) {
    editTitle(event, thisToDo);
    event.target.blur();
  }
  if (event.target.tagName === 'P' && event.which === 13) {
    editTask(event, thisToDo);
    event.target.blur();
  }
}

function editTitle(event, toDo) {
  toDo.updateToDo(event.target.innerText);
  toDo.saveToStorage();
}

function editTask(event, toDo) {
  var thisTask = toDo.tasks.find(function(task) {
    return task.id === event.target.parentNode.id;
  });
  toDo.updateTask(thisTask, event.target.innerText);
  toDo.saveToStorage();
}

// Search Extension
function searchToDos() {
  loadStoredLists();
  filterUrgencyButton.classList.contains('filtered') && showUrgentOnly();
  cardSection.querySelectorAll('article').forEach(function(article) {
    var hasMatchingTitle = pullFromStorage(article.id).title.toLowerCase().includes(searchInput.value.toLowerCase());
    var hasMatchingTask = pullFromStorage(article.id).tasks.find(function(task) {
        return task.text.toLowerCase().includes(searchInput.value.toLowerCase());
      });
    switch (searchDropDown.value) {
      case 'title':
        hasMatchingTitle || article.remove();
        break;
      case 'tasks':
        hasMatchingTask || article.remove();
        break;
      case 'all':
        (hasMatchingTitle || hasMatchingTask) || article.remove();
        break;
    }
  });
}

// Adding New Tasks
function enableNewTask(event) {
  var thisButton = event.target.parentNode.childNodes[3];
  thisButton.disabled = !event.target.value;
}

function addNewTask(event, toDo) {
  var thisCard = event.target.closest('.to-do-list');
  var thisInput = event.target.parentNode.childNodes[1];
  var newTask = new Task(thisInput.value);
  toDo.tasks.push(newTask);
  toDo.saveToStorage();
  thisCard.querySelector('.list-of-tasks').appendChild(generateTaskItem(newTask));
  thisInput.value = '';
}

cardSection.addEventListener('keydown', addTaskHandler);

function addTaskHandler(event) {
  var thisToDo = event.target.closest('.to-do-list') &&
    pullFromStorage(event.target.closest('.to-do-list').id);
  var thisButton = event.target.parentNode.childNodes[3];
  (event.which === 13 && thisButton.disabled === false) &&
    addNewTask(event, thisToDo);
  enableNewTask(event);
}
