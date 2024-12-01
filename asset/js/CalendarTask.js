function displayTasks(tasks) {
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