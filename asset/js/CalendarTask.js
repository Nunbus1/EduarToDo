/**
 * Affiche les tâches triées par date de deadline.
 * @param {Array} tasks - Liste des tâches à afficher.
 */
function displayTasks(tasks) {
    const sortedTasks = sortTasksByDeadline(tasks);
    const upcomingTasksContainer = document.getElementById("upcoming-task-container");
    upcomingTasksContainer.innerHTML = '';

    sortedTasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        upcomingTasksContainer.appendChild(taskElement);
    });
}

/**
 * Trie les tâches par date de deadline.
 * @param {Array} tasks - Liste des tâches.
 * @returns {Array} Liste triée des tâches.
 */
function sortTasksByDeadline(tasks) {
    return tasks.sort((a, b) => new Date(a.end) - new Date(b.end));
}

/**
 * Crée un élément HTML représentant une tâche.
 * @param {Object} task - Objet contenant les données de la tâche.
 * @returns {HTMLElement} Élément HTML de la tâche.
 */
function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.setAttribute("data-id", task.id);
    taskElement.className = "task upcoming-task";
    taskElement.style.borderLeft = `1vw solid ${task.color}`;
    taskElement.style.backgroundColor = hexToRGBA(task.color, 0.6);

    taskElement.innerHTML = `
        <div class="task-header">
            <div class="task-circle"></div>
            <span>${task.end}</span>
        </div>
        <div class="task-body">
            <p class="task-name">${task.title}</p>
        </div>
    `;

    return taskElement;
}

/**
 * Convertit un code couleur hexadécimal en couleur RGBA.
 * @param {string} hex - Code couleur hexadécimal.
 * @param {number} opacity - Opacité souhaitée (0.0 à 1.0).
 * @returns {string} Code couleur RGBA.
 */
function hexToRGBA(hex, opacity = 0.2) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Ferme la popup et recharge les tâches.
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
