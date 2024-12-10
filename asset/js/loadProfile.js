/**
 * Gère le statut de chargement du profil
 */
let isLoadingProfile = false;

/**
 * Charge le profil d'un utilisateur à partir de son email.
 */
function loadProfilefromMail() {
    if (isLoadingProfile) return; // Empêche un double chargement
    isLoadingProfile = true;

    clearProfile();

    ajaxRequest(
        'GET', // Type de requête
        `../php/request.php/user`, // URL de l'API
        (response) => { // Callback pour traiter la réponse
            console.log("Réponse reçue :", response);
            console.log(response);
            console.log("Profil chargé pour le mail :", response[0]["first"]);
            firstName = response[0]["first"];
            lastName = response[0]["last"];
            picture = response[0]["picture"];
            mail = response[0]["mail"];
            displayInfos(mail, firstName, lastName, picture); // Affiche chaque tâche
            isLoadingProfile = false;
        },
        'resource=user&action=getUserByMail'
    );
}

/**
 * Efface les informations de profil existantes dans l'interface.
 */
function clearProfile() {
    const profileContainers = document.querySelectorAll(".Profile");
    profileContainers.forEach((container) => {
        container.innerHTML = "";
    });
}

/**
 * Affiche le nom complet du profil.
 * @param {string} name - Nom complet de l'utilisateur.
 */
function displayProfileName(name) {
    const profileName = document.querySelector(".profile-name");
    profileName.textContent = name;
}

/**
 * Affiche les informations du profil utilisateur.
 * @param {string} mail - Adresse email de l'utilisateur.
 * @param {string} first - Prénom de l'utilisateur.
 * @param {string} last - Nom de famille de l'utilisateur.
 * @param {string} picture - URL de l'image du profil.
 */
function displayInfos(mail, first, last, picture) {
    const container = document.querySelector(".Profile-container");
    const newElement = document.createElement("div");
    newElement.className = "Profile";

    newElement.innerHTML = `
        <div class="profile-image">
            <img src="${picture}" alt="Profile Picture" />
        </div>
        <div class="profile-form">
            <div class="row">
                <label for="first-name"><b>First name :</b> ${first}</label>
            </div>
            <div class="row">
                <label for="last-name"><b>Last name :</b> ${last}</label>
            </div>
            <div class="row">
                <label for="email"><b>Email address :</b> ${mail}</label>
            </div>
        </div>
    `;

    container.appendChild(newElement);
}

/**
 * Récupère l'email utilisateur à partir de l'URL.
 * @returns {string|null} Email de l'utilisateur ou null si absent.
 */
function getMailFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('user');
}

/**
 * Initialise le chargement du profil lors du chargement de la page.
 */
document.addEventListener("DOMContentLoaded", loadProfilefromMail);
