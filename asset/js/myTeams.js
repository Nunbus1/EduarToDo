// Fonction pour charger les équipes
function loadTeams(userMail) {
    ajaxRequest('GET', `../php/request.php/teams`, (response) => {
        if (response && response.success) {
            const teams = response.teams; // Les équipes sont retournées ici.
            const teamsList = document.querySelector('.teams-list');

            // Vider la liste avant d'ajouter de nouvelles équipes
            teamsList.innerHTML = '';
            console.log(response.teams);
            // Ajouter chaque équipe
            teams.forEach((team) => {
                const teamElement = document.createElement('div');
                teamElement.classList.add('t-circle'); // Ajoute la classe 'team-circle'
                teamElement.classList.add(`team-${team.id}`);
                teamElement.textContent = team.teamName || `Unnamed Team`;

                // Ajouter l'équipe à la liste
                teamsList.appendChild(teamElement);
            });

            // Ajouter le bouton "+" toujours à la fin
            const addButton = document.createElement('button');
            addButton.className = 'add-btn';
            addButton.id = 'openAddTeamPopup';
            addButton.textContent = '+';
            teamsList.appendChild(addButton);

            // Ajouter l'événement une fois le bouton "+" créé
            addButton.addEventListener('click', showPopupTeam);
            addClickEventToTeams();
        } else {
            console.error('Erreur lors du chargement des équipes :', response?.message || 'Aucune réponse');
        }
    });
}

// Sélection des éléments
const popupOverlay = document.getElementById('addTeamPopup');
const cancelPopupBtn = document.getElementById('cancelPopupBtn');

// Fonction pour afficher la popup
function showPopupTeam() {
    popupOverlay.style.display = 'flex';
    console.log('Popup ouverte');
}

// Fonction pour fermer la popup
function closePopupTeam() {
    popupOverlay.style.display = 'none';
}

// Ajouter un événement pour fermer la popup quand on clique sur "Cancel" ou à l'extérieur de la popup
cancelPopupBtn.addEventListener('click', closePopupTeam);

popupOverlay.addEventListener('click', (event) => {
    if (event.target === popupOverlay) {
        closePopupTeam();
    }
});


// Sélection des éléments
const createTeamBtn = document.getElementById('createTeamBtn');
const deleteTeamBtn = document.getElementById('deleteTeamBtn');
const teamTitleInput = document.getElementById('teamTitle');
const teamDescriptionInput = document.getElementById('teamDescription');
// Récupérer la chaîne de requête depuis l'URL
const queryString = window.location.search;

// Utiliser l'API URLSearchParams pour analyser la chaîne de requête
const urlParams = new URLSearchParams(queryString);

// Extraire le paramètre 'mail'
const userMail = urlParams.get('mail'); // Valeur par défaut si 'mail' n'est pas défini

// Fonction pour vérifier les champs obligatoires
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

// Fonction pour créer une nouvelle équipe
function createTeam() {
    // Valider les champs
    if (!validateFields()) {
        return;
    }

    // Préparer les données pour le POST
    const teamData = {
        teamName: teamTitleInput.value.trim(),
        description: teamDescriptionInput.value.trim(),
        mail: userMail,
    };
    const encodedTeamData = Object.keys(teamData)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(teamData[key])}`)
    .join('&');
    // Requête POST pour créer la team
    ajaxRequest(
        'POST',
        '../php/request.php/teams', loadPage,encodedTeamData
    );
}

// Ajouter l'événement au bouton "Create"
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

    // Attacher l'événement à chaque élément
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
    
    // Supprimer les anciens événements de clic et ajouter celui de suppression
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

// Fonction qui remet l'événement original après la suppression de l'équipe
function restoreOriginalEvent(teamElement) {
    // Retirer l'événement de suppression
    teamElement.removeEventListener('click', deleteTeam);
    
    // Remettre l'événement original (redirection vers la page)
    teamElement.addEventListener('click', teamElement._teamClickHandler);
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

    ajaxRequest("DELETE", `../php/request.php/teams/${teamId}`, () => {
          // Supprimer la team de l'interface
          const teamElement = document.querySelector(`.team-${teamId}`);
          if (teamElement) {
            teamElement.remove();
          }        
      });
    
    // Après la suppression de l'équipe, restaurer l'événement original
    if (teamElement) {
        restoreOriginalEvent(teamElement);
    }
}

// Appel initial pour ajouter les événements
addClickEventToTeams();

// Ajouter un événement pour le bouton de suppression
if (deleteTeamBtn)
    deleteTeamBtn.addEventListener('click', handleDeleteButtonClick);

function loadPage() {
    closePopupTeam();
    loadTeams(userMail);
}

// Appel de loadTeams une fois le DOM chargé
document.addEventListener('DOMContentLoaded', loadPage());