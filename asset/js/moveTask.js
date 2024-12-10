let draggedTask = null; // Référence à la tâche en cours de déplacement

/**
 * Initialise les événements pour les tâches et leurs conteneurs.
 * Configure le drag-and-drop.
 */
function initializeDragAndDrop() {
    const tasks = document.querySelectorAll(".task");

    // Ajoute les événements de drag aux tâches
    tasks.forEach((task) => {
        task.setAttribute("draggable", "true");
        task.addEventListener("dragstart", dragStart);
        task.addEventListener("dragend", dragEnd);
    });

    const tasksContainers = document.querySelectorAll(".Tasks");
    
    // Ajoute les événements aux conteneurs pour gérer le drop
    tasksContainers.forEach((container) => {
        container.addEventListener("dragover", dragOver);
        container.addEventListener("dragenter", dragEnter);
        container.addEventListener("dragleave", dragLeave);
        container.addEventListener("drop", dragDrop);
    });
}

/**
 * Déclenché au début du drag. Change l'opacité de la tâche pour indiquer le déplacement.
 * @param {Event} event - Événement dragstart.
 */
function dragStart(event) {
    draggedTask = event.target;
    setTimeout(() => {
        draggedTask.style.opacity = "0.5"
    }, 0);
}

/**
 * Déclenché à la fin du drag. Réinitialise l'opacité de la tâche.
 */
function dragEnd() {
    if (draggedTask) {
        draggedTask.style.opacity = "1";
    }
    draggedTask = null;
}

/**
 * Autorise le drop dans un conteneur.
 * @param {Event} event - Événement dragover.
 */
function dragOver(event) {
    event.preventDefault();
}

/**
 * Ajoute un style visuel lorsque la tâche entre dans un conteneur.
 * @param {Event} event - Événement dragenter.
 */
function dragEnter(event) {
    event.preventDefault();
    if (event.target.classList.contains("Tasks")) {
        event.target.classList.add("hovered");
    }
}

/**
 * Supprime le style visuel lorsque la tâche quitte un conteneur.
 * @param {Event} event - Événement dragleave.
 */
function dragLeave(event) {
    if (event.target.classList.contains("Tasks")) {
        event.target.classList.remove("hovered");
    }
}

/**
 * Gère le drop de la tâche dans un nouveau conteneur et met à jour son statut.
 * @param {Event} event - Événement drop.
 */
function dragDrop(event) {
    event.preventDefault();

    if (event.target.classList.contains("Tasks") && draggedTask) {
        event.target.classList.remove("hovered");
        event.target.appendChild(draggedTask);

        const newStatus = event.target.closest(".status").querySelector(".title-status").textContent.trim();
        const taskId = draggedTask.getAttribute("data-id");

        if (!taskId || !newStatus) {
            console.error("Impossible de récupérer l'ID de la tâche ou le nouveau statut.");
            return;
        }

        const data = `resource=task&action=getTaskInfo&id=${taskId}`;
        
        // Requête pour récupérer les détails actuels de la tâche
        ajaxRequest(
            "GET",
            `../php/request.php/task`,
            (response) => {
                if (response && response.success) {
                    const task = response.task;

                    // Met à jour uniquement le statut de la tâche
                    const updatedTask = {
                        id: task[0].id,
                        name: task[0].task_name,
                        description: task[0].task_description,
                        significance: task[0].significance,
                        status: newStatus,
                        start_date: task[0].start_date,
                        deadline: task[0].deadline,
                    };

                    // Requête pour mettre à jour la tâche
                    ajaxRequest(
                        "PUT",
                        `../php/request.php/task/${taskId}`,
                        (response) => {
                            if (response && response.success) {
 
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
