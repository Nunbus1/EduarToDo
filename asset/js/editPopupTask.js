// Sélection des éléments nécessaires pour l'édition
const editButton = document.querySelector(".edit-btn");
const taskNameElement = document.querySelector(".taskName");
const taskDescriptionElement = document.querySelector(".taskDescription p");
const priorityInputs = document.querySelectorAll('input[name="priority"]');
const statusRadios = document.querySelectorAll('.options input[name="status"]');
const creationInput = document.querySelector("#creationInput");
const deadlineInput = document.querySelector("#deadlineInput");
const addSubtaskButton = document.getElementById('add-subtask');
let subtaskStatus = document.querySelectorAll(".check-item");
let isEditing = false;

/**
 * Active ou désactive les champs pour l'édition.
 * @param {boolean} enable - Active (true) ou désactive (false) le mode édition.
 */
function toggleEditing(enable) {
    isEditing = enable;

    if (enable) {
        const currentName = document.querySelector(".taskName");
        if (currentName) {
            const editableName = document.createElement("textarea");
            editableName.className = "editable-name";
            editableName.textContent = currentName.textContent;
            currentName.replaceWith(editableName);
        }

        const currentDescription = document.querySelector(".taskDescription p");
        if (currentDescription) {
            const editableDescription = document.createElement("textarea");
            editableDescription.className = "editable-description";
            editableDescription.textContent = currentDescription.textContent;
            currentDescription.replaceWith(editableDescription);
        }
    } else {
        const editableName = document.querySelector(".editable-name");
        if (editableName) {
            const currentName = document.createElement("div");
            currentName.className = "taskName";
            currentName.textContent = editableName.value;
            editableName.replaceWith(currentName);
        }

        const editableDescription = document.querySelector(".editable-description");
        if (editableDescription) {
            const currentDescription = document.createElement("p");
            currentDescription.textContent = editableDescription.value;
            editableDescription.replaceWith(currentDescription);
        }
    }

    addSubtaskButton.disabled = !enable;

    priorityInputs.forEach((input) => {
        input.disabled = !enable;
    });

    statusRadios.forEach((radio) => {
        radio.disabled = !enable;
    });

    creationInput.disabled = !enable;
    deadlineInput.disabled = !enable;
}

/**
 * Gestionnaire d'événement pour le bouton "Edit".
 * Active le mode édition ou valide les modifications.
 */
editButton.addEventListener("click", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get("id");

    if (!taskId) {
        console.error("Impossible de récupérer l'ID de la tâche.");
        return;
    }

    if (editButton.textContent === "Edit") {
        toggleEditing(true);
        editButton.textContent = "Validate";
    } else {
        const updatedTask = {
            id: taskId,
            name: document.querySelector(".editable-name")?.value,
            description: document.querySelector(".editable-description")?.value,
            significance: document.querySelector('input[name="priority"]:checked')?.value,
            status: document.querySelector('input[name="status"]:checked')?.value,
            start_date: creationInput.value,
            deadline: deadlineInput.value,
        };

        if (!updatedTask.name || !updatedTask.description || !updatedTask.significance || !updatedTask.status) {
            alert("Tous les champs doivent être remplis.");
            return;
        }

        ajaxRequest(
            "PUT",
            `../php/request.php/task/${taskId}`,
            (response) => {
                if (response && response.success) {

                    toggleEditing(false);
                    editButton.textContent = "Edit";
                    openPopup(taskId);
                } else {
                    console.error("Erreur lors de la mise à jour :", response?.message || "Aucune réponse.");
                }
            },
            JSON.stringify(updatedTask)
        );
    }
});
