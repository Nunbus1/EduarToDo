/**
 * Fonction pour réaliser des requêtes AJAX
 * @param {*} type Type de la requête (POST, GET, PUT, DELETE)
 * @param {*} _url URL de la requête
 * @param {*} callback Fonction à executéer après la requête
 * @param {*} data Data à envoyer avec la requête
 */
function ajaxRequest(type, _url, callback, data = null) {
    console.log("Requête AJAX : ", type, _url, data);

    let url = _url;
    const xhr = new XMLHttpRequest();

    if (type === "GET" && data != null) {
        url += `?${data}`;
    }
    xhr.open(type, url);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onload = () => {
        console.log("Statut de la réponse :", xhr.status);
        console.log("Texte de la réponse :", xhr.responseText);
        switch (xhr.status) {
            case 200:
            case 201:
                callback(xhr.responseText ? JSON.parse(xhr.responseText) : null);
                break;
            default:
                console.error("Erreur AJAX : ", xhr.status, xhr.responseText);
                callback(null);
                break;
        }
    };

    xhr.onerror = () => console.error("Erreur réseau ou serveur.");
    xhr.send(data);
}