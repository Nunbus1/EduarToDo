<?php

require_once('database.php');

class Assigned_to extends Database{
    /**
     * Méthode pour créer une association entre un utilisateur et une tache dans la base de données
     *
     * @param  mixed $id Id de la tache à associer
     * @param  mixed $mail Adresse email de l'utilisateur à qui associer la tache
     * @return void Résultat de la requête
     */
    public function dbCreateAssociation($id, $mail){
        $query = 'INSERT INTO assigned_to (id, mail) VALUES (:id, :mail)';
        $params = array(
            'id' => $id,
            'mail' => $mail,
        );
        return $this->fetchRequest($query, $params);
    }

    /**
     * Méthode pour savoir quel utilisateur est associé à une tache donnée dans la base de données
     *
     * @param  mixed $id Id de la tache
     * @return Array Array contenant les informations d'un utilisateur
     */
    public function dbInfoAssigned_to($id){
        $query = 'SELECT user.first, user.last FROM user
        JOIN assigned_to ON assigned_to.mail = user.mail
        JOIN task ON assigned_to.id = task.id
        WHERE task.id = :id';
        $params = array(
            'id' => $id
        );
        return $this->fetchAllRequest($query, $params);
    }

    /**
     * Méthode pour savoir quelles taches un utilisateur doit effectuer dans la base de données
     *
     * @param  mixed $mail Adresse email de l'utilisateur
     * @return Array Array contenant les informations d'une tache
     */
    public function dbInfoTodo($mail){
        $query = 'SELECT task.name, task.deadline, task.start_date, task.significance, task.status subtask.name, subtask.status FROM task
        JOIN assigned_to ON assigned_to.id = task.id 
        JOIN user ON assigned_to.mail = user.mail 
        JOIN subtask ON subtask.id_task = task.id
        WHERE user.mail = :mail';
        $params = array(
            'mail' => $mail
        );
        return $this->fetchAllRequest($query, $params);
    }
}