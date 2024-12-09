const container = document.querySelector('.container');
const LoginLink = document.querySelector('.SignInLink');
const RegisterLink = document.querySelector('.SignUpLink');

RegisterLink.addEventListener('click', () =>{
    container.classList.add('active');
})

LoginLink.addEventListener('click', () => {
    container.classList.remove('active');
})

//Login
document.addEventListener("DOMContentLoaded", () => {
    const LoginButton = document.querySelector(".btn-login");

    LoginButton.addEventListener("click", (event) => {
        event.preventDefault(); // Empêche le rechargement de la page

        const LoginUser = document.getElementById("LoginUser").value;
        const LoginPassword = document.getElementById("LoginPassword").value;
        console.log(LoginUser);
        console.log(LoginPassword);
       // Requête AJAX pour récupérer le cookie de session
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '../php/request.php/connexion');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.setRequestHeader('Authorization', 'Basic ' + btoa(`${LoginUser}:${LoginPassword}`));

		xhr.onload = () => {
			switch (xhr.status) {
				case 200:
                    console.log(xhr.responseText);
                    console.log(xhr.responseText.length);
                    var db = JSON.stringify(xhr.responseText);
					Cookies.set('token', JSON.parse(db));
					console.log('Authentification réussite !');
					document.location.href = 'myTeams.html';
					break;

				default:
					console.log('Email ou mot de passe incorrect');
					break;
			}
		};

		xhr.send();
    });
});

//Register
document.addEventListener("DOMContentLoaded", () => {
    const RegisterButton = document.querySelector(".btn-register");

    RegisterButton.addEventListener("click", (event) => {
        event.preventDefault(); // Empêche le rechargement de la page

        const RegisterFirstName = document.getElementById("RegisterFirst").value;
        const RegisterLastname = document.getElementById("RegisterLast").value;
        const RegisterMail = document.getElementById("RegisterMail").value;
        const RegisterPassword = document.getElementById("RegisterPassword").value;
        ajaxRequest(
                    "POST",
                    `../php/request.php/user`,
                    () => {
                        window.location.href = `myTeams.html?mail=${RegisterMail}`; // Redirige vers l'URL
                    },
                    `resource=user&mail=${RegisterMail}&first=${RegisterFirstName}&last=${RegisterLastname}&password=${RegisterPassword}`
                );
            
    });
});


