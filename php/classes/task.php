<?php

require_once('database.php');

class Task extends Database {

    /**
     * Méthode pour créer une tâche dans la base de données
     *
     * @param  mixed $name Intitulé de la tâche
     * @param  mixed $description Description de la tâche
     * @param  mixed $deadline Date limite pour effectuer la tâche
     * @param  mixed $start_date Date à laquelle la tâche doit être commencée
     * @param  mixed $significance Importance de la tâche
     * @param  mixed $status État d'avancement de la tâche
     * @param  mixed $id_team Id de la team dans laquelle la tâche a été créée
     * @return void Résultat de la requête
     */
    public function dbCreateTask($name, $description, $deadline, $start_date, $significance, $status, $id_team){
        $query = 'INSERT INTO task (name, description, deadline, start_date, significance, status, id_team)
                  VALUES (:name, :description, :deadline, :start_date, :significance, :status, :id_team)';
        $params = array(
            'name' => $name,
            'description' => $description,
            'deadline' => $deadline,
            'start_date' => $start_date,
            'significance' => $significance,
            'status' => $status,
            'id_team' => $id_team
        );
    
        // Ajouter un log pour voir la requête et les paramètres
        //file_put_contents('log.txt', "Requête SQL : $query\nParamètres : " . json_encode($params) . "\n", FILE_APPEND);
    
        return $this->fetchRequest($query, $params);
    }

    /**
     * Méthode pour mettre à jour une tâche dans la base de données
     *
     * @param  mixed $name Intitulé de la tâche
     * @param  mixed $description Description de la tâche
     * @param  mixed $deadline Date limite pour effectuer la tâche
     * @param  mixed $start_date Date à laquelle la tâche doit être commencée
     * @param  mixed $significance Importance de la tâche
     * @param  mixed $status État d'avancement de la tâche
     * @param  mixed $id Id de la tâche
     * @return void Résultat de la requête
     */
    public function dbUpdateTask($name, $description, $deadline, $start_date, $significance, $status, $id) {
        $query = 'UPDATE task SET name = :name, description = :description, deadline = :deadline, start_date = :start_date, significance = :significance, status = :status WHERE id = :id';
        $params = array(
            'name' => $name,
            'description' => $description,
            'deadline' => $deadline,
            'start_date' => $start_date,
            'significance' => $significance,
            'status' => $status,
            'id' => $id
        );
        return $this->fetchRequest($query, $params);
    }

    /**
     * Méthode pour récupérer les informations d'une tâche spécifique
     *
     * @param  mixed $id Id de la tâche
     * @return Array Array contenant les informations d'une tâche
     */
    public function dbInfoTask($id) {
        $query = 'SELECT task.name, task.description, task.deadline, task.start_date, task.significance, task.status, team.name AS team_name 
                  FROM task
                  JOIN team ON team.id = task.id_team 
                  WHERE task.id = :id';
        $params = array(
            'id' => $id
        );
        return $this->fetchRequest($query, $params);
    }

    /**
     * Méthode pour récupérer toutes les tâches d'une équipe
     *
     * @param  mixed $teamName Nom de l'équipe
     * @return Array Liste des tâches de l'équipe
     */
    public function dbGetTasksByTeam($teamName){
        //$teamName = trim($teamName); // Supprime les espaces inutiles
        if (!is_string($teamName)) {
            throw new InvalidArgumentException("Le nom de l'équipe doit être une chaîne de caractères.");
        }
        $query = 'SELECT task.id, task.name, task.description, task.deadline, task.start_date, task.significance, task.status 
                  FROM task
                  JOIN team ON team.id = task.id_team
                  WHERE team.name = :teamName';
        $params = array(
            'teamName' => $teamName
        );
        return $this->fetchRequest($query, $params);
    }
    

    /**
     * Méthode pour supprimer une tâche dans la base de données
     *
     * @param  mixed $id Id de la tâche
     * @return void Résultat de la requête
     */
    public function dbDeleteTask($id) {
        $query = 'DELETE FROM task WHERE id = :id';
        $params = array(
            'id' => $id
        );
        return $this->fetchRequest($query, $params);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getTasks') {
    $task = new Task();
    $teamName = $_GET['team'] ?? null;

    if ($teamName) {
        $tasks = $task->dbGetTasksByTeam($teamName);
        if ($tasks) {
            echo json_encode(['success' => true, 'tasks' => $tasks]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Aucune tâche trouvée pour cette équipe.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Aucun nom d\'équipe fourni.']);
    }
    exit; // Ajoutez `exit` pour arrêter tout autre contenu après cette réponse
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'addTask') {
    $taskData = json_decode(file_get_contents('php://input'), true)['task'] ?? null;

    $rawInput = file_get_contents('php://input'); // Récupère les données brutes
    file_put_contents('php://output', "Données reçues brutes : " . $rawInput . "\n", FILE_APPEND);
 

    if ($taskData) {
        $result = $task->dbCreateTask(
            $taskData['name'],
            $taskData['description'],
            $taskData['deadline'],
            $taskData['start_date'],
            $taskData['significance'],
            $taskData['status'],
            $taskData['id_team']
        );
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Tâche ajoutée avec succès.',
                'task' => $taskData,
                'rawInput' => $rawInput // Inclut les données reçues
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Erreur lors de l\'ajout de la tâche.',
                'rawInput' => $rawInput // Inclut les données reçues pour débogage
            ]);
        }
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Données de tâche non fournies.',
                    'rawInput' => $rawInput
                ]);
            }
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Erreur JSON. Données brutes : ' . $rawInput
            ]);
    exit;
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log temporaire pour voir les données reçues et les erreurs
file_put_contents('php://output', "Données reçues : " . file_get_contents('php://input') . "\n");
