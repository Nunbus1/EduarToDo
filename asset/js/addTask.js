const apiUrl = "http://localhost/EduarToDo/php/request.php"; // URL du backend
/**
 * Convertit une date au format DD/MM/YYYY en YYYY-MM-DD
 * @param {string} date - La date au format DD/MM/YYYY
 * @return {string} - La date au format YYYY-MM-DD
 */

document.addEventListener("DOMContentLoaded", () => {
    // Sélectionne tous les boutons "Add task"
    const addTaskButtons = document.querySelectorAll(".add-task");

    // Ajoute un gestionnaire d'événements à chaque bouton
    addTaskButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const tasksContainer = button.closest(".status").querySelector(".Tasks");
            
            createTask(tasksContainer);
        });
    });
});

/**
 * Fonction pour créer une tâche
 */
function createTask(tasksContainer) {
    const name = prompt("Nom de la tâche :");
    const description = "Description par défaut de la tâche"; // Vous pouvez demander une saisie utilisateur ici
    const deadline = "2024-12-31"; // Exemple, vous pouvez demander une date utilisateur
    const start_date = "2024-11-01"; // Exemple, à adapter
    const significance = "Low"; // Exemple, vous pouvez demander une saisie utilisateur
    const status = tasksContainer.closest(".status").querySelector(".title-status").textContent.trim(); // Récupère le statut
    const id_team = 1; // À remplacer par un ID d'équipe dynamique si nécessaire
    console.log(tasksContainer.closest(".status").querySelector(".title-status").textContent.trim());
    // Vérifiez les champs nécessaires
    if (!name || !description || !deadline || !start_date || !id_team) {
        alert("Tous les champs doivent être remplis !");
        return;
    }

    // Préparez les données à envoyer
    const data = `name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&deadline=${encodeURIComponent(deadline)}&start_date=${encodeURIComponent(start_date)}&significance=${encodeURIComponent(significance)}&status=${encodeURIComponent(status)}&id_team=${encodeURIComponent(id_team)}`;
    //console.log(data);
    
    // Effectuez la requête AJAX
    ajaxRequest("POST", "../php/request.php/task", loadTasksForTeam, data);
}

function convertDateToSQLFormat(date) {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`; // Retourne la date au format SQL
}