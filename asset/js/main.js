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

// document.querySelectorAll('.nav-button').forEach(button => {
//     button.addEventListener('click', () => {
//         // Cacher toutes les sections
//         document.querySelectorAll('.section').forEach(section => {
//             section.style.display = 'none';
//         });

//         // Afficher la section correspondant au bouton cliqué
//         const sectionId = button.getAttribute('data-section');
//         document.getElementById(sectionId).style.display = 'block';
//     });
// });

