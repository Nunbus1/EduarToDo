// Fonction pour charger toutes les tâches depuis la base de données
function loadAllTasks() {
    ajaxRequest('GET', '../php/request.php/task', (response) => {
        if (response && response.success) {
            console.log(response);
            
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
            console.error('Erreur lors du chargement des tâches : ', response.message);
        }},
        `resource=task&action=getAllTasks`
    );
}

// Fonction pour ajouter un jour à une date
function addOneDay(date) {
    if (!date) return null;
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
}

function lessOneDay(date) {
    if (!date) return null;
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

// Fonction pour initialiser ou mettre à jour le calendrier
function initializeCalendar(tasks) {
    if ($('#calendar').length > 0 && $('#calendar').fullCalendar) {
        $('#calendar').fullCalendar('destroy');
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
                    loadAllTasks();
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

// Charger toutes les tâches une fois le DOM prêt
$(document).ready(function () {
    loadAllTasks();
});
