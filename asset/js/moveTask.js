
const tasks = document.querySelectorAll('.task');
const tasksContainers = document.querySelectorAll('.Tasks');

tasks.forEach(task => {
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
});

tasksContainers.forEach(container => {
    container.addEventListener('dragover', dragOver);
    container.addEventListener('dragenter', dragEnter);
    container.addEventListener('dragleave', dragLeave);
    container.addEventListener('drop', dragDrop);
});

let draggedTask = null;

function dragStart(event) {
    draggedTask = event.target;
    setTimeout(() => {
        draggedTask.style.display = 'none';
    }, 0);
}

function dragEnd(event) {
    setTimeout(() => {
        draggedTask.style.display = 'block';
        draggedTask = null;
    }, 0);
}

function dragOver(event) {
    event.preventDefault();
}

function dragEnter(event) {
    event.preventDefault();
    event.target.classList.add('hovered'); // Ajoute une classe pour l'effet visuel
}

function dragLeave(event) {
    event.target.classList.remove('hovered');
}

function dragDrop(event) {
    event.target.classList.remove('hovered');
    if (event.target.classList.contains('Tasks')) {
        event.target.appendChild(draggedTask); // Dépose la tâche dans la section `.Tasks`
        updateStatusHeight(event.target);
    }
}

function updateStatusHeight(tasksContainer) {
    const taskCount = tasksContainer.children.length;
    if (taskCount > 0) {
        tasksContainer.style.maxHeight = `${taskCount * 4}rem`; // Ajuste la hauteur en fonction du nombre de tâches
    } else {
        tasksContainer.style.maxHeight = 'initial'; // Taille minimale lorsqu'il n'y a aucune tâche
    }
}
