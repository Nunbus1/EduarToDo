<?php

require_once('database.php');

class Task extends Database {

    /**
     * Fonction pour créer une tâche dans la base de données
     *
     * @param string $name Nom de la tâche
     * @param string $description Description de la tâche
     * @param string $deadline Date limite
     * @param string $start_date Date de début
     * @param string $significance Importance
     * @param string $status Statut de la tâche
     * @param int $id_team ID de l'équipe associée
     * @return int|false L'ID de la tâche créée ou false en cas d'erreur
     */
    public function dbCreateTask($name, $description, $deadline, $start_date, $significance, $status, $id_team) {
        $query = 'INSERT INTO task (name, description, deadline, start_date, significance, status, id_team)
                VALUES (:name, :description, :deadline, :start_date, :significance, :status, :id_team)';
        $params = array(
            'name' => $name,
            'description' => $description,
            'deadline' => $deadline,
            'start_date' => $start_date,
            'significance' => $significance,
            'status' => $status,
            'id_team' => $id_team,
        );

        //file_put_contents('php_debug.log', "Requête SQL : $query\nParamètres : " . print_r($params, true), FILE_APPEND);

        $result = $this->fetchRequest($query, $params);
        //file_put_contents('php_debug.log', "Résultat de la requête : " . print_r($result, true), FILE_APPEND);

        return $result;
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
    public function dbUpdateTask($id, $name, $description, $deadline, $start_date, $significance, $status) {
        $query = 'UPDATE task
                  SET name = :name, 
                      description = :description, 
                      deadline = :deadline, 
                      start_date = :start_date, 
                      significance = :significance, 
                      status = :status
                  WHERE id = :id';
        $params = [
            'id' => $id,
            'name' => $name,
            'description' => $description,
            'deadline' => $deadline,
            'start_date' => $start_date,
            'significance' => $significance,
            'status' => $status,
        ];
    
        return $this->fetchRequest($query, $params);
    }

    /**
     * Méthode pour récupérer les informations d'une tâche spécifique
     *
     * @param  mixed $id Id de la tâche
     * @return Array Array contenant les informations d'une tâche
     */
    public function dbInfoTask($taskId) {
        $query = 'SELECT task.id, task.name AS task_name, task.description AS task_description, task.deadline, task.start_date, task.significance, task.status, team.teamName AS team_name, team.description AS team_description FROM task 
                    JOIN team ON team.id = task.id_team
                    WHERE task.id = :taskId';
        $params = ['taskId' => $taskId];
        return $this->fetchRequest($query, $params);
    }

    /**
     * Méthode pour récupérer toutes les tâches d'une équipe
     *
     * @param  mixed $id_team Id de l'équipe
     * @return Array Liste des tâches de l'équipe
     */
    public function dbGetTasksByTeamId($teamId){

        $query = 'SELECT task.id, task.name, task.description, task.deadline, task.start_date, task.significance, task.status, 
                  COUNT(CASE WHEN subtask.id_task = task.id THEN 1 END) AS nb_subtask, COUNT(CASE WHEN subtask.status = 1 THEN 1 END) AS nb_subtask_finish  
                  FROM task
                  LEFT JOIN subtask ON subtask.id_task = task.id
                  WHERE task.id_team = :teamId
                  GROUP BY task.id';

        $params = array(
            'teamId' => $teamId
        );
    
        return $this->fetchRequest($query, $params);
    }


    /**
     * Méthode pour supprimer une tâche dans la base de données
     *
     * @param  mixed $id Id de la tâche
     * @return void Résultat de la requête
     */
    public function dbDeleteTask($taskId) {
        $query = 'DELETE FROM task WHERE id = :id';
        $params = array(
            'id' => $taskId
        );
        $result = $this->fetchRequest($query, $params);
    
        // Vérifiez que la suppression a effectivement modifié la base
        return $result !== false && $result > 0;
    }

    public function dbGetAllTasks($mail) {
        
        $query = "SELECT task.id, task.name, task.description, task.start_date, task.deadline, task.status, task.significance, task.id_team, team.teamName FROM task
                    JOIN team ON team.id = task.id_team
                    JOIN part_of ON part_of.mail = 'monmail@orange.fr'
                    WHERE part_of.id = team.id"; // remplacer l'adresse pas :mail
        // $params = array(
        //     'mail' => $mail
        // );
        //file_put_contents('php_debug.log', "$query\n", FILE_APPEND);
        return $this->fetchAllRequest($query); // fetchAllRequest exécute et retourne les résultats.
    }
}