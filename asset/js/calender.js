// Fonction pour charger toutes les tâches depuis la base de données
function loadAllTasks() {
    ajaxRequest('GET', '../php/request.php/task', (response) =>{
        if (response && response.success) {
            // Mappez les tâches reçues au format requis par FullCalendar
            const tasks = response.tasks.map(task => ({
                title: task.name,
                start: task.start_date,
                end: task.deadline,
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
    });
}

// Fonction pour déterminer une couleur selon le statut d'une tâche (optionnel)
function getTaskColor(status) {
    switch (status) {
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


// Charger toutes les tâches une fois le DOM prêt
$(document).ready(function () {
    loadAllTasks();
});