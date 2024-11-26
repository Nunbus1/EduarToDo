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

// $requestRessource = $_GET['resource'] ?? null; // Utilise ?resource=task
// $action = $_GET['action'] ?? null; 
// $requestMethod = $_SERVER['REQUEST_METHOD'];
$requestMethod = $_SERVER['REQUEST_METHOD'];
$request = substr($_SERVER['PATH_INFO'], 1);
$request = explode('/', $request);
$requestRessource = array_shift($request);
// $login = null;
//file_put_contents('C:/wamp64/www/EduarToDo/php/php_debug.log', "Méthode reçue : " . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);

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
        case 'GET':
            case 'getSubtaskInfo':
                // Vérification de l'ID de la sous-tâche
                if (!isset($_GET['id'])) {
                    sendError(400, 'Aucun ID de sous-tâche fourni.');
                    break;
                }
            
                $subtaskId = intval($_GET['id']);
                $subtaskInfo = $db->dbInfoSubtask($subtaskId);
            
                if ($subtaskInfo) {
                    sendJsonData(['success' => true, 'subtask' => $subtaskInfo], 200);
                } else {
                    sendJsonData(['success' => false, 'message' => 'Sous-tâche non trouvée.'], 404);
                }
                break;

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
    $sub = new Subtask();
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
                        if (!isset($_GET['id'])) {
                            sendError(400, 'Aucun ID de tâche fourni.');
                            break;
                        }
                        $taskId = intval($_GET['id']);
                        $taskInfo = $db->dbInfoTask($taskId);
                        $subtaskInfo = $sub->dbInfoSubtaskFromTask($taskId);
                        
                        if ($taskInfo) {
                            // Ajoute les sous-tâches associées à la tâche
                            //$subtasks = $db->dbGetSubtasksByTaskId($taskId); // Assurez-vous que cette méthode existe
                            //$taskInfo['subtasks'] = $subtasks;
                    
                            sendJsonData(['success' => true, 'task' => $taskInfo, 'subtasks' => $subtaskInfo], 200);
                        } else {
                            sendJsonData(['success' => false, 'message' => 'Tâche non trouvée.'], 404);
                        }
                        break;

                        case 'getAllTasks':
                            // Log la requête pour debug
                            //file_put_contents('php_debug.log', "Requête reçue : getAllTasks\n", FILE_APPEND);
                        
                            // Récupérer toutes les tâches
                            $tasks = $db->dbGetAllTasks();
                        
                            // Log les résultats ou l'absence de résultats
                            if ($tasks) {
                                //file_put_contents('php_debug.log', "Tâches récupérées : " . print_r($tasks, true) . "\n", FILE_APPEND);
                                sendJsonData(['success' => true, 'tasks' => $tasks], 200);
                            } else {
                                //file_put_contents('php_debug.log', "Aucune tâche trouvée.\n", FILE_APPEND);
                                sendJsonData(['success' => false, 'message' => 'Aucune tâche trouvée.'], 404);
                            }
                            break;

                default:
                    sendError(400, 'Action non reconnue.');
                    break;
            }
            break;

        case 'POST':
            //file_put_contents('php_debug.log', "Données POST reçues : " . print_r($_POST, true) . "\n", FILE_APPEND);
        
            // Vérification des données nécessaires
            if (!isset($_POST['name'], $_POST['description'], $_POST['deadline'], $_POST['start_date'], $_POST['significance'], $_POST['status'], $_POST['id_team'])) {
                //file_put_contents('php_debug.log', "Données POST manquantes\n", FILE_APPEND);
                sendJsonData(['success' => false, 'message' => 'Données de tâche incomplètes.'], 400);
                break;
            }
            
            // Extraction des données
            $name = $_POST['name'];
            $description = $_POST['description'];
            $deadline = $_POST['deadline'];
            $start_date = $_POST['start_date'];
            $significance = $_POST['significance'];
            $status = $_POST['status'];
            $id_team = intval($_POST['id_team']);
            
            //file_put_contents('php_debug.log', "Données extraites : " . print_r(compact('name', 'description', 'deadline', 'start_date', 'significance', 'status', 'id_team'), true) . "\n", FILE_APPEND);
            
            // Création de la tâche
            $data = $db->dbCreateTask($name, $description, $deadline, $start_date, $significance, $status, $id_team);
            
            if ($data) {
                //file_put_contents('php_debug.log', "Tâche créée avec succès\n", FILE_APPEND);
                sendJsonData(['success' => true, 'message' => 'Tâche créée avec succès.', 'id_task' => $data], 201);
            } else {
                //file_put_contents('php_debug.log', "Erreur lors de la création de la tâche\n", FILE_APPEND);
                sendJsonData(['success' => false, 'message' => 'Erreur lors de la création de la tâche.'], 500);
            }
        break;

        case 'PUT':
            // Récupération de l'ID de la tâche depuis l'URL
            $path = $_SERVER['PATH_INFO'] ?? null;
            if ($path) {
                $parts = explode('/', trim($path, '/'));
                $taskId = intval(end($parts)); // Récupère la dernière partie de l'URL comme ID de tâche
            } else {
                $taskId = null;
            }
        
            // Lecture du corps de la requête et décodage JSON
            $rawInput = file_get_contents('php://input');
            //file_put_contents('php_debug.log', "Données brutes reçues : $rawInput\n", FILE_APPEND);
        
            $inputData = json_decode($rawInput, true);
            if (!$inputData) {
                sendError(400, 'Données JSON invalides.');
                break;
            }
        
            //file_put_contents('php_debug.log', "Données décodées : " . print_r($inputData, true) . "\n", FILE_APPEND);
        
            // Vérification des données reçues
            if (!isset(
                $inputData['name'],
                $inputData['description'],
                $inputData['deadline'],
                $inputData['start_date'],
                $inputData['significance'],
                $inputData['status']
            )) {
                sendError(400, 'Données incomplètes pour modifier une tâche.');
                break;
            }
        
            // Mise à jour de la tâche dans la base de données
            $data = $db->dbUpdateTask(
                $taskId, // ID de la tâche
                $inputData['name'],
                $inputData['description'],
                $inputData['deadline'],
                $inputData['start_date'],
                $inputData['significance'],
                $inputData['status']
            );
            
            // Vérification du résultat et retour de la réponse
            // if ($data) {
            sendJsonData(['success' => true, 'message' => 'Tâche mise à jour avec succès.'], 200);
            // } else {
            //     file_put_contents('php_debug.log', "fail ");
            //     sendError(500, 'Erreur lors de la mise à jour de la tâche.');
            // }
            break;

            case 'DELETE':
                // Log pour le débogage
                //file_put_contents('php_debug.log', "Requête DELETE reçue.\n", FILE_APPEND);
            
                // Extraire l'ID de la tâche depuis l'URL
                $path = $_SERVER['PATH_INFO'] ?? null;
                if ($path) {
                    $parts = explode('/', trim($path, '/'));
                    $taskId = intval(end($parts)); // Récupère la dernière partie de l'URL comme ID de tâche
                } else {
                    $taskId = null;
                }
            
                if (!$taskId) {
                    //file_put_contents('php_debug.log', "Erreur : Aucun ID de tâche fourni.\n", FILE_APPEND);
                    sendError(400, 'ID de tâche non fourni.');
                    break;
                }
            
                // Log l'ID de la tâche à supprimer
                //file_put_contents('php_debug.log', "ID de tâche à supprimer : $taskId\n", FILE_APPEND);
            
                // Appeler la méthode pour supprimer la tâche dans la base de données
                $isDeleted = $db->dbDeleteTask($taskId);
            
                if ($isDeleted) {
                    //file_put_contents('php_debug.log', "Tâche supprimée avec succès : $taskId\n", FILE_APPEND);
                    sendJsonData(['success' => true, 'message' => "Tâche supprimée avec succès."], 200);
                } else {
                    //file_put_contents('php_debug.log', "Erreur : Échec de la suppression de la tâche : $taskId\n", FILE_APPEND);
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
