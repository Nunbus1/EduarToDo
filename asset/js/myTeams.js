// Charge les équipes depuis le serveur et les affiche dans l'interface utilisateur
function loadTeams(userMail) {
    ajaxRequest('GET', `../php/request.php/teams`, (response) => {
        if (response && response.success) {
            const teams = response.teams; 
            const teamsList = document.querySelector('.teams-list');

            // Réinitialise la liste des équipes
            teamsList.innerHTML = '';

            // Ajoute chaque équipe à l'interface utilisateur
            teams.forEach((team) => {
                const teamElement = document.createElement('div');
                teamElement.classList.add('t-circle');
                teamElement.classList.add(`team-${team.id}`);
                teamElement.textContent = team.teamName || `Unnamed Team`;
                teamsList.appendChild(teamElement);
            });

            // Ajoute un bouton "+" pour ajouter une nouvelle équipe
            const addButton = document.createElement('button');
            addButton.className = 'add-btn';
            addButton.id = 'openAddTeamPopup';
            addButton.textContent = '+';
            teamsList.appendChild(addButton);

            // Ajoute les événements nécessaires
            addButton.addEventListener('click', showPopupTeam);
            addClickEventToTeams();
        } else {
            console.error('Erreur lors du chargement des équipes :', response?.message || 'Aucune réponse');
        }
    });
}

// Sélection des éléments nécessaires pour la popup
const popupOverlay = document.getElementById('addTeamPopup');
const cancelPopupBtn = document.getElementById('cancelPopupBtn');

// Affiche la popup pour ajouter une nouvelle équipe
function showPopupTeam() {
    popupOverlay.style.display = 'flex';
    console.log('Popup ouverte');
}

// Ferme la popup pour ajouter une nouvelle équipe
function closePopupTeam() {
    popupOverlay.style.display = 'none';
}

// Ajoute un événement pour fermer la popup lorsqu'on clique sur "Cancel"
cancelPopupBtn.addEventListener('click', closePopupTeam);

// Ajoute un événement pour fermer la popup lorsqu'on clique à l'extérieur
popupOverlay.addEventListener('click', (event) => {
    if (event.target === popupOverlay) {
        closePopupTeam();
    }
});

// Sélection des éléments pour la création et suppression d'équipes
const createTeamBtn = document.getElementById('createTeamBtn');
const deleteTeamBtn = document.getElementById('deleteTeamBtn');
const teamTitleInput = document.getElementById('teamTitle');
const teamDescriptionInput = document.getElementById('teamDescription');

// Récupère les paramètres de l'URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Extrait l'email de l'utilisateur connecté
const userMail = urlParams.get('mail'); 

// Valide les champs nécessaires avant de créer une équipe
function validateFields() {
    if (!teamTitleInput.value.trim()) {
        alert('Team Title cannot be empty!');
        return false;
    }
    if (!teamDescriptionInput.value.trim()) {
        alert('Description cannot be empty!');
        return false;
    }
    return true;
}

// Crée une nouvelle équipe en envoyant une requête POST
function createTeam() {
    if (!validateFields()) {
        return;
    }

    const teamData = {
        teamName: teamTitleInput.value.trim(),
        description: teamDescriptionInput.value.trim(),
        mail: userMail,
    };
    const encodedTeamData = Object.keys(teamData)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(teamData[key])}`)
    .join('&');

    // Envoie une requête pour créer la nouvelle équipe
    ajaxRequest(
        'POST',
        '../php/request.php/teams', loadPage, encodedTeamData
    );
}

// Ajoute l'événement de clic pour la création d'une équipe
createTeamBtn.addEventListener('click', createTeam);

// Ajoute des événements pour rediriger vers les pages des équipes
function addClickEventToTeams() {
    const teamElements = document.querySelectorAll('.t-circle');

    // Définit un gestionnaire de clic pour chaque équipe
    const teamClickHandler = (teamElement) => {
        const classes = teamElement.className.split(' ');
        const teamIdClass = classes.find((cls) => cls.startsWith('team-'));
        if (teamIdClass) {
            const teamId = teamIdClass.split('-')[1];
            window.location.href = `team.html?teamId=${teamId}`;
        } else {
            console.error('ID de team non trouvé');
        }
    };

    // Ajoute l'événement de clic à chaque élément d'équipe
    teamElements.forEach((teamElement) => {
        const wrappedTeamClickHandler = () => teamClickHandler(teamElement);
        teamElement.addEventListener('click', wrappedTeamClickHandler);
        teamElement._teamClickHandler = wrappedTeamClickHandler;
    });
}

// Gère les clics pour activer la suppression d'une équipe
function handleDeleteButtonClick() {
    var teams = document.querySelectorAll('.t-circle');

    // Ajoute un gestionnaire pour la suppression
    teams.forEach((teamElement) => {
        teamElement.removeEventListener('click', teamElement._teamClickHandler);

        teamElement.addEventListener('click', (event) => {
            const teamId = getTeamIdFromElement(event.target);
            deleteTeam(teamId); 
        });
    });
}

// Restaure l'événement original après la suppression d'une équipe
function restoreOriginalEvent(teamElement) {
    teamElement.removeEventListener('click', deleteTeam);
    teamElement.addEventListener('click', teamElement._teamClickHandler);
}

// Extrait l'ID d'une équipe depuis son élément DOM
function getTeamIdFromElement(teamElement) {
    const classes = teamElement.className.split(' ');
    const teamIdClass = classes.find((cls) => cls.startsWith('team-')); 
    if (teamIdClass) {
        return teamIdClass.split('-')[1]; 
    } else {
        console.error('ID de team non trouvé');
        return null;
    }
}

// Supprime une équipe en envoyant une requête DELETE
function deleteTeam(teamId) {
    console.log(`Suppression de l'équipe avec l'ID : ${teamId}`);

    ajaxRequest("DELETE", `../php/request.php/teams/${teamId}`, () => {
        const teamElement = document.querySelector(`.team-${teamId}`);
        if (teamElement) {
            teamElement.remove();
        }        
    });

    if (teamElement) {
        restoreOriginalEvent(teamElement);
    }
}

// Ajoute des événements pour gérer les équipes
addClickEventToTeams();

// Ajoute l'événement pour activer la suppression si le bouton existe
if (deleteTeamBtn) {
    deleteTeamBtn.addEventListener('click', handleDeleteButtonClick);
}

// Initialise la page et charge les équipes
function loadPage() {
    closePopupTeam();
    loadTeams(userMail);
}

// Charge les équipes après le chargement du DOM
document.addEventListener('DOMContentLoaded', loadPage);
