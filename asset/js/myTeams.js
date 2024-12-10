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

createTeamBtn.addEventListener('click', createTeam);

// Fonction pour ajouter l'événement de clic aux éléments 'team-circle'
function addClickEventToTeams() {
    const teamElements = document.querySelectorAll('.t-circle');
    
    // Fonction pour gérer le clic (rediriger vers la page de l'équipe)
    const teamClickHandler = (teamElement) => {
        const classes = teamElement.className.split(' '); // Divise les classes
        const teamIdClass = classes.find((cls) => cls.startsWith('team-')); // Trouve la classe contenant l'ID
        if (teamIdClass) {
            const teamId = teamIdClass.split('-')[1]; // Extrait l'ID (ex: 'team-1' devient '1')
            window.location.href = `team.html?teamId=${teamId}`; // Redirige vers l'URL
        } else {
            console.error('ID de team non trouvé');
        }
    };

    // Attacher l'événement de redirection à chaque élément
    teamElements.forEach((teamElement) => {
        // Utilisation d'une fonction d'enveloppement pour lier correctement l'élément
        const wrappedTeamClickHandler = () => teamClickHandler(teamElement);
        teamElement.addEventListener('click', wrappedTeamClickHandler);
        
        // Stocker la fonction pour pouvoir la retirer et la remettre plus tard
        teamElement._teamClickHandler = wrappedTeamClickHandler;
    });
}

// Fonction pour gérer le clic du bouton de suppression
function handleDeleteButtonClick() {
    var teams = document.querySelectorAll('.t-circle');
    
    // Supprimer les anciens événements de redirection et ajouter celui de suppression
    teams.forEach((teamElement) => {
        // Retirer l'ancien gestionnaire d'événement de redirection
        teamElement.removeEventListener('click', teamElement._teamClickHandler);
        
        // Ajouter un nouveau gestionnaire pour supprimer l'équipe
        teamElement.addEventListener('click', (event) => {
            const teamId = getTeamIdFromElement(event.target);
            deleteTeam(teamId); // Passer l'ID à la fonction de suppression
        });
    });
}

// Fonction pour extraire l'ID de l'équipe à partir de l'élément
function getTeamIdFromElement(teamElement) {
    const classes = teamElement.className.split(' '); // Divise les classes
    const teamIdClass = classes.find((cls) => cls.startsWith('team-')); // Trouve la classe contenant l'ID
    if (teamIdClass) {
        return teamIdClass.split('-')[1]; // Extrait l'ID (ex: 'team-1' devient '1')
    } else {
        console.error('ID de team non trouvé');
        return null;
    }
}

// Fonction pour supprimer l'équipe (accepte l'ID de l'équipe)
function deleteTeam(teamId) {
    console.log(`Suppression de l'équipe avec l'ID : ${teamId}`);
    
    // Simuler la suppression de l'élément
    const teamElement = document.querySelector(`.team-${teamId}`);
    if (teamElement) {
        teamElement.remove(); // Retirer l'élément de l'interface
    }

    // Appel pour réinitialiser les événements sur les autres équipes restantes
    addClickEventToTeams(); // Remettre les événements de redirection sur les autres équipes
}

// Fonction pour restaurer les événements de redirection
function restoreOriginalEventAfterDeletion() {
    var teams = document.querySelectorAll('.t-circle');
    
    // Remettre l'événement de redirection après suppression
    teams.forEach((teamElement) => {
        // Retirer l'événement de suppression
        teamElement.removeEventListener('click', deleteTeam);
        
        // Remettre l'événement de redirection original
        const wrappedTeamClickHandler = teamElement._teamClickHandler;
        if (wrappedTeamClickHandler) {
            teamElement.addEventListener('click', wrappedTeamClickHandler);
        }
    });
}

// Appel initial pour ajouter les événements
addClickEventToTeams();

// Ajouter un événement pour le bouton de suppression
deleteTeamBtn.addEventListener('click', handleDeleteButtonClick);

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