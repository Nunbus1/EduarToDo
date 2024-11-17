<?php

require_once('database.php');

class Task extends Database{
    /**
     * Méthode pour créer une tache dans la base de données
     *
     * @param  mixed $name Intitulé de la tache
     * @param  mixed $description Description de la tache
     * @param  mixed $deadline Date limite pour effectuer la tache
     * @param  mixed $start_date Date à laquelle la tache doit être commencée
     * @param  mixed $significance Importance de la tache
     * @param  mixed $status Etat d'avancement de la tache
     * @param  mixed $id_team Id de la team dans laquelle la tache a été créée
     * @return void Résultat de la requête
     */
    public function dbCreateTask($name, $description, $deadline, $start_date, $significance, $status, $id_team){
        $query = 'INSERT INTO task (id, name, description, deadline, start_date, significance, status, id_team)
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
        return $this->fetchRequest($query, $params);
    }

    /**
     * Méthode pour mettre à jour une tache dans la base de données
     *
     * @param  mixed $name Intitulé de la tache
     * @param  mixed $description Description de la tache
     * @param  mixed $deadline Date limite pour effectuer la tache
     * @param  mixed $start_date Date à laquelle la tache doit être commencée
     * @param  mixed $significance Importance de la tache
     * @param  mixed $status Etat d'avancement de la tache
     * @param  mixed $id Id de la tache
     * @return void Résultat de la requête
     */
    public function dbUpdateTask($name, $description, $deadline, $start_date, $significance, $status, $id){
        $query = 'UPDATE task SET name = :name, description = :description, deadline = :deadline, start_date = :start_date WHERE id = :id';
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
     * Méthode pour récupérer les informations d'une tache dans la base de données
     *
     * @param  mixed $id Id de la tache
     * @return Array Array contenant les informations d'une tache
     */
    public function dbInfoTask($id){
        $query = 'SELECT * FROM task WHERE id = :id';
        $params = array(
            'id' => $id
        );
        return $this->fetchRequest($query, $params);
    }        
}

