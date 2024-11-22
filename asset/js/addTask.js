const apiUrl = "http://localhost/EduarToDo/php/classes/task.php"; // URL du backend
/**
 * Convertit une date au format DD/MM/YYYY en YYYY-MM-DD
 * @param {string} date - La date au format DD/MM/YYYY
 * @return {string} - La date au format YYYY-MM-DD
 */
// Fonction pour ouvrir une popup de création
function openTaskCreationPopup() {
    const taskName = prompt("Entrez le nom de la tâche :");
    const deadline = "10/12/2024";
    const startDate = "01/12/2024";
    const significance = "Low";
    const status = "";
    const teamName = getTeamFromURL();

    if (!teamName) {
        alert("Impossible de créer une tâche : aucune équipe trouvée dans l'URL.");
        return;
    }

    if (taskName && deadline && startDate) {
        // Prépare les données pour le backend
        const newTask = {
            name: taskName,
            description: "taskDescription",
            deadline: deadline,
            start_date: startDate,
            significance: significance,
            status: status,
            id_team: 1 // Utilisation du nom de l'équipe depuis l'URL
        };
        addTaskToDB(newTask);
    } else {
        alert("Tous les champs doivent être remplis !");
    }
}
function convertDateToSQLFormat(date) {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`; // Retourne la date au format SQL
}

// Fonction pour ajouter une tâche dans la BDD via AJAX
function addTaskToDB(taskData) {
    console.log("Données envoyées :", taskData);
    taskData.deadline = convertDateToSQLFormat(taskData.deadline);
    taskData.start_date = convertDateToSQLFormat(taskData.start_date);
    console.log("Données envoyées au serveur :", {
        action: "addTask",
        task: taskData,
    });

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "addTask",
            task: taskData,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erreur réseau ou problème serveur.");
            }
            return response.text(); // Récupère la réponse brute
        })
        .then((text) => {
            console.log("Réponse brute :", text);
            const data = JSON.parse(text); // Parse le JSON ici
            if (data.success) {
                console.log("Tâche ajoutée avec succès :", data.message);
                displayTask(data.task); // Afficher la tâche nouvellement ajoutée
            } else {
                console.error("Erreur lors de l'ajout de la tâche :", data.message);
            }
        })
        .catch((error) => {
            console.error("Erreur :", error.message);
        });
    
}


// Fonction pour charger les tâches d'une équipe
function loadTasksForTeam() {
    const teamId = getTeamFromURL();
    if (!teamId) {
        console.error("Aucune équipe trouvée dans l'URL.");
        return;
    }
    //console.log(`${apiUrl}?action=getTasks&team=${encodeURIComponent(teamName)}`);
    
    fetch(`${apiUrl}?action=getTasks&team=${encodeURIComponent(teamId)}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erreur réseau ou problème serveur.");
            }
            return response.json(); // Parse la réponse JSON
        })
        .then((data) => {
            if (data.success) {
                console.log("Tâches chargées pour l'équipe :", data.tasks);
                data.tasks.forEach((task) => displayTask(task)); // Affiche chaque tâche
            } else {
                console.error("Erreur :", data.message);
            }
        })
        .catch((error) =>
            console.error("Erreur lors du chargement des tâches :", error)
        );
}

// Fonction pour afficher une tâche dans l'interface
function displayTask(task) {
    const taskContainer = document.querySelector(".Tasks");
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
            <img src="../asset/svg/Vector.svg" alt="Options Icon" class="options-icon-status" />
        </div>
        <div class="lowerInfo">
            <div class="deadline-display">${task.deadline}</div>
            <div class="checkList">
                <img src="../asset/svg/Union.svg" alt="Options Icon" class="options-icon-status" />
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
const addTaskButton = document.querySelector(".add-task");
if (addTaskButton) {
    addTaskButton.addEventListener("click", openTaskCreationPopup);
}

// Charge les tâches dès que la page est prête
document.addEventListener("DOMContentLoaded", loadTasksForTeam);
