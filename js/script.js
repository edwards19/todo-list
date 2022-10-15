const todoList = document.querySelector(".todolist");
const taskList = todoList.querySelector(".todolist__tasks");
const emptyStateDiv = todoList.querySelector(".todolist__empty-state");

const axiosI = axios.create({
  baseURL: "https://api.learnjavascript.today",
});

const auth = {
  username: "jsdeveloper19",
  password: "87654321",
};

axiosI
  .get("/tasks", { auth })
  .then((response) => {
    const tasks = response.data;
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      taskList.append(taskElement);

      emptyStateDiv.textContent = "Your todo list is empty. Yay! 🎉";
    });
    console.log(tasks);
  })
  .catch((error) => console.error(error));

todoList.addEventListener("submit", (event) => {
  event.preventDefault();

  const newTaskField = todoList.querySelector("input");
  const inputValue = DOMPurify.sanitize(newTaskField.value.trim());

  if (!inputValue) return;

  const newTaskButton = todoList.querySelector("button");
  newTaskButton.setAttribute("disabled", true);

  const buttonTextElement = newTaskButton.querySelector("span");
  buttonTextElement.textContent = "Adding task...";

  axiosI
    .post(
      "/tasks",
      {
        name: inputValue,
      },
      {
        auth,
      }
    )
    .then((response) => {
      console.log(response);
      const task = response.data;
      const taskElement = createTaskElement(task);
      taskList.appendChild(taskElement);

      newTaskField.value = "";
      newTaskField.focus();
    })
    .catch((error) => console.log(error))
    .finally(() => {
      newTaskButton.removeAttribute("disabled");
      buttonTextElement.textContent = "Add task";
    });
});

taskList.addEventListener(
  "input",
  debounce(function (event) {
    const input = event.target;
    const taskElement = input.parentElement;
    const checkbox = taskElement.querySelector('input[type="checkbox"]');
    const taskInput = taskElement.querySelector(".task__name");

    const id = checkbox.id;
    const done = checkbox.checked;
    const name = DOMPurify.sanitize(taskInput.value.trim());

    axiosI
      .put(
        `/tasks/${id}`,
        {
          name,
          done,
        },
        {
          auth,
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, 250)
);

todoList.addEventListener("click", (event) => {
  if (!event.target.matches(".task__delete-button")) return;

  const taskElement = event.target.parentElement;
  const checkbox = taskElement.querySelector('input[type="checkbox"]');
  const id = checkbox.id;

  axiosI
    .delete(`/tasks/${id}`, { auth })
    .then((response) => {
      taskElement.remove();

      if (taskList.children.length === 0) {
        taskList.innerHTML = "";
      }
    })
    .catch((error) => console.error(error));
});

const generateUniqueString = (length) =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length);

const createTaskElement = ({ id, name, done }) => {
  const taskElement = document.createElement("li");
  taskElement.classList.add("task");
  taskElement.innerHTML = DOMPurify.sanitize(`
  <input type="checkbox" id="${id}" ${done ? "checked" : ""}/>
  <label for="${id}">
    <svg viewBox="0 0 20 15">
      <path d="M0 8l2-2 5 5L18 0l2 2L7 15z" fill-rule="nonzero" />
    </svg>
  </label>
  <input class="task__name" value="${name}">
  <button type="button" class="task__delete-button">
    <svg viewBox="0 0 20 20">
      <path
        d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"
      />
    </svg>
  </button>`);
  return taskElement;
};

function debounce(callback, wait, immediate) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) callback.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) callback.apply(context, args);
  };
}
