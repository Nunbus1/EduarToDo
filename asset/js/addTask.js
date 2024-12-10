// URL du backend pour effectuer les requêtes AJAX
const apiUrl = "http://localhost/EduarToDo/php/request.php";

/**
 * Formate une date au format DD/MM/YYYY en YYYY-MM-DD (format SQL).
 * @param {string} date - La date au format DD/MM/YYYY.
 * @return {string} - La date au format YYYY-MM-DD.
 */
function convertDateToSQLFormat(date) {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
}

/**
 * Formate une date JavaScript en YYYY-MM-DD.
 * @param {Date} date - La date JavaScript.
 * @return {string} - La date au format YYYY-MM-DD.
 */
function formatDate(date) {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');
}

/**
 * Initialise les événements après le chargement du DOM.
 * Ajoute un gestionnaire de clic à chaque bouton "Add task".
 */
document.addEventListener("DOMContentLoaded", () => {
    const addTaskButtons = document.querySelectorAll(".add-task");

    // Ajoute un gestionnaire d'événements pour chaque bouton
    addTaskButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const tasksContainer = button.closest(".status").querySelector(".Tasks");
            createTask(tasksContainer); // Crée une nouvelle tâche dans le conteneur
        });
    });
});

/**
 * Crée une nouvelle tâche et l'envoie au backend.
 * @param {HTMLElement} tasksContainer - Le conteneur où ajouter la nouvelle tâche.
 */
function createTask(tasksContainer) {
    // Définir les dates : aujourd'hui et dans une semaine
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    // Récupérer les informations de la tâche
    const name = prompt("Nom de la tâche :");
    const description = "Description par défaut de la tâche"; // À personnaliser si nécessaire
    const deadline = formatDate(nextWeek);
    const start_date = formatDate(today);
    const significance = "Low"; // Priorité par défaut
    const status = tasksContainer.closest(".status").querySelector(".title-status").textContent.trim(); // Récupérer le statut
    const id_team = getTeamFromURL();

    // Vérifier que tous les champs nécessaires sont remplis
    if (!name || !description || !deadline || !start_date || !id_team) {
        alert("Tous les champs doivent être remplis !");
        return;
    }

    // Préparer les données pour l'envoi
    const data = `name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&deadline=${encodeURIComponent(deadline)}&start_date=${encodeURIComponent(start_date)}&significance=${encodeURIComponent(significance)}&status=${encodeURIComponent(status)}&id_team=${encodeURIComponent(id_team)}`;

    // Effectuer la requête AJAX pour créer la tâche
    ajaxRequest("POST", `${apiUrl}/task`, loadTasksForTeam, data);
}
