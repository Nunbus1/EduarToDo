// Récupère l'élément de la popup
const popup = document.querySelector(".popup");
// Récupère l'overlay de la popup
const overlay = document.querySelector(".popup-overlay");
// Récupère le bouton de date pour le sélecteur
const datePicker = document.getElementById("datePicker");

// Fonction principale pour ouvrir la popup de tâche
function openPopup(taskElement) {
  const taskId = taskElement.getAttribute("id");
  const taskName = taskElement.getAttribute("data-task-name");
  const priorityText = taskElement.getAttribute("data-priority");
  const taskDescription = taskElement.getAttribute("data-description") || "Description de la tâche";
  let checklistData = JSON.parse(taskElement.getAttribute("data-checklist") || "[]");

  // Mise à jour du nom de la tâche et de la couleur de fond dans la popup
  const popupTaskName = document.querySelector(".popup .taskName");
  if (popupTaskName) {
    popupTaskName.textContent = taskName;
    updateBackgroundColor(popupTaskName, priorityText);
  }

  // Mise à jour de la description dans la popup
  const popupTaskDescription = document.querySelector(".popup .taskDescription p");
  if (popupTaskDescription) {
    popupTaskDescription.textContent = taskDescription;
  }

  // Met à jour uniquement le texte de .task-name-display dans upperInfo de la tâche
  const taskNameDisplay = taskElement.querySelector(".task-name-display");
  if (taskNameDisplay) {
    taskNameDisplay.textContent = taskName;
  }

  // Réinitialise les boutons radio et sélectionne la priorité actuelle
  const priorityOptions = document.querySelectorAll('.popup input[name="priority"]');
  priorityOptions.forEach((option) => {
    option.checked = option.value === priorityText;
  });

  // Supprime les anciens événements pour éviter les doublons
  priorityOptions.forEach((option) => {
    const clonedOption = option.cloneNode(true);
    option.replaceWith(clonedOption);
  });

  // Ajoute les nouveaux événements de changement pour la tâche sélectionnée
  document.querySelectorAll('.popup input[name="priority"]').forEach((option) => {
    option.addEventListener("change", () => {
      if (option.checked) {
        const newPriority = option.value;
        updateBackgroundColor(popupTaskName, newPriority);

        const taskPriorityElement = document.querySelector(`#${taskId} .priority`);
        if (taskPriorityElement) {
          taskPriorityElement.textContent = newPriority;
          updateBackgroundColor(taskPriorityElement, newPriority);
        }

        taskElement.setAttribute("data-priority", newPriority);
      }
    });
  });

  // Définition de la date actuelle par défaut dans le champ "date de création"
  const creationDateInput = document.querySelector(".date-button.creation");
  const deadlineInput = document.querySelector("#deadlineInput");
  const taskDeadlineDisplay = taskElement.querySelector(".deadline-display");

  if (creationDateInput) {
    const today = new Date();
    const todayFormatted = today.toISOString().split("T")[0];

    creationDateInput.value = todayFormatted;
    creationDateInput.min = todayFormatted;

    if (deadlineInput && deadlineInput.value) {
      creationDateInput.max = deadlineInput.value;
    }
  }

  if (deadlineInput && taskDeadlineDisplay) {
    deadlineInput.value = formatDateForInput(taskDeadlineDisplay.textContent);
    deadlineInput.min = creationDateInput.value;
    deadlineInput.replaceWith(deadlineInput.cloneNode(true));

    const newDeadlineInput = document.querySelector("#deadlineInput");
    newDeadlineInput.addEventListener("change", function () {
      creationDateInput.max = newDeadlineInput.value;
      if (new Date(newDeadlineInput.value) < new Date(creationDateInput.value)) {
        alert("La deadline ne peut pas être antérieure à la date de création.");
        newDeadlineInput.value = creationDateInput.value;
      } else {
        taskElement.setAttribute("data-deadline", newDeadlineInput.value);
        const [year, month, day] = newDeadlineInput.value.split("-");
        const newFormattedDate = `${day}/${month}/${year}`;
        taskDeadlineDisplay.textContent = newFormattedDate;
      }
    });
  }

  // Remplit la checklist dans la popup en fonction de `checklistData`
  const checklistContainer = document.querySelector(".popup .taskChecklist ul");
  checklistContainer.innerHTML = "";

  // Sélectionne les éléments dans la tâche pour afficher le nombre total et complété
  const taskNbrCheckListDisplay = taskElement.querySelector(".nbr-checklist-total");
  const taskNbrCheckListCompleted = taskElement.querySelector(".nbr-checklist-completed");

  // Définit le nombre initial d'éléments dans la checklist
  if (taskNbrCheckListDisplay) {
    taskNbrCheckListDisplay.textContent = checklistData.length;
  }

  // Calcule le nombre initial de tâches complétées
  const completedCount = checklistData.filter((item) => item.completed).length;
  if (taskNbrCheckListCompleted) {
    taskNbrCheckListCompleted.textContent = completedCount;
  }

  checklistData.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <input type="checkbox" class="check-item" data-index="${index}" ${item.completed ? "checked" : ""} />
      <span class="check-text">${item.completed ? "<s>" + item.text + "</s>" : item.text}</span>
      <button class="delete-item">x</button>
    `;
    checklistContainer.appendChild(listItem);
  });

  checklistContainer.querySelectorAll(".check-item").forEach((itemCheckbox) => {
    itemCheckbox.addEventListener("change", function () {
      const index = this.getAttribute("data-index");
      checklistData[index].completed = this.checked;

      const textElement = this.nextElementSibling;
      textElement.innerHTML = this.checked ? `<s>${checklistData[index].text}</s>` : checklistData[index].text;

      taskElement.setAttribute("data-checklist", JSON.stringify(checklistData));

      const completedCount = checklistData.filter((item) => item.completed).length;
      if (taskNbrCheckListCompleted) {
        taskNbrCheckListCompleted.textContent = completedCount;
      }
    });
  });

  checklistContainer.querySelectorAll(".delete-item").forEach((deleteButton, index) => {
    deleteButton.addEventListener("click", () => {
      checklistData.splice(index, 1);
      taskElement.setAttribute("data-checklist", JSON.stringify(checklistData));

      if (taskNbrCheckListDisplay) {
        taskNbrCheckListDisplay.textContent = checklistData.length;
      }

      const updatedCompletedCount = checklistData.filter((item) => item.completed).length;
      if (taskNbrCheckListCompleted) {
        taskNbrCheckListCompleted.textContent = updatedCompletedCount;
      }

      deleteButton.parentElement.remove();
    });
  });

  const addButton = document.querySelector(".add-task-item");
  if (!addButton) {
    const addTaskButton = document.createElement("button");
    addTaskButton.className = "add-task-item";
    addTaskButton.textContent = "Ajouter une tâche";
    document.querySelector(".popup .taskChecklist").appendChild(addTaskButton);

    addTaskButton.addEventListener("click", () => {
      const newTaskText = prompt("Entrez le nom de la nouvelle tâche:");
      if (newTaskText) {
        checklistData.push({ text: newTaskText, completed: false });
        taskElement.setAttribute("data-checklist", JSON.stringify(checklistData));

        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <input type="checkbox" class="check-item" data-index="${checklistData.length - 1}" />
          <span class="check-text">${newTaskText}</span>
          <button class="delete-item">x</button>
        `;
        checklistContainer.appendChild(listItem);

        if (taskNbrCheckListDisplay) {
          taskNbrCheckListDisplay.textContent = checklistContainer.children.length;
        }

        listItem.querySelector(".check-item").addEventListener("change", function () {
          const index = this.getAttribute("data-index");
          checklistData[index].completed = this.checked;

          const textElement = this.nextElementSibling;
          textElement.innerHTML = this.checked ? `<s>${checklistData[index].text}</s>` : checklistData[index].text;

          taskElement.setAttribute("data-checklist", JSON.stringify(checklistData));
        });

        listItem.querySelector(".delete-item").addEventListener("click", () => {
          const index = listItem.querySelector(".check-item").getAttribute("data-index");
          checklistData.splice(index, 1);
          taskElement.setAttribute("data-checklist", JSON.stringify(checklistData));

          if (taskNbrCheckListDisplay) {
            taskNbrCheckListDisplay.textContent = checklistContainer.children.length;
          }

          listItem.remove();
        });
      }
    });
  }

  const editButton = document.querySelector(".edit-btn");
  editButton.onclick = function () {
    enableEditing(popupTaskName, popupTaskDescription, taskElement);
  };

  const deleteButton = document.querySelector(".delete-btn");
  deleteButton.onclick = function () {
    deleteTask(taskId);
  };

  if (popup && overlay) {
    popup.style.display = "block";
    overlay.style.display = "block";
  }
}

