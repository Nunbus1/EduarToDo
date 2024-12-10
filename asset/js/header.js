/**
 * Met à jour l'affichage de l'heure actuelle au format HH : MM.
 */
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeElement = document.getElementById('hour');

    if (timeElement) {
        timeElement.textContent = `${hours} : ${minutes}`;
    }
}

// Initialise l'affichage de l'heure et met à jour chaque seconde
updateTime();
setInterval(updateTime, 1000);
