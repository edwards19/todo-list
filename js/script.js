const todoList = document.querySelector('.todolist');
const taskList = todoList.querySelector('.todolist__tasks');
const deleteTasks = [...todoList.querySelectorAll(".task__delete-button")];

todoList.addEventListener('submit', event => {
  event.preventDefault();

  const newTaskField = todoList.querySelector('input');
  const inputValue = newTaskField.value.trim();
  console.log(inputValue);

  newTaskField.value = "";
  newTaskField.focus();
  if (!inputValue) return;

  const taskElement = createTaskElement(inputValue);

  taskList.appendChild(taskElement);
})

todoList.addEventListener('click', event => {
  if (!event.target.matches('.task__delete-button')) return;
  const taskElement = event.target.parentElement
  taskElement.remove();

  if (taskList.children.length === 0) {
    taskList.innerHTML = '';
  }
})

const generateUniqueString = (length) =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length);

const createTaskElement = (taskname) => {
  const uniqueID = generateUniqueString(10);
  const taskElement = document.createElement("li");
  taskElement.classList.add("task");
  taskElement.innerHTML = DOMPurify.sanitize(`
  <input type="checkbox" id="${uniqueID}" />
  <label for="${uniqueID}">
    <svg viewBox="0 0 20 15">
      <path d="M0 8l2-2 5 5L18 0l2 2L7 15z" fill-rule="nonzero" />
    </svg>
  </label>
  <span class="task__name">${taskname}</span>
  <button type="button" class="task__delete-button">
    <svg viewBox="0 0 20 20">
      <path
        d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"
      />
    </svg>
  </button>`);
  return taskElement;
};    