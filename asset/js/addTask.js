function addTask(event) {
  const button = event.target;
  const statusContainer = button.closest(".status");
  const tasksContainer = statusContainer.querySelector(".Tasks");

  const newTask = document.createElement("div");
  newTask.classList.add("task");
  newTask.setAttribute("draggable", "true");
  newTask.innerHTML = `
      <div class="upperInfo">
          Task name
          <div class="members">
              <div class="member-circle"></div>
              <div class="member-circle"></div>
              <div class="member-circle"></div>
          </div>
          <div class="priority">High</div>
          <img src="../asset/svg/Vector.svg" alt="Options Icon" class="options-icon-status" />
      </div>
      <div class="lowerInfo">
          <div class="deadLine">12/12/2024</div>
          <div class="checkList">
              <img src="../asset/svg/Union.svg" alt="Options Icon" class="options-icon-status" />
              2/2
          </div>
      </div>
  `;


  newTask.addEventListener("dragstart", dragStart);
  newTask.addEventListener("dragend", dragEnd);

//   newTask.addEventListener("dblclick", () => {
//       newTask.remove(); // Supprime la tâche
//       updateStatusHeight(tasksContainer); // Met à jour la hauteur
//   });


  tasksContainer.appendChild(newTask);


  updateStatusHeight(tasksContainer);
}


const addTaskButtons = document.querySelectorAll(".add-task");
addTaskButtons.forEach((button) => button.addEventListener("click", addTask));
