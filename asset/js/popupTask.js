// Récupère les éléments nécessaires
const popup = document.querySelector(".popup");
const overlay = document.querySelector(".popup-overlay");

// Fonction principale pour ouvrir la popup
function openPopup(taskId) {
    // Requête GET pour récupérer les détails de la tâche
    const data = `resource=task&action=getTaskInfo&id=${taskId}`;
    ajaxRequest("GET", "../php/request.php/task", (response) => {
        if (response && response.success) {
            const task = response.task;

            // Mise à jour des éléments de la popup
            updatePopupContent(task);
            // Affiche la popup
            popup.style.display = "block";
            overlay.style.display = "block";
        } else {
            console.error("Erreur lors de la récupération des données :", response?.message || "Aucune réponse.");
            alert("Impossible de récupérer les données de la tâche.");
        }
    }, data);
}

function updatePopupContent(task) {
  console.log("Données de la tâche reçues :", task[0].name);
  
  // Mettre à jour le nom de la tâche
  // Mettre à jour le nom de la tâche
  const taskNameElement = popup.querySelector(".taskName");
  if (taskNameElement) {
      taskNameElement.textContent = task[0].name || "Nom non défini";

      // Supprime les anciennes classes de priorité si elles existent
      taskNameElement.classList.forEach((cls) => {
          if (cls.startsWith("priority-")) {
              taskNameElement.classList.remove(cls);
          }
      });

      // Ajoute la nouvelle classe de priorité
      const priorityClass = `priority-${task[0].significance}`;
      taskNameElement.classList.add(priorityClass);
  }


  // Mettre à jour la description
  const taskDescriptionElement = popup.querySelector(".taskDescription p");
  if (taskDescriptionElement) taskDescriptionElement.textContent = task[0].description || "Aucune description.";

  // Mettre à jour les dates
  const creationInput = popup.querySelector("#creationInput");
  const deadlineInput = popup.querySelector("#deadlineInput");

  if (creationInput) creationInput.value = task[0].start_date || ""; // Format attendu : YYYY-MM-DD
  if (deadlineInput) deadlineInput.value = task[0].deadline || ""; // Format attendu : YYYY-MM-DD

  // Mettre à jour les options de priorité
  const priorityOptions = popup.querySelectorAll('input[name="priority"]');
  if (priorityOptions) {
      priorityOptions.forEach((option) => {
          option.checked = option.value === task[0].significance;
      });
  }

  // Mettre à jour les options de statut
  const statusOptions = popup.querySelectorAll('.options input[type="checkbox"]');
  if (statusOptions) {
      statusOptions.forEach((checkbox) => {
          // Réinitialise tous les checkboxes
          checkbox.checked = false;

          // Coche uniquement le statut correspondant à la tâche
          if (checkbox.parentElement.textContent.trim() === task[0].status) {
              checkbox.checked = true;
          }
      });
  }

  // Mettre à jour la checklist
  const checklistContainer = popup.querySelector(".taskChecklist ul");
  checklistContainer.innerHTML = ""; // Réinitialise la checklist

  // Vérifie si des subtasks existent
  if (task[0].subtasks && Array.isArray(task[0].subtasks)) {
      task.subtasks.forEach((subtask) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
              <input type="checkbox" class="check-item" ${subtask.status === "completed" ? "checked" : ""} />
              <span class="check-text">${subtask.status === "completed" ? `<s>${subtask.name}</s>` : subtask.name}</span>
          `;
          checklistContainer.appendChild(listItem);
      });
  } else {
      const emptyMessage = document.createElement("li");
      emptyMessage.textContent = "Aucune sous-tâche disponible.";
      checklistContainer.appendChild(emptyMessage);
  }
}


// Fonction pour fermer la popup
function closePopup() {
    popup.style.display = "none";
    overlay.style.display = "none";
}

function attachTaskClickEvents() {
  document.querySelectorAll(".task").forEach((task) => {
      task.addEventListener("click", () => {
          const taskId = task.getAttribute("data-id");
          if (taskId) {
              updateURLWithTaskId(taskId);
              openPopup(taskId);
          } else {
              console.error("Aucun ID de tâche trouvé.");
          }
      });
  });
}

/**
 * Met à jour l'URL avec l'ID de la tâche
 * @param {string} taskId - L'ID de la tâche à ajouter à l'URL
 */
function updateURLWithTaskId(taskId) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("id", taskId); // Met à jour ou ajoute le paramètre "id"
  
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  history.pushState({ path: newUrl }, "", newUrl); // Met à jour l'URL sans recharger la page

  console.log("URL mise à jour :", newUrl); // Debug pour vérifier l'URL
}

// Ajouter un événement pour fermer la popup en cliquant sur l'overlay
overlay.addEventListener("click", closePopup);
