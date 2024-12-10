document.getElementById('shareBtn').addEventListener('click', openAddPopup);
document.getElementById('addMemberBtn').addEventListener('click', addMember);

function openAddPopup(){
    document.getElementById('addMemberPopup').style.display = 'block';
    document.getElementById('cancelAddMemberBtn').addEventListener('click', closeAddPopup);
}

function closeAddPopup(){
    document.getElementById('addMemberPopup').style.display = 'none';
}

function getTeamFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    return params.get('teamId'); // Renvoie l'ID de l'équipe
}

function addMember(){
    const mail = document.getElementById('memberMail').value;
    const id = getTeamFromURL();
    ajaxRequest(
        'GET', // Type de requête
        `../php/request.php/user`, // URL de l'API
        (response) => { // Callback pour traiter la réponse
            if (!response){
                alert("Cet utilisateur n'eiste pa");
            }
            else{
                ajaxRequest('POST', 
                `../php/request.php/part_of`,
                () => {
                    alert("Utilisateur ajouté avec succès");
                    closeAddPopup();
                },
                `resource=part_of&mail=${mail}&id=${id}`
                )
                //alert("Cet utilisateur n'eiste pa");
            }
        },
        `resource=user&action=getUserByMail&mail=${mail}`
    );
}