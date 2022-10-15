const todoList = document.querySelector(".todolist");
const taskList = todoList.querySelector(".todolist__tasks");
const deleteTasks = [...todoList.querySelectorAll(".task__delete-button")];
const emptyStateDiv = todoList.querySelector('.todolist__empty-state');

todoList.addEventListener("submit", (event) => {
  event.preventDefault();

  const newTaskField = todoList.querySelector("input");
  const inputValue = newTaskField.value.trim();
  console.log(inputValue);

  newTaskField.value = "";
  newTaskField.focus();
  if (!inputValue) return;

  const id = generateUniqueString(10);
  const taskElement = createTaskElement({
    id, 
    name: inputValue,
    done: false
  });

  taskList.appendChild(taskElement);
});

todoList.addEventListener("click", (event) => {
  if (!event.target.matches(".task__delete-button")) return;
  const taskElement = event.target.parentElement;
  taskElement.remove();

  if (taskList.children.length === 0) {
    taskList.innerHTML = "";
  }
});

const generateUniqueString = (length) =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length);

const createTaskElement = ({id, name, done}) => {
  const taskElement = document.createElement("li");
  taskElement.classList.add("task");
  taskElement.innerHTML = DOMPurify.sanitize(`
  <input type="checkbox" id="${id}" />
  <label for="${id}">
    <svg viewBox="0 0 20 15">
      <path d="M0 8l2-2 5 5L18 0l2 2L7 15z" fill-rule="nonzero" />
    </svg>
  </label>
  <span class="task__name">${name}</span>
  <button type="button" class="task__delete-button">
    <svg viewBox="0 0 20 20">
      <path
        d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"
      />
    </svg>
  </button>`);
  return taskElement;
};

const axiosI = axios.create({
  baseURL: "https://api.learnjavascript.today",
});

//Code to create a user
// axiosI.post('/users', {
//   username: 'jsdeveloper19',
//   password: '87654321'
// })
//   .then(response => console.log(response.data))
//   .catch(error => console.log(error));

const auth = {
  username: "jsdeveloper19",
  password: "87654321",
};

axiosI
  .get("/tasks", { auth })
  .then((response) => {
    const tasks = response.data;
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      taskList.append(taskElement);

    emptyStateDiv.textContent = "Your todo list is empty. Yay! 🎉";  
    })
    console.log(tasks)
  })
  .catch((error) => console.error(error));
