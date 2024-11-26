// Fonction pour charger toutes les tâches depuis la base de données
function loadAllTasks() {
    ajaxRequest('GET', '../php/request.php/task', (response) => {
        if (response && response.success) {
            const tasks = response.tasks.map(task => ({
                id: task.id,
                title: task.task_name,
                start: task.start_date,
                end: addOneDay(task.deadline),
                color: getTaskColor(task.significance),
            }));

            initializeCalendar(tasks);
            displayUpcomingTasks(tasks);
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
            alert(`Tâche : ${event.title}\nDébut : ${event.start.format('YYYY-MM-DD')}\nFin : ${event.end ? event.end.format('YYYY-MM-DD') : 'Non définie'}`);
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
            
            task[0].start_date = event.start.format('YYYY-MM-DD');
            task[0].deadline = lessOneDay(event.end.format('YYYY-MM-DD'));
            
            ajaxRequest('PUT', `../php/request.php/task/${task[0].id}`, (updateResponse) => {
                if (updateResponse && updateResponse.success) {
                    loadAllTasks();
                } else {
                    console.error('Erreur lors de la mise à jour de la tâche : ', updateResponse?.message || 'Aucune réponse.');
                    alert('Erreur lors de la mise à jour des dates. Annulation...');
                    revertFunc(); 
                }
            }, JSON.stringify(task[0]));
        } else {
            console.error('Erreur lors de la récupération des détails de la tâche : ', response?.message || 'Aucune réponse.');
            alert('Impossible de récupérer les détails de la tâche. Annulation...');
            revertFunc(); 
        }
    }, `resource=task&action=getTaskInfo&id=${event.id}`);
}

function displayUpcomingTasks(tasks) {
    // Trier les tâches par date de deadline
    const sortedTasks = tasks.sort((a, b) => new Date(a.end) - new Date(b.end));

    // Sélectionner l'élément contenant les tâches
    const upcomingTasksContainer = document.getElementById("upcoming-task-container");
    upcomingTasksContainer.innerHTML = ''; // Réinitialiser le contenu

    // Générer le HTML pour chaque tâche triée
    sortedTasks.forEach((task) => {
        
        const taskElement = document.createElement("div");
        taskElement.setAttribute("data-id", task.id);
        taskElement.className = "task";
        taskElement.classList.add("upcoming-task");
        taskElement.style.borderLeft = `1vw solid ${task.color}`; // Couleur selon la priorité
        taskElement.style.backgroundColor =hexToRGBA(task.color, 0.6);
        taskElement.innerHTML = `
            <div class="task-header">
                <div class="task-circle"></div>
                <span>${task.end}</span>
            </div>
            <div class="task-body">
                <p class="task-name">${task.title}</p>
            </div>
        `;
        upcomingTasksContainer.appendChild(taskElement);
    });
}

function hexToRGBA(hex, opacity = 0.2) {
    // Supprime le `#` s'il est présent
    hex = hex.replace('#', '');
    
    // Convertit le hex en RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Fonction pour fermer la popup
function closePopup() {
    if (isEditing) {
        alert("Vous devez valider vos modifications avant de quitter la popup.");
        return; // Empêche la fermeture
    }
    popup.style.display = "none";
    overlay.style.display = "none";
    loadAllTasks(); // Recharge les tâches après fermeture
}

// Charger toutes les tâches une fois le DOM prêt
$(document).ready(function () {
    loadAllTasks();
});
