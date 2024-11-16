function addTask(event) {
    const button = event.target;
    const statusContainer = button.closest(".status");
    const tasksContainer = statusContainer.querySelector(".Tasks");

    const taskName = "Task name";
    const priority = "High";
    const deadline = "12/12/2024";
    const nbrCheckListValide = "2";

    const taskId = `task-${Date.now()}`;
    const newTask = document.createElement("div");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.setAttribute("id", taskId);
    newTask.setAttribute("data-task-name", taskName);
    newTask.setAttribute("data-priority", priority);
    newTask.setAttribute("data-deadline", deadline);

    // Initialisation de la checklist pour chaque tâche
    const initialChecklist = [];
    newTask.setAttribute("data-checklist", JSON.stringify([]));

    newTask.innerHTML = `
        <div class="upperInfo">
            ${taskName}
            <div class="members">
                <div class="member-circle"></div>
                <div class="member-circle"></div>
                <div class="member-circle"></div>
            </div>
            <div class="priority priority-${priority}">${priority}</div>
            <img src="../asset/svg/Vector.svg" alt="Options Icon" class="options-icon-status" />
        </div>
        <div class="lowerInfo">
             <div class="deadline-display">${deadline}</div>
            <div class="checkList">
                <img src="../asset/svg/Union.svg" alt="Options Icon" class="options-icon-status" />
                <span class="nbr-checklist-completed">0</span>/<span class="nbr-checklist-total">${initialChecklist.length}</span>
            </div>
        </div>
    `;

    newTask.addEventListener("dragstart", dragStart);
    newTask.addEventListener("dragend", dragEnd);

    newTask.addEventListener("click", () => openPopup(newTask));

    tasksContainer.appendChild(newTask);

    updateStatusHeight(tasksContainer);
}

const addTaskButtons = document.querySelectorAll(".add-task");
addTaskButtons.forEach((button) => button.addEventListener("click", addTask));
