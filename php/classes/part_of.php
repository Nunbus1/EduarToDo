<?php

require_once('database.php');

class Part_of extends Database{
    /**
     * Méthode pour créer une association entre un utilisateur et une team dans la base de données
     *
     * @param  mixed $id Id de la team dont l'utilisateur va faire partie à associer
     * @param  mixed $mail Adresse email de l'utilisateur 
     * @return void Résultat de la requête
     */
    public function dbCreateAssociation($id, $mail){
        $query = 'INSERT INTO part_of (id, mail) VALUES (:id, :mail)';
        $params = array(
            'id' => $id,
            'mail' => $mail,
        );
        return $this->fetchRequest($query, $params);
    }

    /**
     * Méthode pour savoir quels utilisateurs font partie d'une team dans la base de données
     *
     * @param  mixed $id Id de la team
     * @return Array Array contenant les informations d'un utilisateur
     */
    public function dbInfoPartTeam($id){
        $query = 'SELECT user.first, user.last FROM user
        JOIN part_of ON part_of.mail = user.mail
        JOIN task ON part_of.id = task.id
        WHERE task.id = :id';
        $params = array(
            'id' => $id
        );
        return $this->fetchRequest($query, $params);
    }

    /**
     * Méthode pour savoir de quelles teams un utilisateur fait partie
     *
     * @param  mixed $mail Adresse email de l'utilisateur
     * @return Array Array contenant les informations d'une team
     */
    public function dbInfoMemberOf($mail){
        $query = 'SELECT team.id, team.teamName FROM team
        JOIN part_of ON part_of.id = team.id 
        JOIN user ON part_of.mail = user.mail 
        WHERE user.mail = :mail';
        $params = array(
            'mail' => $mail
        );
        return $this->fetchRequest($query, $params);
    }
}