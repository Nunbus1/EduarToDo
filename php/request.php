<?php

require_once('classes/album.php');
require_once('classes/artist.php');
require_once('classes/listened.php');
require_once('classes/playlist.php');
require_once('classes/track.php');
require_once('classes/user.php');
require_once('inc/data_encode.php');
require_once('inc/utilities.php');

$requestMethod = $_SERVER['REQUEST_METHOD'];
$request = substr($_SERVER['PATH_INFO'], 1);
$request = explode('/', $request);
$requestRessource = array_shift($request);

// $login = null;

// Vérification de l'utilisateur
// if ($requestRessource == 'connexion') {
//     $db = new User(); // Création de l'objet User qui contient les fonctions pour gérer les utilisateurs
//     $mail = $_SERVER['PHP_AUTH_USER'];
//     $password = $_SERVER['PHP_AUTH_PW'];

//     // Vérification des données envoyées
//     if (!checkInput(isset($mail) && isset($password), 400)) 
//         return;
    
//     // Vérification que l'utilisateur existe
//     if ($db->dbCheckUser($mail, $password)) {
//         // Création du token
//         $token = base64_encode(openssl_random_pseudo_bytes(32));
//         // Envoi du token
//         header('Content-Type: application/json; charset=utf-8');
//         header('Cache-control: no-store, no-cache, must-revalidate');
//         header('Pragma: no-cache');
//         echo ($token);
//     } 
    
//     else 
//         sendError(401);
  
// } 

// else {
//     $db = new User(); // Création de l'objet User qui contient les fonctions pour gérer les utilisateurs
//     $headers = getallheaders();
//     $token = $headers['Authorization'];

//     if (preg_match('/Bearer (.*)/', $token, $tab)) 
//         $token = $tab[1];
    
//     if ($token != null) {
//         $login = $db->dbVerifyToken($token);

//         // Vérification que l'utilisateur existe
//         if (!$login) 
//             $login = null;
        
//     }
// }

// Gestion des requêtes utilisateur
if ($requestRessource == 'user') {  
    $db = new User(); // Création de l'objet User qui contient les fonctions pour gérer les utilisateurs
    switch ($requestMethod) {
    case 'GET':
        // Vérification qu'on est bien connecté
        // if (!checkVariable($_GET['mail'], 401)) 
        //     break;
        
        // Récupération des données de l'utilisateur
        $data = $db->dbInfoUser($_GET['mail']);
        // Vérification que l'utilisateur existe
        checkData($data, 200, 404);
        break;

    case 'POST':
        // Vérification des données envoyées
        if (!checkInput(isset($_POST['mail']) && isset($_POST['first']) && isset($_POST['last']) && isset($_POST['password']), 400)) 
            break;

        // Si l'utlisateur n'existe pas déjà
        if ($db->dbInfoUser($_POST['mail']) == false) {
            $data = $db->dbCreateUser($_POST['mail'], $_POST['first'], $_POST['last'], $_POST['password']);
            sendJsonData($data, 201);
        } 

        else  // Sinon retourner erreur conflit
        sendError(409);

        break;

    case 'PUT':
        // Vérification que l'utilisateur est bien connecté
        // if (!checkVariable($_PUT['mail'], 401)) 
        //     break;
        
        // Récupération des données envoyées
        parse_str(file_get_contents('php://input'), $_PUT);
        if (!checkInput(isset($_PUT['mail']) && isset($_PUT['first']) && isset($_PUT['last']), 400)) 
            break;
        
        // Modification de l'utilisateur
        $data = $db->dbUpdateUser($login, $_PUT['first'], $_PUT['last'], $_PUT['password']);
        sendJsonData($data, 200);
        break;
    }
}

if ($requestRessource == "teams") {
    $db = new Part_of(); // Création de l'objet Part_of qui contient les méthodes pour gérer les associations entre teams et utilisateurs
    $team = new Team();
    switch ($requestMethod) {
        case 'GET':
            // Vérification qu'on est bien connecté
            // if (!checkVariable($_GET['mail'], 401)) 
            //     break;
            
            // Récupération des noms des teams dont l'utilisateur fait partie
            $data = $db->dbInfoMemberOf($_GET['mail']);
            // Vérification que l'utilisateur fait bien partie d'au moins une team
            checkData($data, 200, 404);
            break;

        case 'POST':
            // Vérification qu'on est bien connecté
            // if (!checkVariable($login, 401)) 
            //     break;
            
            // Création de la nouvelle team
            $team_id = $team->dbCreateTeam($_POST['name'], $_POST['description']);
            $data = $data->dbCreateAssociation($team_id, $_POST['mail']);
            sendJsonData($data, 201);
            break;

        case 'PUT':
            // Vérification qu'on est bien connecté
            // if (!checkVariable($login, 401) || !checkInput(isset($_PUT['name'])) || !checkInput(isset($_PUT['description'])) || !checkInput(isset($_PUT['id']), 400)) 
            //     break;

            // Modification de la team
            $data = $team->dbUpdateTeam($_PUT['name'], $_PUT['description'], $_PUT['id']);
            sendJsonData($data, 201);

        default:
        // Requête non implémentée
            sendError(501);
            break;
    }
}

