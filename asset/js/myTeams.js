// Fonction pour charger les équipes
function loadTeams(userMail) {
    ajaxRequest('GET', `../php/request.php/teams?mail=${encodeURIComponent(userMail)}`, (response) => {
        if (response && response.success) {
            const teams = response.teams; // Les équipes sont retournées ici.
            const teamsList = document.querySelector('.teams-list');

            // Vider la liste avant d'ajouter de nouvelles équipes
            teamsList.innerHTML = '';

            // Ajouter chaque équipe
            teams.forEach((team) => {
                const teamElement = document.createElement('div');
                teamElement.classList.add('t-circle'); // Ajoute la classe 'team-circle'
                teamElement.classList.add(`team-${team.id}`);
                teamElement.textContent = team.name || `Unnamed Team`;

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
            addButton.addEventListener('click', showPopup);
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
function showPopup() {
    popupOverlay.style.display = 'flex';
    console.log('Popup ouverte');
}

// Fonction pour fermer la popup
function closePopup() {
    popupOverlay.style.display = 'none';
}

// Ajouter un événement pour fermer la popup quand on clique sur "Cancel" ou à l'extérieur de la popup
cancelPopupBtn.addEventListener('click', closePopup);

popupOverlay.addEventListener('click', (event) => {
    if (event.target === popupOverlay) {
        closePopup();
    }
});


// Sélection des éléments
const createTeamBtn = document.getElementById('createTeamBtn');
const teamTitleInput = document.getElementById('teamTitle');
const teamDescriptionInput = document.getElementById('teamDescription');
const userMail = "monmail@orange.fr"; // Email par défaut pour les tests

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
        name: teamTitleInput.value.trim(),
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

function addClickEventToTeams() {
    // Sélectionne tous les éléments avec la classe 'team-circle'
    
    const teamElements = document.querySelectorAll('.t-circle');
    
    teamElements.forEach((teamElement) => {
        teamElement.addEventListener('click', () => {
            console.log('salut');
            // Extraire l'ID de l'équipe à partir de la classe
            const classes = teamElement.className.split(' '); // Divise les classes
            const teamIdClass = classes.find((cls) => cls.startsWith('team-')); // Trouve la classe contenant l'ID
            if (teamIdClass) {
                const teamId = teamIdClass.split('-')[1]; // Extrait l'ID (ex: 'team-1' devient '1')
                window.location.href = `team.html?teamId=${teamId}`; // Redirige vers l'URL
            } else {
                console.error('ID de team non trouvé');
            }
        });
    });
}

function loadPage() {
    const userMail = "monmail@orange.fr"; // Adresse e-mail par défaut. Peut être remplacée dynamiquement.
    closePopup();
    loadTeams(userMail);
    
}



// Appel de loadTeams une fois le DOM chargé
document.addEventListener('DOMContentLoaded', loadPage());