// Fonction pour appliquer les couleurs de fond et de texte en fonction de la priorité
function updateBackgroundColor(element, priority) {
  if (priority === "High") {
    element.style.backgroundColor = "#ff4d4d";
    element.style.color = "#fff";
  } else if (priority === "Mid") {
    element.style.backgroundColor = "#ffa500";
    element.style.color = "#fff";
  } else if (priority === "Low") {
    element.style.backgroundColor = "#4caf50";
    element.style.color = "#fff";
  } else {
    element.style.backgroundColor = "";
    element.style.color = "";
  }
}

// Fonction utilitaire pour formater la date au format YYYY-MM-DD pour les champs input de type date
function formatDateForInput(dateString) {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

// Fonction pour ouvrir le sélecteur de date lors du clic sur une date
function selectDate(buttonElement) {
  datePicker.style.display = "block";
  const rect = buttonElement.getBoundingClientRect();
  datePicker.style.position = "absolute";
  datePicker.style.left = `${rect.left}px`;
  datePicker.style.top = `${rect.top + window.scrollY}px`;
  datePicker.currentButton = buttonElement;
  datePicker.focus();
}

// Fonction pour mettre à jour la date dans le bouton de date
function updateDate(datePicker) {
  const selectedDate = datePicker.value;

  if (selectedDate && datePicker.currentButton) {
    const [year, month, day] = selectedDate.split("-");
    datePicker.currentButton.textContent = `${day}/${month}/${year}`;
  }

  datePicker.style.display = "none";
}

// Fonction pour permettre l'édition
function enableEditing(popupTaskName, popupTaskDescription, taskElement) {
  const taskNameInput = document.createElement("input");
  taskNameInput.type = "text";
  taskNameInput.value = popupTaskName.textContent;
  popupTaskName.replaceWith(taskNameInput);

  const taskDescriptionTextarea = document.createElement("textarea");
  taskDescriptionTextarea.value = popupTaskDescription.textContent;
  popupTaskDescription.replaceWith(taskDescriptionTextarea);

  taskNameInput.addEventListener("blur", () => {
    const newTaskName = taskNameInput.value;
    popupTaskName.textContent = newTaskName;
    taskNameInput.replaceWith(popupTaskName);

    const taskUpperInfo = taskElement.querySelector(".upperInfo");
    if (taskUpperInfo) {
      taskUpperInfo.innerHTML = `
        <span class="task-name-display">${newTaskName}</span>
        <div class="members">
            <div class="member-circle"></div>
            <div class="member-circle"></div>
            <div class="member-circle"></div>
        </div>
        <div class="priority priority-${taskElement.getAttribute("data-priority")}">
            ${taskElement.getAttribute("data-priority")}
        </div>
        <img src="../asset/svg/Vector.svg" alt="Options Icon" class="options-icon-status" />
      `;
    }

    taskElement.setAttribute("data-task-name", newTaskName);
  });

  taskDescriptionTextarea.addEventListener("blur", () => {
    const newDescription = taskDescriptionTextarea.value;
    popupTaskDescription.textContent = newDescription;
    taskDescriptionTextarea.replaceWith(popupTaskDescription);

    taskElement.setAttribute("data-description", newDescription);
  });
}

// Fonction pour supprimer la tâche
function deleteTask(taskId) {
  const taskElement = document.getElementById(taskId);
  if (taskElement) {
    taskElement.remove();
  }

  closePopup();
}

// Fonction pour fermer la popup et masquer l'overlay
function closePopup() {
  if (popup && overlay) {
    popup.style.display = "none";
    overlay.style.display = "none";
  }
}

// Ajoute l'événement de clic pour ouvrir la popup sur chaque tâche
document.querySelectorAll(".task").forEach((task) => {
  task.addEventListener("click", () => openPopup(task));
});
