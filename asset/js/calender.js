// Fonction pour charger toutes les tâches depuis la base de données
function loadAllTasks() {
    ajaxRequest('GET', '../php/request.php/task', (response) => {
        if (response && response.success) {
            // Mappez les tâches reçues au format requis par FullCalendar
            const tasks = response.tasks.map(task => ({
                id: task.id, // Assurez-vous que l'ID de la tâche est inclus
                title: task.name,
                start: task.start_date,
                end: addOneDay(task.deadline),
                color: getTaskColor(task.significance), // Déterminez une couleur selon le statut (optionnel)
            }));

            // Initialiser ou mettre à jour le calendrier
            initializeCalendar(tasks);
        } else {
            console.error('Erreur lors du chargement des tâches : ', response.message);
        }},
        `resource=task&action=getAllTasks`
    );
}

// Fonction pour ajouter un jour à une date
function addOneDay(date) {
    if (!date) return null; // Si pas de date, retourne null
    const d = new Date(date);
    d.setDate(d.getDate() + 1); // Ajoute un jour
    return d.toISOString().split('T')[0]; // Retourne en format 'YYYY-MM-DD'
}

function lessOneDay(date) {
    if (!date) return null; // Si pas de date, retourne null
    const d = new Date(date);
    d.setDate(d.getDate() - 1); // Ajoute un jour
    return d.toISOString().split('T')[0]; // Retourne en format 'YYYY-MM-DD'
}

// Fonction pour initialiser ou mettre à jour le calendrier
function initializeCalendar(tasks) {
    // Si le calendrier existe déjà, détruisez-le avant de le recréer
    if ($('#calendar').length > 0 && $('#calendar').fullCalendar) {
        $('#calendar').fullCalendar('destroy');
    }

    // Initialisation du calendrier avec les tâches
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay',
        },
        defaultDate: new Date(), // Date par défaut : aujourd'hui
        editable: true,
        eventLimit: true, // Affiche un "plus" si trop d'événements dans un jour
        events: tasks, // Liste des tâches
        eventClick: function (event) {
            // Exemple de gestion du clic sur un événement
            alert(`Tâche : ${event.title}\nDébut : ${event.start.format('YYYY-MM-DD')}\nFin : ${event.end ? event.end.format('YYYY-MM-DD') : 'Non définie'}`);
        },
        eventDrop: function (event, delta, revertFunc) {
            // Gestion du déplacement des tâches
            updateTaskDates(event, revertFunc);
        },
        eventResize: function (event, delta, revertFunc) {
            // Gestion du redimensionnement des tâches
            updateTaskDates(event, revertFunc);
        },
    });
}

// Fonction pour déterminer une couleur selon la priorité d'une tâche (optionnel)
function getTaskColor(priority) {
    switch (priority) {
        case 'High':
            return '#ff4d4d';
        case 'Mid':
            return '#ffa500';
        case 'Low':
            return '#4caf50';
        default:
            return 'blue';
    }
}

// Fonction pour mettre à jour les dates de début et de fin dans la base de données
function updateTaskDates(event, revertFunc) {
    
    // Étape 1 : Récupérer les détails de la tâche via un GET
    ajaxRequest('GET', `../php/request.php/task`, (response) => {
        if (response && response.success) {
            const task = response.task; // Détails complets de la tâche récupérés
            
            // Mise à jour des nouvelles dates
            task[0].start_date = event.start.format('YYYY-MM-DD');
            task[0].deadline = lessOneDay(event.end.format('YYYY-MM-DD'));
            
            // Étape 2 : Envoyer les données mises à jour via un PUT
            ajaxRequest('PUT', `../php/request.php/task/${task[0].id}`, (updateResponse) => {
                if (updateResponse && updateResponse.success) {
                    //console.log(`Tâche mise à jour avec succès : ID ${task[0].id}`);
                } else {
                    console.error('Erreur lors de la mise à jour de la tâche : ', updateResponse?.message || 'Aucune réponse.');
                    alert('Erreur lors de la mise à jour des dates. Annulation...');
                    revertFunc(); // Annuler le déplacement en cas d'erreur
                }
            }, JSON.stringify(task[0]));
        } else {
            console.error('Erreur lors de la récupération des détails de la tâche : ', response?.message || 'Aucune réponse.');
            alert('Impossible de récupérer les détails de la tâche. Annulation...');
            revertFunc(); // Annuler le déplacement en cas d'erreur
        }
    }, `resource=task&action=getTaskInfo&id=${event.id}`);
}

// Charger toutes les tâches une fois le DOM prêt
$(document).ready(function () {
    loadAllTasks();
});
