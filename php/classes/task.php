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
    public function dbCreateTask($name, $description, $deadline, $start_date, $significance, $status, $id_team) {
        $query = 'INSERT INTO task (name, description, deadline, start_date, significance, status, id_team)
                  VALUES (:name, :description, :deadline, :start_date, :significance, :status, :id_team)';
        $params = [
            'name' => $name,
            'description' => $description,
            'deadline' => $deadline,
            'start_date' => $start_date,
            'significance' => $significance,
            'status' => $status,
            'id_team' => $id_team
        ];
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
     * @param  mixed $id_team Id de l'équipe
     * @return Array Liste des tâches de l'équipe
     */
    public function dbGetTasksByTeamId($teamId){

        $query = 'SELECT task.id, task.name, task.description, task.deadline, task.start_date, task.significance, task.status 
                  FROM task
                  WHERE task.id_team = :teamId';

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
    public function dbDeleteTask($id) {
        $query = 'DELETE FROM task WHERE id = :id';
        $params = array(
            'id' => $id
        );
        return $this->fetchRequest($query, $params);
    }
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);