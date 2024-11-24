const tasksContainers = document.querySelectorAll(".Tasks");
let draggedTask = null;

// Initialisation des événements de drag-and-drop
function initializeDragAndDrop() {
    const tasks = document.querySelectorAll(".task");
    tasks.forEach((task) => {
        task.setAttribute("draggable", "true");
        task.addEventListener("dragstart", dragStart);
        task.addEventListener("dragend", dragEnd);
    });

    tasksContainers.forEach((container) => {
        container.addEventListener("dragover", dragOver);
        container.addEventListener("dragenter", dragEnter);
        container.addEventListener("dragleave", dragLeave);
        container.addEventListener("drop", dragDrop);
    });
}

// Événements de drag
function dragStart(event) {
    draggedTask = event.target;
    setTimeout(() => {
        draggedTask.style.display = "none";
    }, 0);
}

function dragEnd() {
    setTimeout(() => {
        if (draggedTask) {
            draggedTask.style.display = "block";
        }
        draggedTask = null;
    }, 0);
}

// Événements des conteneurs
function dragOver(event) {
    event.preventDefault();
}

function dragEnter(event) {
    event.preventDefault();
    event.target.classList.add("hovered");
}

function dragLeave(event) {
    event.target.classList.remove("hovered");
}

function dragDrop(event) {
    event.target.classList.remove("hovered");
    if (event.target.classList.contains("Tasks")) {
        // Vérifie que draggedTask est valide avant de l'ajouter
        if (draggedTask && draggedTask instanceof Node) {
            event.target.appendChild(draggedTask);
            updateStatusHeight(event.target);

            // Met à jour le statut de la tâche dans la base de données
            const newStatus = event.target.parentElement.querySelector(".title-status").textContent.trim();
            updateTaskStatus(draggedTask.dataset.id, newStatus);
        } else {
            console.error("draggedTask n'est pas un Node valide :", draggedTask);
        }
    }
}

// Mise à jour de la hauteur du conteneur
function updateStatusHeight(tasksContainer) {
    const taskCount = tasksContainer.children.length;
    const calculatedHeight = taskCount * 4;
    const maxHeight = 50 * (window.innerHeight / 100);

    if (taskCount > 0) {
        tasksContainer.style.maxHeight = `${Math.min(calculatedHeight * 16, maxHeight)}px`;
        tasksContainer.style.minHeight = "initial";
    } else {
        tasksContainer.style.maxHeight = "initial";
        tasksContainer.style.minHeight = "5rem";
    }
}



// Supprime toutes les tâches existantes dans l'interface
function clearTasks() {
    tasksContainers.forEach((container) => {
        container.innerHTML = "";
    });
}



// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    initializeDragAndDrop();
    loadTasksForTeam();
});
