const apiUrl = "http://localhost/EduarToDo/php/request.php"; // URL du backend
/**
 * Convertit une date au format DD/MM/YYYY en YYYY-MM-DD
 * @param {string} date - La date au format DD/MM/YYYY
 * @return {string} - La date au format YYYY-MM-DD
 */

const addTaskButton = document.querySelector(".add-task");

if (addTaskButton) {
    addTaskButton.addEventListener("click", () => {
        // Demandez les informations nécessaires
        const name = prompt("Nom de la tâche :");
        const description = "Description de la tâche"; // Exemple par défaut
        const deadline = "2024-12-31"; // Exemple par défaut
        const start_date = "2024-11-01"; // Exemple par défaut
        const significance = "Low";
        const status = ""; // Par défaut, vide
        const id_team = 1; // ID de l'équipe, à adapter

        // Vérifiez que les champs essentiels sont renseignés
        if (!name || !description || !deadline || !start_date || !id_team) {
            alert("Tous les champs doivent être remplis !");
            return;
        }

        // Préparez les données
        const data = `action=addTask&name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&deadline=${encodeURIComponent(deadline)}&start_date=${encodeURIComponent(start_date)}&significance=${encodeURIComponent(significance)}&status=${encodeURIComponent(status)}&id_team=${encodeURIComponent(id_team)}`;

        // Requête AJAX
        ajaxRequest("POST", apiUrl, (response) => {
            if (response && response.success) {
                alert("Tâche ajoutée avec succès !");
                console.log("Nouvelle tâche ajoutée :", response.message);

                // Rechargez la liste des tâches
                loadTasksForTeam();
            } else {
                console.error("Erreur lors de l'ajout de la tâche :", response ? response.message : "Aucune réponse reçue.");
                alert("Erreur lors de l'ajout de la tâche.");
            }
        }, data);
    });
}

function convertDateToSQLFormat(date) {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`; // Retourne la date au format SQL
}

/**
 * Ajoute une tâche dans la BDD via le backend
 * @param {Object} taskData - Les données de la tâche
 */
function addTaskToDB(taskData) {
    console.log("Données envoyées :", taskData);

    ajaxRequest(
        "POST",
        apiUrl,
        (response) => {
            console.log("Réponse reçue :", response);

            if (response && response.success) {
                console.log("Tâche ajoutée avec succès :", response.message);
                displayTask(response.task); // Affiche la tâche ajoutée avec son ID
            } else {
                console.error(
                    "Erreur lors de l'ajout de la tâche :",
                    response ? response.message : "Aucune réponse reçue"
                );
            }
        },
        `action=addTask&task=${encodeURIComponent(JSON.stringify(taskData))}`
    );
}


function loadTasksForTeam() {
    const teamId = getTeamFromURL();
    if (!teamId) {
        console.error("Aucune équipe trouvée dans l'URL.");
        return;
    }

    // Utilisation de ajaxRequest
    ajaxRequest(
        'GET', // Type de requête
        apiUrl, // URL de l'API
        (response) => { // Callback pour traiter la réponse
            if (response.success) {
                console.log("Tâches chargées pour l'équipe :", response.tasks);
                response.tasks.forEach((task) => displayTask(task)); // Affiche chaque tâche
            } else {
                console.error("Erreur :", response.message);
            }
        },
        `resource=task&action=getTasks&id=${teamId}` // Paramètres à envoyer dans l'URL
    );
}

// Appeler cette fonction au chargement de la page
document.addEventListener("DOMContentLoaded", loadTasksForTeam);

// Fonction pour afficher une tâche dans l'interface
function displayTask(task) {
    const taskContainer = document.querySelector(".Tasks"); // Assurez-vous que la classe `.Tasks` existe
    const newTaskElement = document.createElement("div");
    newTaskElement.className = "task";
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


// Ajout d'un événement pour le bouton "Add task"
// const addButton = document.querySelector(".add-task");
// if (addButton) {
//     addButton.addEventListener("click", openTaskCreationPopup);
// }

// Charge les tâches dès que la page est prête
document.addEventListener("DOMContentLoaded", loadTasksForTeam);

document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.querySelector(".add-task");
    if (addButton) {
        addButton.addEventListener("click", openTaskCreationPopup);
    }
});