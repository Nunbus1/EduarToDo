
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
    event.target.classList.add('hovered');
}

function dragLeave(event) {
    event.target.classList.remove('hovered');
}

function dragDrop(event) {
    event.target.classList.remove('hovered');
    if (event.target.classList.contains('Tasks')) {
        event.target.appendChild(draggedTask);
        updateStatusHeight(event.target);
    }
}

function updateStatusHeight(tasksContainer) {
    const taskCount = tasksContainer.children.length;

    
    const calculatedHeight = taskCount * 4;
    const maxHeight = 50 * (window.innerHeight / 100);

    if (taskCount > 0) {
        tasksContainer.style.maxHeight = `${Math.min(calculatedHeight * 16, maxHeight)}px`;
        tasksContainer.style.minHeight = 'initial';
    } else {
        tasksContainer.style.maxHeight = 'initial';
        tasksContainer.style.minHeight = '5rem';
    }
}
