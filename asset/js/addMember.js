// Ajoute un événement au bouton "Partager" pour ouvrir la popup d'ajout de membre
document.getElementById('shareBtn').addEventListener('click', openAddPopup);

// Ajoute un événement au bouton "Ajouter un membre" pour déclencher l'ajout d'un utilisateur
document.getElementById('addMemberBtn').addEventListener('click', addMember);

/**
 * Affiche la popup d'ajout de membre.
 * Ajoute un événement au bouton "Annuler" pour fermer la popup.
 */
function openAddPopup() {
    document.getElementById('addMemberPopup').style.display = 'block';
    document.getElementById('cancelAddMemberBtn').addEventListener('click', closeAddPopup);
}

/**
 * Ferme la popup d'ajout de membre.
 */
function closeAddPopup() {
    document.getElementById('addMemberPopup').style.display = 'none';
}

/**
 * Récupère l'ID de l'équipe depuis l'URL.
 * @returns {string|null} - Renvoie l'ID de l'équipe ou null si absent.
 */
function getTeamFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('teamId');
}

/**
 * Ajoute un membre à une équipe en utilisant l'email fourni.
 * Vérifie si l'utilisateur existe, puis l'ajoute à l'équipe si la validation est réussie.
 */
function addMember() {
    const mail = document.getElementById('memberMail').value; // Récupère l'email saisi
    const id = getTeamFromURL(); // Récupère l'ID de l'équipe depuis l'URL

    // Vérifie si l'utilisateur existe
    ajaxRequest(
        'GET',
        `../php/request.php/user`,
        (response) => {
            if (!response) {
                alert("Cet utilisateur n'existe pas"); // Alerte si l'utilisateur n'existe pas
            } else {
                // Si l'utilisateur existe, l'ajoute à l'équipe
                ajaxRequest(
                    'POST',
                    `../php/request.php/part_of`,
                    () => {
                        alert("Utilisateur ajouté avec succès"); // Confirmation d'ajout
                        closeAddPopup(); // Ferme la popup après l'ajout
                    },
                    `resource=part_of&mail=${mail}&id=${id}`
                );
            }
        },
        `resource=user&action=getUserByMail&mail=${mail}`
    );
}
