function loadTasksForTeam() {
    const teamId = getTeamFromURL();
    if (!teamId) {
        console.error("Aucune équipe trouvée dans l'URL.");
        return;
    }
    clearTasks();
    

    // Utilisation de ajaxRequest
    ajaxRequest(
        'GET', // Type de requête
        "../php/request.php/task", // URL de l'API
        (response) => { // Callback pour traiter la réponse
            if (response.success) {
                //console.log("Tâches chargées pour l'équipe :", response.tasks);
                response.tasks.forEach((task) => displayTask(task)); // Affiche chaque tâche
            } else {
                console.error("Erreur :", response.message);
            }
        },
        `resource=task&action=getTasks&id=${teamId}` // Paramètres à envoyer dans l'URL
    );
}

// Supprime toutes les tâches existantes dans l'interface
function clearTasks() {
    tasksContainers.forEach((container) => {
        container.innerHTML = "";
    });
}

// Fonction pour afficher une tâche dans l'interface
function displayTask(task) {
    const taskContainer = document.querySelector(".Tasks"); // Assurez-vous que la classe `.Tasks` existe
    const newTaskElement = document.createElement("div");
    newTaskElement.className = "task";
    newTaskElement.setAttribute("draggable", "true");
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
                0/0
            </div>
        </div>
    `;
    taskContainer.appendChild(newTaskElement);
}

// Met à jour l'URL pour inclure l'ID de la team
function updateTeamInURL(teamId) {
    const currentUrl = window.location.href.split('?')[0]; // Supprime les éventuels paramètres actuels
    const newUrl = `${currentUrl}?teamId=${encodeURIComponent(teamId)}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

// Appelle cette fonction lors du chargement de la page ou quand la team change
document.addEventListener("DOMContentLoaded", () => {
    const activeTeamId = 1; // Remplace par une méthode pour récupérer dynamiquement l'ID de la team
    updateTeamInURL(activeTeamId);
});

function getTeamFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('teamId'); // Renvoie l'ID de l'équipe
}

// Charge les tâches dès que la page est prête
document.addEventListener("DOMContentLoaded", loadTasksForTeam);
