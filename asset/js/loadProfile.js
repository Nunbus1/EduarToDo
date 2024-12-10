let isLoadingProfile = false;
const ProfileContainers = document.querySelectorAll(".Profile");
function loadProfilefromMail() {
    console.log("loadProfilefromMail");
    console.log(isLoadingProfile);
    if (isLoadingProfile) return; // Si déjà en cours, n'exécute pas
    isLoadingProfile = true;
    // const mail = getMailFromURL();
    // console.log(mail);
    // if (!mail) {
    //     console.error("Aucun mail trouvée dans l'URL.");
    //     isLoadingProfile = false;
    //     return;
    // }
    clearProfile();
    //console.log(teamId);
    
    // Utilisation de ajaxRequest
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
            displayInfos(response[0]["mail"], firstName, lastName, picture); // Affiche chaque tâche
            isLoadingProfile = false;
        },
        `resource=user&action=getUserByMail`  // Paramètres à envoyer dans l'URL
    );
}

// Supprime toutes les tâches existantes dans l'interface
function clearProfile() {
    console.log("clear");
    ProfileContainers.forEach((container) => {
        container.innerHTML = "";
    });
}

function displayProfileName(name){
    const ProfileName = document.querySelector(".profile-name");
    ProfileName.textContent = name;
}

function displayInfos(mail, first, last, picture) {
    // dans quel champ afficher l'info
    const Container = document.querySelector(".Profile-container");

    // Crée un nouvel élément de tâche
    const newElement = document.createElement("div");
    newElement.className = "Profile";
    newElement.innerHTML = `
    <div class="profile-image">
        <img src="../asset/img/cat.jpg" />
    </div>
    <div class="profile-form">
        <div class="row">
            <label for="first-name"><b>First name :</b> ${first}</label>
        </div>
        <div class="row">
            <label for="last-name"><b>Last name :</b> ${last}</label>
        </div>
        <div class="row">
            <label for="email"><b>e-mail address :</b> ${mail}</label>
        </div>
    </div>
    `;

    // Ajoute la tâche au bon conteneur
    Container.appendChild(newElement);

}


function getMailFromURL() {
    const params = new URLSearchParams(window.location.search);
    // console.log(params.get('user'));
    return params.get('user'); // Renvoie le mail du user
}


// // Charge les tâches dès que la page est prête
// document.removeEventListener("DOMContentLoaded", loadTasksForTeam);
document.addEventListener("DOMContentLoaded", loadProfilefromMail);
