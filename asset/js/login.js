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
        ajaxRequest(
                    "GET",
                    `../php/request.php/user`,
                    (response) => {
                        if (response) {
                            console.log("Recup User :", response[0]['mail']);
                            window.location.href = `myTeams.html?mail=${response[0]['mail']}`; // Redirige vers l'URL
                        } else {
                            console.error("Erreur lors de l'envoi de login :", response?.message || "Aucune réponse.");
                        }
                    },
                    `resource=user&action=getUserInfo&mail=${encodeURIComponent(LoginUser)}&password=${encodeURIComponent(LoginPassword)}`
                );
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


