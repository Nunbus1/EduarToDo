/**
 * Charge toutes les tâches depuis la base de données et met à jour l'interface utilisateur.
 */
function loadAllTasks() {
    ajaxRequest('GET', '../php/request.php/task', (response) => {
        if (response && response.success) {

            // Transforme les tâches pour les rendre compatibles avec le calendrier et l'affichage
            const tasks = response.tasks.map(task => ({
                id: task.id,
                title: task.name,
                start: task.start_date,
                end: addOneDay(task.deadline),
                color: getTaskColor(task.significance),
                significance: task.significance,
                deadline: task.deadline,
                teamName: task.teamName,
                status: task.status,
            }));

            initializeCalendar(tasks);
            displayTasks(tasks);
            attachTaskClickEvents();
        } else {
            console.error('Erreur lors du chargement des tâches : ', response?.message || 'Aucune réponse.');
        }
    }, `resource=task&action=getAllTasks`);
}

/**
 * Ajoute un jour à une date donnée.
 * @param {string} date - La date à laquelle ajouter un jour.
 * @returns {string|null} - La nouvelle date au format ISO ou null si aucune date n'est fournie.
 */
function addOneDay(date) {
    if (!date) return null;
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
}

/**
 * Soustrait un jour à une date donnée.
 * @param {string} date - La date à laquelle soustraire un jour.
 * @returns {string|null} - La nouvelle date au format ISO ou null si aucune date n'est fournie.
 */
function lessOneDay(date) {
    if (!date) return null;
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

/**
 * Initialise ou met à jour le calendrier avec les tâches fournies.
 * @param {Array} tasks - Les tâches à afficher dans le calendrier.
 */
function initializeCalendar(tasks) {
    if ($('#calendar').length > 0 && $('#calendar').fullCalendar) {
        $('#calendar').fullCalendar('destroy'); // Réinitialise le calendrier s'il existe
    }

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay',
        },
        defaultDate: new Date(),
        editable: true,
        eventLimit: true,
        events: tasks,
        eventClick: function (event) {
            alert(`Tâche : ${event.title}\nDébut : ${event.start.format('YYYY-MM-DD')}\nFin : ${lessOneDay(event.end.format('YYYY-MM-DD'))}`);
        },
        eventDrop: function (event, delta, revertFunc) {
            updateTaskDates(event, revertFunc);
        },
        eventResize: function (event, delta, revertFunc) {
            updateTaskDates(event, revertFunc);
        },
    });
}

/**
 * Retourne une couleur en fonction de la priorité d'une tâche.
 * @param {string} priority - La priorité de la tâche (High, Mid, Low).
 * @returns {string} - La couleur associée à la priorité.
 */
function getTaskColor(priority) {
    switch (priority) {
        case 'High':
            return '#ff4d4d'; // Rouge
        case 'Mid':
            return '#ffa500'; // Orange
        case 'Low':
            return '#4caf50'; // Vert
        default:
            return 'blue'; // Couleur par défaut
    }
}

/**
 * Met à jour les dates de début et de fin d'une tâche dans la base de données.
 * @param {Object} event - L'événement contenant les nouvelles dates.
 * @param {Function} revertFunc - La fonction pour annuler la mise à jour en cas d'erreur.
 */
function updateTaskDates(event, revertFunc) {
    ajaxRequest('GET', `../php/request.php/task`, (response) => {
        if (response && response.success) {
            const task = response.task;

            const updatedTask = {
                id: task[0].id,
                name: task[0].task_name,
                description: task[0].task_description,
                significance: task[0].significance,
                status: task[0].status,
                start_date: event.start.format('YYYY-MM-DD'),
                deadline: lessOneDay(event.end.format('YYYY-MM-DD')),
            };

            ajaxRequest('PUT', `../php/request.php/task/${updatedTask.id}`, (updateResponse) => {
                if (updateResponse && updateResponse.success) {
                    loadAllTasks(); // Recharge toutes les tâches après une mise à jour réussie
                } else {
                    console.error('Erreur lors de la mise à jour de la tâche : ', updateResponse?.message || 'Aucune réponse.');
                    alert('Erreur lors de la mise à jour des dates. Annulation...');
                    revertFunc(); 
                }
            }, JSON.stringify(updatedTask));
        } else {
            console.error('Erreur lors de la récupération des détails de la tâche : ', response?.message || 'Aucune réponse.');
            alert('Impossible de récupérer les détails de la tâche. Annulation...');
            revertFunc(); 
        }
    }, `resource=task&action=getTaskInfo&id=${event.id}`);
}

// Charge toutes les tâches une fois le DOM prêt
$(document).ready(function () {
    loadAllTasks();
});
