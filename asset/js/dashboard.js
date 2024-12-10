/**
 * Affiche les tâches triées par date de deadline.
 * @param {Array} tasks - Liste des tâches à afficher.
 */
function displayTasks(tasks) {
    const sortedTasks = tasks.sort((a, b) => new Date(a.end) - new Date(b.end));
    const tasksContainer = document.getElementById("tasks-list");
    tasksContainer.innerHTML = ''; // Réinitialise le contenu du conteneur

    sortedTasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
}

/**
 * Crée un élément HTML représentant une tâche.
 * @param {Object} task - Objet contenant les données de la tâche.
 * @returns {HTMLElement} Élément HTML de la tâche.
 */
function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.setAttribute("data-id", task.id);
    taskElement.className = "task task-row";

    const teamCircle = createTeamCircle(task.teamName);
    const taskName = createTaskName(task.title);
    const statusContainer = createStatusContainer(task.status);
    const priority = createPriorityElement(task.significance);
    const deadline = createDeadlineElement(task.end);

    taskElement.appendChild(teamCircle);
    taskElement.appendChild(taskName);
    taskElement.appendChild(statusContainer);
    taskElement.appendChild(priority);
    taskElement.appendChild(deadline);

    return taskElement;
}

/**
 * Crée un élément représentant le cercle de l'équipe.
 * @param {string} teamName - Nom de l'équipe.
 * @returns {HTMLElement} Élément HTML du cercle.
 */
function createTeamCircle(teamName) {
    const teamCircle = document.createElement("div");
    teamCircle.className = "team-circle";
    teamCircle.textContent = teamName;
    return teamCircle;
}

/**
 * Crée un élément pour le nom de la tâche.
 * @param {string} title - Titre de la tâche.
 * @returns {HTMLElement} Élément HTML du nom de la tâche.
 */
function createTaskName(title) {
    const taskName = document.createElement("div");
    taskName.className = "task-name";
    taskName.textContent = title;
    return taskName;
}

/**
 * Crée un conteneur pour le statut d'une tâche.
 * @param {string} status - Statut de la tâche.
 * @returns {HTMLElement} Conteneur HTML du statut.
 */
function createStatusContainer(status) {
    const statusContainer = document.createElement("div");
    statusContainer.className = "status-container";

    const statusCircle = document.createElement("div");
    statusCircle.className = "status-circle";
    statusCircle.style.backgroundColor = getStatusColor(status);

    const statusText = document.createElement("span");
    statusText.textContent = status;

    statusContainer.appendChild(statusCircle);
    statusContainer.appendChild(statusText);
    return statusContainer;
}

/**
 * Crée un élément pour la priorité d'une tâche.
 * @param {string} significance - Niveau de priorité.
 * @returns {HTMLElement} Élément HTML de la priorité.
 */
function createPriorityElement(significance) {
    const priority = document.createElement("div");
    priority.className = "priority";
    priority.style.backgroundColor = getPriorityColor(significance);
    priority.textContent = significance;
    return priority;
}

/**
 * Crée un élément pour la date limite d'une tâche.
 * @param {string} deadline - Date limite de la tâche.
 * @returns {HTMLElement} Élément HTML de la deadline.
 */
function createDeadlineElement(deadline) {
    const deadlineElement = document.createElement("div");
    deadlineElement.className = "deadline";
    deadlineElement.textContent = deadline;
    return deadlineElement;
}

/**
 * Retourne la couleur associée à un statut.
 * @param {string} status - Statut de la tâche.
 * @returns {string} Couleur hexadécimale ou par défaut.
 */
function getStatusColor(status) {
    switch (status) {
        case "On Review": return "#a349a4";
        case "In Progress": return "#00bfff";
        case "In Queue": return "#ffa500";
        case "Done": return "#32cd32";
        default: return "#ccc";
    }
}

/**
 * Retourne la couleur associée à une priorité.
 * @param {string} significance - Niveau de priorité.
 * @returns {string} Couleur hexadécimale ou par défaut.
 */
function getPriorityColor(significance) {
    switch (significance) {
        case "High": return "#ff4d4d";
        case "Mid": return "#ffa500";
        case "Low": return "#32cd32";
        default: return "#ccc";
    }
}

/**
 * Ferme la popup en rechargeant les tâches après fermeture.
 */
function closePopup() {
    if (isEditing) {
        alert("Vous devez valider vos modifications avant de quitter la popup.");
        return;
    }
    popup.style.display = "none";
    overlay.style.display = "none";
    loadAllTasks();
}
