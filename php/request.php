<?php

require_once('classes/assigned_to.php');
require_once('classes/database.php');
require_once('classes/part_of.php');
require_once('classes/subtask.php');
require_once('classes/task.php');
require_once('classes/team.php');
require_once('classes/user.php');
// require_once('inc/constants.php');
require_once('inc/utilities.php');
require_once('inc/data_encode.php');

$requestRessource = $_GET['resource'] ?? null; // Utilise ?resource=task
$action = $_GET['action'] ?? null; 
$requestMethod = $_SERVER['REQUEST_METHOD'];
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
    $db = new Task(); // Création de l'objet Task qui contient les méthodes pour gérer les tâches

    switch ($requestMethod) {
        case 'GET':
            if (!isset($_GET['action'])) {
                sendError(400, 'Action non spécifiée.');
                break;
            }

            switch ($_GET['action']) {
                case 'getTasks':
                    // Récupération des tâches d'une équipe via l'ID de la team
                    if (!isset($_GET['id'])) {
                        sendError(400, 'Aucun ID de team fourni.');
                        break;
                    }

                    $teamId = intval($_GET['id']); // Sécurisation de l'entrée
                    $tasks = $db->dbGetTasksByTeamId($teamId);

                    if ($tasks) {
                        sendJsonData(['success' => true, 'tasks' => $tasks], 200);
                    } else {
                        sendJsonData(['success' => false, 'message' => 'Aucune tâche trouvée pour cette équipe.'], 404);
                    }
                    break;

                case 'getTaskInfo':
                    // Récupération des informations d'une tâche spécifique via son ID
                    if (!isset($_GET['id'])) {
                        sendError(400, 'Aucun ID de tâche fourni.');
                        break;
                    }

                    $taskId = intval($_GET['id']);
                    $taskInfo = $db->dbInfoTask($taskId);

                    if ($taskInfo) {
                        sendJsonData(['success' => true, 'task' => $taskInfo], 200);
                    } else {
                        sendJsonData(['success' => false, 'message' => 'Tâche non trouvée.'], 404);
                    }
                    break;

                default:
                    sendError(400, 'Action non reconnue.');
                    break;
            }
            break;

            case 'POST':
                // Vérification des données envoyées
                if (!isset($_POST['action']) || $_POST['action'] !== 'addTask') {
                    sendJsonData(['success' => false, 'message' => 'Action non spécifiée ou incorrecte.'], 400);
                    break;
                }
            
                // Vérification des données nécessaires pour créer une tâche
                if (!checkInput(isset($_POST['name']) && isset($_POST['description']) && isset($_POST['deadline']) &&
                    isset($_POST['start_date']) && isset($_POST['significance']) && isset($_POST['status']) && isset($_POST['id_team']), 400)) {
                    break;
                }
            
                // Extraction des données envoyées
                $name = $_POST['name'];
                $description = $_POST['description'];
                $deadline = $_POST['deadline'];
                $start_date = $_POST['start_date'];
                $significance = $_POST['significance'];
                $status = $_POST['status'];
                $id_team = intval($_POST['id_team']);
            
                // Vérification si une tâche similaire n'existe pas déjà (optionnel, selon vos besoins)
                if (!$db->dbCheckTaskExists($name, $id_team)) {
                    // Création de la tâche
                    $id_task = $db->dbCreateTask($name, $description, $deadline, $start_date, $significance, $status, $id_team);
            
                    if ($id_task) {
                        // Retourne le succès avec l'ID de la tâche
                        sendJsonData(['success' => true, 'message' => 'Tâche créée avec succès.', 'id' => $id_task], 201);
                    } else {
                        // Retourne une erreur si la création a échoué
                        sendJsonData(['success' => false, 'message' => 'Erreur lors de la création de la tâche.'], 500);
                    }
                } else {
                    // Tâche existante (optionnel)
                    sendJsonData(['success' => false, 'message' => 'Une tâche avec ce nom existe déjà dans cette équipe.'], 409);
                }
                break;

        case 'PUT':
            // Modification d'une tâche existante
            parse_str(file_get_contents('php://input'), $_PUT);
            if (!isset($_PUT['name']) || !isset($_PUT['description']) || !isset($_PUT['deadline']) ||
                !isset($_PUT['start_date']) || !isset($_PUT['significance']) || !isset($_PUT['status']) || !isset($_PUT['id'])) {
                sendError(400, 'Données incomplètes pour modifier une tâche.');
                break;
            }

            $isUpdated = $db->dbUpdateTask(
                $_PUT['name'],
                $_PUT['description'],
                $_PUT['deadline'],
                $_PUT['start_date'],
                $_PUT['significance'],
                $_PUT['status'],
                intval($_PUT['id'])
            );

            if ($isUpdated) {
                sendJsonData(['success' => true, 'message' => 'Tâche mise à jour avec succès.'], 200);
            } else {
                sendError(500, 'Erreur lors de la mise à jour de la tâche.');
            }
            break;

        case 'DELETE':
            // Suppression d'une tâche
            parse_str(file_get_contents('php://input'), $_DELETE);
            if (!isset($_DELETE['id'])) {
                sendError(400, 'ID de tâche non fourni.');
                break;
            }

            $isDeleted = $db->dbDeleteTask(intval($_DELETE['id']));

            if ($isDeleted) {
                sendJsonData(['success' => true, 'message' => 'Tâche supprimée avec succès.'], 200);
            } else {
                sendError(500, 'Erreur lors de la suppression de la tâche.');
            }
            break;

        default:
            sendError(501, 'Méthode non implémentée.');
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

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
