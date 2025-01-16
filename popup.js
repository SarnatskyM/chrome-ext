document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskButton = document.getElementById("add-task");
  const taskList = document.getElementById("task-list");

  const saveTasks = () => {
    const tasks = [];
    taskList.querySelectorAll("li").forEach((taskItem) => {
      tasks.push(taskItem.querySelector("span").textContent);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    savedTasks.forEach(addTaskToList);
  };

  const addTaskToList = (taskText) => {
    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
        <span>${taskText}</span>
        <button class="task-remove">×</button>
      `;
    taskList.appendChild(taskItem);

    taskItem.querySelector(".task-remove").addEventListener("click", () => {
      taskItem.remove();
      saveTasks();
    });
  };

  const addTask = () => {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    addTaskToList(taskText);
    taskInput.value = "";
    saveTasks();
  };

  addTaskButton.addEventListener("click", addTask);

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  loadTasks();
});