if ($requestRessource == "subtask") {
    $db = new Subtask(); // Création de l'objet Subtask qui contient les méthodes pour gérer les sous taches
    switch ($requestMethod) {
        case 'POST':
            // Vérification qu'on est bien connecté
            // if (!checkVariable($login, 401)) 
            //     break;

            // Vérification que toutes les infos sont définies
            if (!isset($_POST['name']) || !isset($_POST['status']) || !isset($_POST['id_task']))
                break;
        
            // Création d'une sous-tache
            $data = $db->dbCreateSubtask($_POST['name'], $_POST['description'], $_POST['id_task']);
            sendJsonData($data, 200);  
            break;
        
        case 'PUT':
            // Vérification qu'on est bien connecté
            // if (!checkVariable($login, 401)) 
            //     break;

            // Vérification que les éléments nécessaire sont définis
            if (!isset($_PUT['status']) || !isset($_PUT['id']))
                break;

            $data = $db->dbUpdateSubtask($_PUT['status'], $_PUT['id']);
            sendJsonData($data, 200);
            break;

        default:
            // Requête non implémentée
            sendError(501);
            break;
    }
}

if ($requestRessource == "part_of") {
    $db = new Part_of(); // Création de l'objet Part_of qui contient les méthodes pour gérer les associations entre teams et utilisateurs
    switch ($requestMethod) {
        case 'GET':
            // Vérification qu'on est bien connecté
            // if (!checkVariable($login, 401)) 
            //     break;

            // Vérification que les éléments nécessaire sont définis
            if (!isset($_GET['id']))
                break;

            $data = $db->dbInfoPartTeam($_GET['id']);
            sendJsonData($data, 200);
            break;

        default:
            // Requête non implémentée
            sendError(501);
            break;
        }
    }

if ($requestRessource == "task") {
    $db = new Task(); // Création de l'objet Task qui contient les méthodes pour gérer les taches
    $assigned = new Assigned_to(); // Création de l'objet Assigned_to qui contient les méthodes pour gérer les associations entre taches et utilisateurs
    switch ($requestMethod) {
        case 'GET':
            // Vérification qu'on est bien connecté
            // if (!checkVariable($login, 401)) 
            //     break;

            // Vérification que les éléments nécessaire sont définis
            if (!isset($_GET['id']))
                break;

            $data = $db->dbInfoTask($_GET['id']);
            sendJsonData($data, 200);
            break;

        case 'POST':
            // Vérification qu'on est bien connecté
            // if (!checkVariable($login, 401)) 
            //     break;

            // Vérification que les éléments nécessaire sont définis
            if (!isset($_POST['mail'], $_POST['name']) || !isset($_POST['description']) || !isset($_POST['deadline']) || !isset($_POST['start_date']) || !isset($_POST['significance']) || !isset($_POST['status']) || !isset($_POST['id_team']))
                break;

            // Création d'une nouvelle tache
            $id_task = $db->dbCreateTask($_POST['name'], $_POST['description'], $_POST['deadline'], $_POST['start_date'], $_POST['significance'], $_POST['status'], $_POST['id_team']);
            
            // Assignation de la tache a l'utilisateur qui l'a créée
            $data = $db->dbCreateAssociation($id_task, $_POST['mail']);
            sendJsonData($data, 200);
            break;

        case 'PUT':
            // Vérification qu'on est bien connecté
            // if (!checkVariable($login, 401)) 
            //     break;

            // Vérification que les éléments nécessaire sont définis
            if (!isset($_PUT['name']) || !isset($_PUT['description']) || !isset($_PUT['deadline']) || !isset($_PUT['start_date']) || !isset($_PUT['significance']) || !isset($_PUT['status']) || !isset($_PUT['id']))
                break;

            $data = $db->dbCreateTask($_PUT['name'], $_PUT['description'], $_PUT['deadline'], $_PUT['start_date'], $_PUT['significance'], $_PUT['status'], $_PUT['id']);
            sendJsonData($data, 200); 
            break;

        default:
            // Requête non implémentée
            sendError(501);
            break;
        }
}

if ($requestRessource == "todo") {
    $db = new Assigned_to(); // Création de l'objet Assigned_to qui contient les fonctions pour gérer les associations entre taches et utilisateurs
    switch ($requestMethod) {
        case 'GET':
        // Vérification qu'on est bien connecté
        // if (!checkVariable($login, 401)) 
        //     break;
        
        $data = $db->dbInfoTodo($_GET['mail']);
        sendJsonData($data, 200);        
        break;

        default:
        // Requête non implémentée
        sendError(501);
        break;
    }
}
