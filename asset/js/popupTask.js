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
      priorityOptions.forEach((radio) => {
          radio.checked = (radio.value === task[0].significance);
      });
  }

  // Mettre à jour les options de statut
  const statusOptions = popup.querySelectorAll('.options input[name="status"]');
  if (statusOptions) {
      statusOptions.forEach((radio) => {
          // Coche uniquement le bouton radio correspondant au statut de la tâche
          radio.checked = (radio.value === task[0].status);
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

   // Activer le bouton "Delete"
   const deleteButton = popup.querySelector(".delete-btn");
   if (deleteButton) {
       deleteButton.onclick = () => deleteTask(task[0].id);
   }
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

function deleteTask(taskId) {
  // Requête DELETE pour supprimer la tâche
  
  ajaxRequest("DELETE", `../php/request.php/task/${taskId}`, (response) => {
    if (response && response.success) {
      //console.log(`Tâche ${taskId} supprimée avec succès.`);
      
      // Supprimer la tâche de l'interface
      const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);
      if (taskElement) {
        taskElement.remove();
      }
      
      // Fermer la popup
      closePopup();
    } else {
      console.error("Erreur lors de la suppression :", response?.message || "Aucune réponse.");
      alert("Impossible de supprimer la tâche.");
    }
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
  
  //console.log("URL mise à jour :", newUrl); // Debug pour vérifier l'URL
}
// Désactiver toutes les cases de priorité
document.querySelectorAll('input[name="priority"]').forEach((input) => {
  input.disabled = true;
});

// Désactiver toutes les cases de statut
document.querySelectorAll('.options input[type="radio"]').forEach((input) => {
  input.disabled = true;
});


// Fonction pour activer les champs de date
function enableDateInputs() {
  document.getElementById("creationInput").disabled = false;
  document.getElementById("deadlineInput").disabled = false;
}



// Ajouter un événement pour fermer la popup en cliquant sur l'overlay
overlay.addEventListener("click", closePopup);


//------------------------- edit -------------------------------//

const editButton = document.querySelector(".edit-btn");
const taskNameElement = document.querySelector(".taskName");
const taskDescriptionElement = document.querySelector(".taskDescription p");
const priorityInputs = document.querySelectorAll('input[name="priority"]');
const statusRadios = document.querySelectorAll('.options input[name="status"]');
const creationInput = document.querySelector("#creationInput");
const deadlineInput = document.querySelector("#deadlineInput");
let isEditing = false;
/**
 * Active ou désactive les champs d'édition.
 * @param {boolean} enable - Si true, active les champs pour l'édition.
 */
// Modifier toggleEditing pour mettre à jour isEditing
function toggleEditing(enable) {
    isEditing = enable; // Met à jour l'état d'édition
    if (enable) {
        // Activer l'édition pour le nom
        const currentName = document.querySelector(".taskName");
        if (currentName) {
            const editableName = document.createElement("textarea");
            editableName.className = "editable-name";
            editableName.textContent = currentName.textContent; // Récupère le contenu actuel
            currentName.replaceWith(editableName);
        }

        // Activer l'édition pour la description
        const currentDescription = document.querySelector(".taskDescription p");
        if (currentDescription) {
            const editableDescription = document.createElement("textarea");
            editableDescription.className = "editable-description";
            editableDescription.textContent = currentDescription.textContent; // Récupère le contenu actuel
            currentDescription.replaceWith(editableDescription);
        }
    } else {
        // Désactiver l'édition pour le nom
        const editableName = document.querySelector(".editable-name");
        if (editableName) {
            const currentName = document.createElement("div");
            currentName.className = "taskName";
            currentName.textContent = editableName.value; // Récupère la nouvelle valeur
            editableName.replaceWith(currentName);
        }

        // Désactiver l'édition pour la description
        const editableDescription = document.querySelector(".editable-description");
        if (editableDescription) {
            const currentDescription = document.createElement("p");
            currentDescription.textContent = editableDescription.value; // Récupère la nouvelle valeur
            editableDescription.replaceWith(currentDescription);
        }
    }

    // Activer ou désactiver les priorités
    priorityInputs.forEach((input) => {
        input.disabled = !enable;
    });

    // Activer ou désactiver les statuts (radio buttons)
    statusRadios.forEach((radio) => {
        radio.disabled = !enable;
    });

    // Activer ou désactiver les champs de date
    creationInput.disabled = !enable;
    deadlineInput.disabled = !enable;
}

// Gestionnaire pour le bouton Edit
editButton.addEventListener("click", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get("id"); // Récupération de l'ID depuis l'URL
    if (!taskId) {
        console.error("Impossible de récupérer l'ID de la tâche.");
        return;
    }

    if (editButton.textContent === "Edit") {
        // Activer le mode édition
        toggleEditing(true);
        editButton.textContent = "Validate";
    } else {
        // Récupérer les modifications et valider
        const updatedTask = {
            id: taskId,
            name: document.querySelector(".editable-name")?.value, // Récupère la valeur du textarea
            description: document.querySelector(".editable-description")?.value, // Récupère la valeur du textarea
            significance: document.querySelector('input[name="priority"]:checked')?.value,
            status: document.querySelector('input[name="status"]:checked')?.value,
            start_date: creationInput.value,
            deadline: deadlineInput.value,
        };

        // Validation des champs
        if (!updatedTask.name || !updatedTask.description || !updatedTask.significance || !updatedTask.status) {
            alert("Tous les champs doivent être remplis.");
            return;
        }

        console.log("Modifications validées :", updatedTask);

        // Envoi des modifications au backend via AJAX
        ajaxRequest(
            "PUT",
            `../php/request.php/task/${taskId}`,
            (response) => {
                if (response && response.success) {
                    console.log("Tâche mise à jour :", response.message);

                    // Désactiver les champs d'édition
                    toggleEditing(false);
                    editButton.textContent = "Edit";
                    openPopup(taskId);
                } else {
                    console.error("Erreur lors de la mise à jour :", response?.message || "Aucune réponse.");
                }
            },
            JSON.stringify(updatedTask)
        );
    }
});