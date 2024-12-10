// Récupère les éléments nécessaires
const popup = document.querySelector(".popup");
const overlay = document.getElementById("openTask");

/**
 * Formate une date en format YYYY-MM-DD.
 * @param {Date} date - Date à formater.
 * @returns {string} - La date formatée.
 */
function formatDate(date) {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');
}

/**
 * Ouvre une popup pour afficher les détails d'une tâche.
 * @param {string} taskId - L'ID de la tâche à afficher.
 */
function openPopup(taskId) {
    const data = `resource=task&action=getTaskInfo&id=${taskId}`;
    ajaxRequest("GET", "../php/request.php/task", (response) => {
        if (response && response.success) {
            const task = response.task;
            const subtasks = response.subtasks;

            updatePopupContent(task, subtasks);
            popup.style.display = "block";
            overlay.style.display = "block";
        } else {
            console.error("Erreur lors de la récupération des données :", response?.message || "Aucune réponse.");
            alert("Impossible de récupérer les données de la tâche.");
        }
    }, data);
}

/**
 * Met à jour le contenu de la popup avec les détails de la tâche et ses sous-tâches.
 * @param {Object} task - Les détails de la tâche.
 * @param {Array} subtasks - Les sous-tâches associées.
 */
function updatePopupContent(task, subtasks) {
    const taskNameElement = popup.querySelector(".taskName");
    if (taskNameElement) {
        taskNameElement.textContent = task[0].task_name || "Nom non défini";
        taskNameElement.className = `taskName priority-${task[0].significance}`;
    }

    const teamName = popup.querySelector(".teamDescription strong");
    if (teamName) teamName.textContent = task[0].team_name || "Aucun nom";

    const teamDescription = popup.querySelector(".teamDescription p");
    if (teamDescription) teamDescription.textContent = task[0].team_description || "Aucune description";

    const taskDescriptionElement = popup.querySelector(".taskDescription p");
    if (taskDescriptionElement) taskDescriptionElement.textContent = task[0].task_description || "Aucune description.";

    const creationInput = popup.querySelector("#creationInput");
    const deadlineInput = popup.querySelector("#deadlineInput");
    const today = new Date();
    creationInput.min = formatDate(today);
    if (creationInput) creationInput.value = task[0].start_date || "";
    if (deadlineInput) deadlineInput.value = task[0].deadline || "";

    const priorityOptions = popup.querySelectorAll('input[name="priority"]');
    priorityOptions.forEach((radio) => {
        radio.checked = (radio.value === task[0].significance);
    });

    const statusOptions = popup.querySelectorAll('.options input[name="status"]');
    statusOptions.forEach((radio) => {
        radio.checked = (radio.value === task[0].status);
    });

    updateSubtasks(subtasks);

    const addSubtaskButton = document.getElementById('add-subtask');
    if (addSubtaskButton) addSubtaskButton.onclick = () => addSubtask(task[0].id);

    const deleteButton = popup.querySelector(".delete-btn");
    if (deleteButton) deleteButton.onclick = () => deleteTask(task[0].id);
}

/**
 * Met à jour la liste des sous-tâches dans la popup.
 * @param {Array} subtasks - Les sous-tâches associées à la tâche.
 */
function updateSubtasks(subtasks) {
    const checklistContainer = popup.querySelector(".taskChecklist ul");
    checklistContainer.innerHTML = "";

    if (subtasks[0]) {
        subtasks.forEach((subtask) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <input type="checkbox" class="check-item" id="subtask-${subtask.id}" ${subtask.status === 1 ? "checked" : ""}/>
                <span class="check-text">${subtask.status === 1 ? `<s>${subtask.name}</s>` : subtask.name}</span>
            `;
            checklistContainer.appendChild(listItem);

            const checkbox = listItem.querySelector(".check-item");
            checkbox.addEventListener("click", (event) => {
                const params = {
                    id: event.target.id,
                    status: event.target.checked,
                };
                ajaxRequest(
                    "PUT",
                    `../php/request.php/subtask/${event.target.id}`,
                    (response) => {
                        if (response && response.success) {
                            openPopup(task[0].id);
                        } else {
                            console.error("Erreur lors de la mise à jour :", response?.message || "Aucune réponse.");
                        }
                    },
                    JSON.stringify(params)
                );
            });
        });
    } else {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Aucune sous-tâche disponible.";
        checklistContainer.appendChild(emptyMessage);
    }
}

/**
 * Ajoute une sous-tâche à la tâche actuelle.
 * @param {string} idTask - L'ID de la tâche associée.
 */
function addSubtask(idTask) {
    const inputField = document.getElementById('user-input');
    inputField.style.display = 'inline';
    inputField.focus();

    inputField.addEventListener('blur', function () {
        const userInput = inputField.value;
        if (userInput) {
            const data = `name=${encodeURIComponent(userInput)}&status=0&id_task=${encodeURIComponent(idTask)}`;
            ajaxRequest("POST", "../php/request.php/subtask", () => console.log("Sous-tâche ajoutée avec succès"), data);
        }
        inputField.style.display = 'none';
    });
}

/**
 * Attache les événements de clic aux tâches pour ouvrir la popup.
 */
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
 * Supprime une tâche.
 * @param {string} taskId - L'ID de la tâche à supprimer.
 */
function deleteTask(taskId) {
    ajaxRequest("DELETE", `../php/request.php/task/${taskId}`, () => {
        const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);
        if (taskElement) taskElement.remove();
        closePopup();
    });
}

/**
 * Met à jour l'URL avec l'ID de la tâche.
 * @param {string} taskId - L'ID de la tâche.
 */
function updateURLWithTaskId(taskId) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("id", taskId);

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    history.pushState({ path: newUrl }, "", newUrl);
}

// Désactive les priorités et statuts par défaut
document.querySelectorAll('input[name="priority"]').forEach((input) => (input.disabled = true));
document.querySelectorAll('.options input[type="radio"]').forEach((input) => (input.disabled = true));

// Permet d'activer les champs de date
function enableDateInputs() {
    creationInput.disabled = false;
    deadlineInput.disabled = false;
}

// Ajoute un événement pour fermer la popup
overlay.addEventListener("click", closePopup);
