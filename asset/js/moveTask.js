let draggedTask = null;

// Initialisation des événements
function initializeDragAndDrop() {
    const tasks = document.querySelectorAll(".task");

    tasks.forEach((task) => {
        task.setAttribute("draggable", "true");
        task.addEventListener("dragstart", dragStart);
        task.addEventListener("dragend", dragEnd);
    });

    const tasksContainers = document.querySelectorAll(".Tasks");
    tasksContainers.forEach((container) => {
        container.addEventListener("dragover", dragOver);
        container.addEventListener("dragenter", dragEnter);
        container.addEventListener("dragleave", dragLeave);
        container.addEventListener("drop", dragDrop);
    });
}

// Gestion des événements de drag pour les tâches
function dragStart(event) {
    draggedTask = event.target;
    setTimeout(() => {
        draggedTask.style.opacity = "0.5"; // Ajoute un effet visuel
    }, 0);
}

function dragEnd() {
    if (draggedTask) {
        draggedTask.style.opacity = "1"; // Réinitialise l’opacité
    }
    draggedTask = null;
}

// Gestion des événements des conteneurs
function dragOver(event) {
    event.preventDefault(); // Autorise le drop
}

function dragEnter(event) {
    event.preventDefault();
    if (event.target.classList.contains("Tasks")) {
        event.target.classList.add("hovered");
    }
}

function dragLeave(event) {
    if (event.target.classList.contains("Tasks")) {
        event.target.classList.remove("hovered");
    }
}

function dragDrop(event) {
    event.preventDefault();

    if (event.target.classList.contains("Tasks") && draggedTask) {
        event.target.classList.remove("hovered");

        // Ajoute la tâche déplacée au nouveau conteneur
        event.target.appendChild(draggedTask);

        // Récupérer le nouveau statut basé sur le conteneur
        const newStatus = event.target.closest(".status").querySelector(".title-status").textContent.trim();

        // Récupérer l'ID de la tâche depuis draggedTask
        const taskId = draggedTask.getAttribute("data-id");

        if (!taskId || !newStatus) {
            console.error("Impossible de récupérer l'ID de la tâche ou le nouveau statut.");
            return;
        }
        const data = `resource=task&action=getTaskInfo&id=${taskId}`;
        // Effectuer une requête GET pour récupérer les détails actuels de la tâche
        ajaxRequest(
            "GET",
            `../php/request.php/task`,
            (response) => {
                if (response && response.success) {
                    const task = response.task;
                    const subtasks = response.subtasks;

                    // Mettre à jour uniquement le statut
                    const updatedTask = {
                        id: task[0].id,
                        name: task[0].task_name,
                        description: task[0].task_description,
                        significance: task[0].significance,
                        status: newStatus,
                        start_date: task[0].start_date,
                        deadline: task[0].deadline,
                    };
                    console.log(updatedTask);
                    
                    // Envoyer la mise à jour via PUT
                    ajaxRequest(
                        "PUT",
                        `../php/request.php/task/${taskId}`,
                        (response) => {
                            if (response && response.success) {
                                console.log(`Statut de la tâche ${taskId} mis à jour avec succès : ${newStatus}`);
                            } else {
                                console.error("Erreur lors de la mise à jour du statut :", response?.message || "Aucune réponse.");
                            }
                        },
                        JSON.stringify(updatedTask)
                    );
                } else {
                    console.error("Erreur lors de la récupération des détails de la tâche :", response?.message || "Aucune réponse.");
                }
            },
            data
        );
    } else {
        console.error("Impossible de drop la tâche.");
    }
}
