const apiUrl = "http://localhost/EduarToDo/php/request.php"; // URL du backend
/**
 * Convertit une date au format DD/MM/YYYY en YYYY-MM-DD
 * @param {string} date - La date au format DD/MM/YYYY
 * @return {string} - La date au format YYYY-MM-DD
 */

document.addEventListener("DOMContentLoaded", () => {
    const addTaskButton = document.querySelector(".add-task"); // Sélectionne ton bouton
    if (addTaskButton) {
        addTaskButton.addEventListener("click", createTask); // Associe l'événement click
    }
});

/**
 * Fonction pour créer une tâche
 */
function createTask() {
    const name = prompt("Nom de la tâche :");
    const description = "Description par défaut de la tâche"; // Vous pouvez demander une saisie utilisateur ici
    const deadline = "2024-12-31"; // Exemple, vous pouvez demander une date utilisateur
    const start_date = "2024-11-01"; // Exemple, à adapter
    const significance = "Low"; // Exemple, vous pouvez demander une saisie utilisateur
    const status = ""; // Exemple, peut être vide par défaut
    const id_team = 1; // À remplacer par un ID d'équipe dynamique si nécessaire

    // Vérifiez les champs nécessaires
    if (!name || !description || !deadline || !start_date || !id_team) {
        alert("Tous les champs doivent être remplis !");
        return;
    }

    // Préparez les données à envoyer
    const data = `name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&deadline=${encodeURIComponent(deadline)}&start_date=${encodeURIComponent(start_date)}&significance=${encodeURIComponent(significance)}&status=${encodeURIComponent(status)}&id_team=${encodeURIComponent(id_team)}`;
    console.log(data);
    
    // Effectuez la requête AJAX
    ajaxRequest("POST", "../php/request.php/task", loadTasksForTeam, data);
}

function convertDateToSQLFormat(date) {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`; // Retourne la date au format SQL
}



document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.querySelector(".add-task");
    if (addButton) {
        //addButton.addEventListener("click", openTaskCreationPopup);
    }
});