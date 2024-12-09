<?php

require_once('database.php');

class Subtask extends Database{
    /**
     * Méthode pour créer une sous-tache dans la base de données
     *
     * @param  mixed $name Intitulé de la sous-tache
     * @param  mixed $status Etat de la sous-tache
     * @param  mixed $id_task Id de la tache dont fait partie la sous-tache
     * @return void Résultat de la requête
     */
    public function dbCreateSubtask($name, $status, $id_task){
        $query = 'INSERT INTO subtask (name, status, id_task) VALUES (:name, :status, :id_task)';
        $params = array(
            'name' => $name,
            'status' => $status,
            'id_task' => $id_task
        );
        return $this->fetchRequest($query, $params);
    }

    /**
     * Méthode pour mettre à jour une sous-tache dans la base de données
     *
     * @param  mixed $status Etat de la sous-tache
     * @param  mixed $id Id de la sous-tache
     * @return void Résultat de la requête
     */
    public function dbUpdateSubtask($status, $id){
        $query = 'UPDATE subtask SET status = :status WHERE id = :id';
        $params = array(
            'status' => $status,
            'id' => $id
        );
        return $this->fetchRequest($query, $params);
    }

    /**
     * Méthode pour récupérer les informations d'une sous-tache dans la base de données
     *
     * @param  mixed $id Id de la sous-tache
     * @return Array Array contenant les informations d'une sous-tache
     */
    public function dbInfoSubtask($id){
        $query = 'SELECT * FROM subtask WHERE id = :id';
        $params = array(
            'id' => $id
        );
        return $this->fetchAllRequest($query, $params);
    }        

    /**
     * Méthode pour récupérer les informations d'une sous-tache a partir de l'id de la tache dont elle fait partie dans la base de données
     *
     * @param  mixed $id Id de la tache
     * @return Array Array contenant les informations d'une sous-tache
     */
    public function dbInfoSubtaskFromTask($idTask){
        $query = 'SELECT * FROM subtask WHERE id_task = :idTask';
        $params = array(
            'idTask' => $idTask
        );
        return $this->fetchAllRequest($query, $params);
    } 
}