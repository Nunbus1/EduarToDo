let draggedTask = null;

// Initialisation des événements
function initializeDragAndDrop() {
    const tasks = document.querySelectorAll(".task");
    console.log("Tâches détectées :", tasks);

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
    console.log(`Tâche '${draggedTask.textContent}' en cours de déplacement.`);
}

function dragEnd() {
    if (draggedTask) {
        draggedTask.style.opacity = "1"; // Réinitialise l’opacité
    }
    draggedTask = null;
    console.log("Déplacement terminé.");
}

// Gestion des événements des conteneurs
function dragOver(event) {
    event.preventDefault(); // Autorise le drop
    console.log("dragOver détecté.");
}

function dragEnter(event) {
    event.preventDefault();
    if (event.target.classList.contains("Tasks")) {
        event.target.classList.add("hovered");
    }
    console.log("dragEnter détecté.");
}

function dragLeave(event) {
    if (event.target.classList.contains("Tasks")) {
        event.target.classList.remove("hovered");
    }
    console.log("dragLeave détecté.");
}

function dragDrop(event) {
    event.preventDefault();
    if (event.target.classList.contains("Tasks") && draggedTask) {
        event.target.classList.remove("hovered");

        // Ajoute la tâche déplacée au nouveau conteneur
        event.target.appendChild(draggedTask);
        console.log(`Tâche déplacée vers : ${event.target.closest(".status").querySelector(".title-status").textContent.trim()}`);
    } else {
        console.error("Impossible de drop la tâche.");
    }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    initializeDragAndDrop();
});
