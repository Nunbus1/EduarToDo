function updateTime() {
    const now = new Date();
   
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    document.getElementById('hour').textContent = `${hours} : ${minutes}`;
}

updateTime();

setInterval(updateTime, 1000);
