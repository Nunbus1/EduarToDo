// Indicateur pour éviter les requêtes multiples
let isLoadingTasks = false;

// Sélection des conteneurs de tâches
const tasksContainers = document.querySelectorAll(".Tasks");

/**
 * Charge toutes les tâches pour une équipe spécifique depuis la base de données.
 * Utilise l'ID de l'équipe présent dans l'URL.
 */
function loadTasksForTeam() {
    if (isLoadingTasks) return;
    isLoadingTasks = true;

    const teamId = getTeamFromURL();
    if (!teamId) {
        console.error("Aucune équipe trouvée dans l'URL.");
        isLoadingTasks = false;
        return;
    }

    clearTasks();

    // Envoie une requête AJAX pour charger les tâches de l'équipe
    ajaxRequest(
        'GET', 
        "../php/request.php/task", 
        (response) => {
            if (response === undefined) {
                console.error("Aucune tâche trouvée.");
            } else {
                response.tasks.forEach((task) => displayTask(task));
                initializeDragAndDrop();
                attachTaskClickEvents();
                displayTeamName(response.team);
            }
            isLoadingTasks = false;
        },
        `resource=task&action=getTasks&id=${teamId}`
    );
}

/**
 * Supprime toutes les tâches actuellement affichées dans l'interface.
 */
function clearTasks() {
    tasksContainers.forEach((container) => {
        container.innerHTML = "";
    });
}

/**
 * Met à jour le nom de l'équipe affiché sur la page.
 * @param {string} team - Nom de l'équipe.
 */
function displayTeamName(team) {
    const teamName = document.querySelector(".team-name");
    teamName.textContent = team;
}

/**
 * Affiche une tâche dans l'interface utilisateur.
 * Ajoute la tâche dans le conteneur correspondant à son statut.
 * @param {Object} task - Objet représentant une tâche.
 */
function displayTask(task) {
    const statusContainers = document.querySelectorAll(".status");
    let taskContainer = null;

    statusContainers.forEach((statusContainer) => {
        const titleStatus = statusContainer.querySelector(".title-status").textContent.trim();
        if (titleStatus === task.status) {
            taskContainer = statusContainer.querySelector(".Tasks");
        }
    });

    if (!taskContainer) {
        console.error(`Aucun conteneur trouvé pour le statut : ${task.status}`);
        return;
    }

    // Crée un nouvel élément pour la tâche
    const newTaskElement = document.createElement("div");
    newTaskElement.className = "task";
    newTaskElement.setAttribute("draggable", "true");
    newTaskElement.setAttribute("data-id", task.id);

    newTaskElement.innerHTML = `
        <div class="upperInfo">
            ${task.name}
            <div class="members">
                <div class="member-circle"></div>
                <div class="member-circle"></div>
                <div class="member-circle"></div>
            </div>
            <div class="priority priority-${task.significance}">${task.significance}</div>
        </div>
        <div class="lowerInfo">
            <div class="deadline-display">${task.deadline}</div>
            <div class="checkList">
                <img src="../asset/svg/Union.svg" alt="Options Icon" />
                ${task.nb_subtask_finish}/${task.nb_subtask}
            </div>
        </div>
    `;

    // Ajoute la tâche au conteneur correspondant
    taskContainer.appendChild(newTaskElement);

    // Réinitialise les événements de drag-and-drop
    initializeDragAndDrop();
}

/**
 * Met à jour l'URL pour inclure l'ID de l'équipe sélectionnée.
 * @param {string} teamId - ID de l'équipe.
 */
function updateTeamInURL(teamId) {
    const currentUrl = window.location.href.split('?')[0];
    const newUrl = `${currentUrl}?teamId=${encodeURIComponent(teamId)}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

/**
 * Récupère l'ID de l'équipe depuis l'URL.
 * @returns {string|null} - L'ID de l'équipe ou null si absent.
 */
function getTeamFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('teamId');
}

/**
 * Ferme la popup après validation ou annulation.
 * Recharge les tâches associées à l'équipe.
 */
function closePopup() {
    if (isEditing) {
        alert("Vous devez valider vos modifications avant de quitter la popup.");
        return;
    }
    popup.style.display = "none";
    overlay.style.display = "none";
    loadTasksForTeam();
}

// Supprime les anciens événements de chargement des tâches
document.removeEventListener("DOMContentLoaded", loadTasksForTeam);

// Charge les tâches associées à l'équipe après le chargement complet du DOM
document.addEventListener("DOMContentLoaded", loadTasksForTeam);
