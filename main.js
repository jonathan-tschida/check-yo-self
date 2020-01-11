var addTaskInput = document.getElementById('add-task-input')
var addTaskButton = document.getElementById('add-task-button');
var draftingBox = document.getElementById('drafting-box');

addTaskButton.addEventListener('click', addNewTaskItem);

function addNewTaskItem() {
  var newTaskItem = document.createElement('div');
  newTaskItem.classList.add('drafted-task-item');
  newTaskItem.innerHTML = `<input type='image' src='./assets/delete.svg' />
  <p>${addTaskInput.value}</p>`;
  draftingBox.appendChild(newTaskItem);
}
