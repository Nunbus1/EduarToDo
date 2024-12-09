// Récupère les éléments nécessaires
const popup = document.querySelector(".popup");
const overlay = document.getElementById("openTask");

// Fonction principale pour ouvrir la popup
function openPopup(taskId) {
    // Requête GET pour récupérer les détails de la tâche
    const data = `resource=task&action=getTaskInfo&id=${taskId}`;
    ajaxRequest("GET", "../php/request.php/task", (response) => {
        if (response && response.success) {
            const task = response.task;
            const subtasks = response.subtasks;

            // Mise à jour des éléments de la popup
            updatePopupContent(task, subtasks);
            // Affiche la popup
            popup.style.display = "block";
            overlay.style.display = "block";
        } else {
            console.error("Erreur lors de la récupération des données :", response?.message || "Aucune réponse.");
            alert("Impossible de récupérer les données de la tâche.");
        }
    }, data);
}

function updatePopupContent(task, subtasks) {
  // Mettre à jour le nom de la tâche
  const taskNameElement = popup.querySelector(".taskName");
  if (taskNameElement) {
      taskNameElement.textContent = task[0].task_name || "Nom non défini";

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

  // Mettre à jour le nom de la team
  const teamName = popup.querySelector(".teamDescription strong");
  if (teamName) teamName.textContent = task[0].team_name || "Aucun nom";

  // Mettre à jour la description de la team
  const teamDescription = popup.querySelector(".teamDescription p");
  if (teamDescription) teamDescription.textContent = task[0].team_description || "Aucune description";

  // Mettre à jour la description
  const taskDescriptionElement = popup.querySelector(".taskDescription p");
  if (taskDescriptionElement) taskDescriptionElement.textContent = task[0].task_description || "Aucune description.";

  // Mettre à jour les dates
  const creationInput = popup.querySelector("#creationInput");
  const deadlineInput = popup.querySelector("#deadlineInput");

  // empeche la date de debut de la tache d'etre passee
  const today = new Date();
  creationInput.min = formatDate(today);

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
  updateSubtasks(subtasks);

   // Activer le bouton "Add subtask"
   const addSubtaskButton = document.getElementById('add-subtask');
   if (addSubtaskButton)
       addSubtaskButton.onclick = () => addSubtask(task[0].id);

   // Activer le bouton "Delete"
   const deleteButton = popup.querySelector(".delete-btn");
   if (deleteButton) {
       deleteButton.onclick = () => deleteTask(task[0].id);
   }
}

function updateSubtasks(subtasks){
  // Mettre à jour la checklist
  const checklistContainer = popup.querySelector(".taskChecklist ul");
  checklistContainer.innerHTML = ""; // Réinitialise la checklist

  // Vérifie si des subtasks existent
  if (subtasks[0]) {
      subtasks.forEach((subtask) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
              <input type="checkbox" class="check-item" id="subtask-${subtask.id}" ${subtask.status === 1 ? "checked" : ""}/>
              <span class="check-text">${subtask.status === 1 ? `<s>${subtask.name}</s>` : subtask.name}</span>
          `;
          checklistContainer.appendChild(listItem);
          const checkbox = listItem.querySelector(".check-item");
          checkbox.addEventListener("click", event => {
            const params = {
                id: event.target.id,
                status: event.target.checked
            }
            ajaxRequest("PUT",
            `../php/request.php/subtask/${event.target.id}`,(response) => {
                if (response && response.success) {
                    console.log("Tâche mise à jour :", response.message);
                    openPopup(taskId);
                } else {
                    console.error("Erreur lors de la mise à jour :", response?.message || "Aucune réponse.");
                }
            }, JSON.stringify(params));
          });
      });
  } else {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "Aucune sous-tâche disponible.";
      checklistContainer.appendChild(emptyMessage);
  }
}

function addSubtask(idTask){
    const inputField = document.getElementById('user-input');
    inputField.style.display = 'inline'; // Afficher le champ de saisie

    inputField.focus(); // Placer le focus sur le champ de saisie
    inputField.addEventListener('blur', function() {
        const userInput = inputField.value;
        if (userInput) {
            const data = `name=${encodeURIComponent(userInput)}&status=${encodeURIComponent(0)}&id_task=${encodeURIComponent(idTask)}`;
            ajaxRequest(
                "POST",
                `../php/request.php/subtask`,
                () => console.log("insertion réussie"), 
                data
            )
        }
        inputField.style.display = 'none'; // Cacher le champ après la saisie
    });
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
      //console.log(`Tâche ${taskId} supprimée avec succès.`);
      
      // Supprimer la tâche de l'interface
      const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);
      if (taskElement) {
        taskElement.remove();
      }
      
      // Fermer la popup
      closePopup();
    
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
const addSubtaskButton = document.getElementById('add-subtask');
var subtaskStatus = document.querySelectorAll(".check-item");
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

    // Activer ou désactiver l'ajout de sous tâches
    addSubtaskButton.disabled = !addSubtaskButton.disabled;

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