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

// Sélectionner tous les boutons de navigation
const navButtons = document.querySelectorAll(".nav-button");

// Ajouter un événement "click" à chaque bouton
navButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Obtenir la valeur de l'attribut data-section
        const section = button.getAttribute("data-section");

        // Définir l'URL cible en fonction de la section
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

        // Rediriger vers l'URL cible
        window.location.href = url;
    });
});