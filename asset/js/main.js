/**
 * Met à jour la date affichée dans l'élément avec l'ID "date".
 * Affiche le jour de la semaine, le jour du mois, le mois abrégé et l'année.
 */
function updateDate() {
    const now = new Date();

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[now.getDay()];
    const day = now.getDate().toString().padStart(2, '0');
    const month = now.toLocaleString('default', { month: 'short' });
    const year = now.getFullYear();

    document.getElementById('date').innerHTML = `${dayName}<br>${day} ${month} ${year}`;
}

// Initialisation de la date au chargement
updateDate();

// Met à jour la date tous les 24 heures
setInterval(updateDate, 86400000);

/**
 * Ajoute des événements "click" aux boutons de navigation
 * pour rediriger vers les pages correspondantes.
 */
function initializeNavigation() {
    const navButtons = document.querySelectorAll(".nav-button");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const section = button.getAttribute("data-section");

            let url = "";
            switch (section) {
                case "dashboard":
                    url = "dashboard.html";
                    break;
                case "team":
                    url = "myTeams.html";
                    break;
                case "calendar":
                    url = "calendar.html";
                    break;
                case "profile":
                    url = "profile.html";
                    break;
                case "support":
                    url = "support.html";
                    break;
                default:
                    console.error("Section inconnue : ", section);
                    return;
            }

            window.location.href = url;
        });
    });
}

// Initialisation de la navigation au chargement
initializeNavigation();
