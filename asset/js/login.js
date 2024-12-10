/**
 * Initialise les événements pour la gestion du formulaire de connexion et d'inscription.
 */
function initAuthForms() {
    const LoginLink = document.querySelector('.SignInLink');
    const RegisterLink = document.querySelector('.SignUpLink');
    const container = document.querySelector('.container');

    if (RegisterLink && LoginLink && container) {
        RegisterLink.addEventListener('click', () => {
            container.classList.add('active');
        });

        LoginLink.addEventListener('click', () => {
            container.classList.remove('active');
        });
    }
}

/**
 * Initialise le processus de connexion via une requête AJAX.
 */
function initLogin() {
    const LoginButton = document.querySelector(".btn-login");

    if (LoginButton) {
        LoginButton.addEventListener("click", (event) => {
            event.preventDefault();
            const LoginUser = document.getElementById("LoginUser").value;
            const LoginPassword = document.getElementById("LoginPassword").value;

            let xhr = new XMLHttpRequest();
            xhr.open('GET', '../php/request.php/connexion');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(`${LoginUser}:${LoginPassword}`));

            xhr.onload = () => {
                switch (xhr.status) {
                    case 200:
                        const db = JSON.stringify(xhr.responseText);
                        Cookies.set('token', JSON.parse(db));
                        document.location.href = 'myTeams.html';
                        break;
                    default:
                        console.error('Email ou mot de passe incorrect');
                        break;
                }
            };

            xhr.send();
        });
    }
}

/**
 * Initialise le processus d'inscription via une requête AJAX.
 */
function initRegister() {
    const RegisterButton = document.querySelector(".btn-register");

    if (RegisterButton) {
        RegisterButton.addEventListener("click", (event) => {
            event.preventDefault();
            const RegisterFirstName = document.getElementById("RegisterFirst").value;
            const RegisterLastname = document.getElementById("RegisterLast").value;
            const RegisterMail = document.getElementById("RegisterMail").value;
            const RegisterPassword = document.getElementById("RegisterPassword").value;

            ajaxRequest(
                "POST",
                `../php/request.php/user`,
                () => {
                    window.location.href = `login.html`;
                },
                `resource=user&mail=${RegisterMail}&first=${RegisterFirstName}&last=${RegisterLastname}&password=${RegisterPassword}`
            );
        });
    }
}

/**
 * Fonction principale appelée lorsque le DOM est chargé.
 */
function main() {
    initAuthForms();
    initLogin();
    initRegister();
}

// Appeler la fonction principale lors du chargement du DOM
document.addEventListener("DOMContentLoaded", main);
