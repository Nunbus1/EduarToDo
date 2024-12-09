<?php

require_once('database.php');

class Team extends Database{
    /**
     * Méthode pour créer une team dans la base de données
     *
     * @param  mixed $name Intitulé de la team
     * @param  mixed $description Description de la team
     * @return String Id de la tache créée
     */
    public function dbCreateTeam($name, $description){
        
        $query = 'INSERT INTO team (teamName, description) VALUES (:name, :description)';
        $params = array(
            'name' => $name,
            'description' => $description
        );
        $this->fetchRequest($query, $params);
        return $this->lastInsertId();
    }

    /**
     * Méthode pour mettre à jour une team dans la base de données
     *
     * @param  mixed $name Nom de la team
     * @param  mixed $description Description de la team
     * @param  mixed $id Id de la team
     * @return void Résultat de la requête
     */
    public function dbUpdateTeam($name, $description, $id){
        $query = 'UPDATE team SET teamName = :name, description = :description WHERE id = :id';
        $params = array(
            'name' => $name,
            'description' => $description,
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
    public function dbInfoTeam($id){
        $query = 'SELECT * FROM team WHERE id = :id';
        $params = array(
            'id' => $id
        );
        return $this->fetchAllRequest($query, $params);
    }        

    public function dbDeleteTeam($id){
        $params = array(
            'id' => $id
        ); 

        $query = 'DELETE FROM subtask WHERE id_task IN (
            SELECT id FROM task WHERE id_team = :id
        )';
        $this->fetchRequest($query, $params);

        $query = 'DELETE FROM part_of WHERE id = :id';
        $this->fetchRequest($query, $params);

        $query = 'DELETE FROM task WHERE id_team = :id';
        $this->fetchRequest($query, $params);

        $query = 'DELETE FROM team WHERE id = :id';
        $this->fetchRequest($query, $params);
    }
}

