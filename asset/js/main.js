function updateDate() {
    const now = new Date();

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[now.getDay()];
    const day = now.getDate().toString().padStart(2, '0');
    const month = now.toLocaleString('default', { month: 'short' });
    const year = now.getFullYear();

    document.getElementById('date').innerHTML = `${dayName}<br>${day} ${month} ${year}`;
}

updateDate();

setInterval(updateDate, 86400000);


document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', () => {
        // Cacher toutes les sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });

        // Afficher la section correspondant au bouton cliqué
        const sectionId = button.getAttribute('data-section');
        document.getElementById(sectionId).style.display = 'block';
    });
});


// Met à jour l'URL pour inclure le nom de la team
function updateTeamInURL(teamName) {
    const currentUrl = window.location.href.split('?')[0]; // Supprime les éventuels paramètres actuels
    const newUrl = `${currentUrl}?team=${encodeURIComponent(teamName)}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

// Appelle cette fonction lors du chargement de la page ou quand la team change
document.addEventListener("DOMContentLoaded", () => {
    const activeTeamName = "Team1"; // Remplace par une méthode pour récupérer dynamiquement la team
    updateTeamInURL(activeTeamName);
});

// Récupérer le dernier segment de l'URL (par exemple : "team1")
const urlSegments = window.location.pathname.split('/');
const teamName = urlSegments[urlSegments.length - 1] || null;

if (teamName) {
    console.log(`Chargement des données pour l'équipe : ${teamName}`);
    // Charger les tâches de l'équipe
    loadTasks(teamName);
} else {
    console.log("Aucune équipe spécifiée dans l'URL.");
}
