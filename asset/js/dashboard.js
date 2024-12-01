function displayTasks(tasks) {
    // Trier les tâches par date de deadline
    const sortedTasks = tasks.sort((a, b) => new Date(a.end) - new Date(b.end));

    // Sélectionner l'élément contenant les tâches
    const tasksContainer = document.getElementById("tasks-list");
    tasksContainer.innerHTML = '';

    // Générer le HTML pour chaque tâche triée
    sortedTasks.forEach((task) => {
        //console.log(task);
        
        // Création de l'élément principal pour une tâche
        const taskElement = document.createElement("div");
        taskElement.setAttribute("data-id", task.id);
        taskElement.className = "task";
        taskElement.classList.add("task-row");

        // Création de l'élément cercle avec le nom de la team
        const teamCircle = document.createElement("div");
        teamCircle.className = "team-circle";
        teamCircle.textContent = task.teamName;

        // Création de l'élément pour le nom de la tâche
        const taskName = document.createElement("div");
        taskName.className = "task-name";
        taskName.textContent = task.title;

        // Création de l'élément pour le statut avec un cercle coloré
        const statusContainer = document.createElement("div");
        statusContainer.className = "status-container";
        const statusCircle = document.createElement("div");
        statusCircle.className = "status-circle";
        statusCircle.style.backgroundColor = getStatusColor(task.status);
        const statusText = document.createElement("span");
        statusText.textContent = task.status;
        statusContainer.appendChild(statusCircle);
        statusContainer.appendChild(statusText);

        // Création de l'élément pour la priorité avec couleur
        const priority = document.createElement("div");
        priority.className = "priority";
        priority.style.backgroundColor = getPriorityColor(task.significance); // Ajout d'une valeur par défaut
        priority.textContent = task.significance;

        // Création de l'élément pour la deadline
        const deadline = document.createElement("div");
        deadline.className = "deadline";
        deadline.textContent = task.end;

        // Ajouter tous les éléments à l'élément principal
        taskElement.appendChild(teamCircle);
        taskElement.appendChild(taskName);
        taskElement.appendChild(statusContainer);
        taskElement.appendChild(priority);
        taskElement.appendChild(deadline);

        // Ajouter l'élément de la tâche au conteneur
        tasksContainer.appendChild(taskElement);
    });
}

// Fonction pour obtenir la couleur du statut
function getStatusColor(status) {
    switch (status) {
        case "On Review": return "#a349a4"; // Violet
        case "In Progress": return "#00bfff"; // Bleu
        case "In Queue": return "#ffa500"; // Orange
        case "Done": return "#32cd32"; // Vert
        default: return "#ccc"; // Gris par défaut
    }
}

// Fonction pour obtenir la couleur de la priorité
function getPriorityColor(significance) {
    switch (significance) {
        case "High": return "#ff4d4d"; // Rouge
        case "Mid": return "#ffa500"; // Orange
        case "Low": return "#32cd32"; // Vert
        default: return "#ccc"; // Gris par défaut
    }
}

// Fonction pour fermer la popup
function closePopup() {
    console.log("yo");
    
    if (isEditing) {
        alert("Vous devez valider vos modifications avant de quitter la popup.");
        return; // Empêche la fermeture
    }
    popup.style.display = "none";
    overlay.style.display = "none";
    loadAllTasks(); // Recharge les tâches après fermeture
}