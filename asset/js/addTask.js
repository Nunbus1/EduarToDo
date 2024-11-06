const addTaskButtons = document.querySelectorAll('.add-task');

addTaskButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statusContainer = button.closest('.status'); // Trouve le conteneur "status" parent
        const tasksContainer = statusContainer.querySelector('.Tasks'); // Sélectionne la section ".Tasks" du status

        const newTask = document.createElement('div');
        newTask.classList.add('task');
        newTask.setAttribute('draggable', 'true');
        newTask.innerHTML = `
            <div class="upperInfo">
                    Task name
                    <div class="members">
                      <!-- Membres fictifs pour l'exemple -->
                      <div class="member-circle"></div>
                      <div class="member-circle"></div>
                      <div class="member-circle"></div>
                    </div>
                    <div class="priority">High</div>
                    <img
                      src="../asset/svg/Vector.svg"
                      alt="Options Icon"
                      class="options-icon-status"
                    />
                  </div>
                  <div class="lowerInfo">
                    <div class="deadLine">12/12/2024</div>
                    <div class="checkList">
                      <img
                        src="../asset/svg/Union.svg"
                        alt="Options Icon"
                        class="options-icon-status"
                      />
                      2/2
                    </div>
                  </div>
        `;

        newTask.addEventListener('dragstart', dragStart);
        newTask.addEventListener('dragend', dragEnd);

        tasksContainer.appendChild(newTask);

        updateStatusHeight(tasksContainer);
    });
});
