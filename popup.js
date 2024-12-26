// Селекторы
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const addTaskButton = document.getElementById("add-task");

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  startNotificationLoop();
});

// Добавление новой задачи
addTaskButton.addEventListener("click", () => {
  if (taskInput.value.trim() !== "") {
    addTask(taskInput.value.trim(), false);
    taskInput.value = "";
    saveTasks();
  }
});

function addTask(taskText, isCompleted) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  if (isCompleted) li.classList.add("completed");

  li.innerHTML = `
    <span>${taskText}</span>
    <div>
      <button class="toggle-task">${isCompleted ? "✔" : "✖"}</button>
      <button class="delete-task">&times;</button>
    </div>
  `;

  li.querySelector(".toggle-task").addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  li.querySelector(".delete-task").addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  taskList.appendChild(li);
  sortTasks();
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".task-item").forEach((task) => {
    tasks.push({
      text: task.querySelector("span").textContent,
      completed: task.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => addTask(task.text, task.completed));
}

function sortTasks() {
  const tasks = Array.from(document.querySelectorAll(".task-item"));
  tasks.sort((a, b) => {
    return (
      a.classList.contains("completed") - b.classList.contains("completed")
    );
  });
  tasks.forEach((task) => taskList.appendChild(task));
}

function startNotificationLoop() {
  if (!("Notification" in window)) {
    console.warn("Уведомления не поддерживаются в этом браузере.");
    return;
  }

  if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Уведомления разрешены.");
      }
    });
  }

  setInterval(() => {
    console.log(1);
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const pendingTasks = tasks.filter((task) => !task.completed);

    if (pendingTasks.length > 0 && Notification.permission === "granted") {
      const taskTexts = pendingTasks.map((task) => `- ${task.text}`).join("\n");
      new Notification("Напоминание о задачах", {
        body: `У вас есть ${pendingTasks.length} невыполненных задач:\n${taskTexts}`,
        icon: "icons/icon-128.png",
      });
    }
  }, 2000);
}
