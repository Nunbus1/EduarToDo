<?php

require_once('database.php');

class User extends Database{
    /**
     * Méthode pour vérifier si l'utilisateur existe dans la base de données
     *
     * @param  mixed $mail Adresse email de l'utilisateur
     * @param  mixed $password Mot de passe de l'utilisateur
     * @return String Adresse mail de l'utilisateur
     */
    public function dbCheckUser($mail, $password){
        $password = hash('sha256', $password);
        $query = 'SELECT * FROM user WHERE email = :email AND password = :password';
        $params = array(
            'email' => $mail,
            'password' => $password
        );
        return $this->fetchRequest($query, $params)['mail'];
    }

    /**
     * Méthode pour créer un utilisateur dans la base de données
     *
     * @param  mixed $mail Adresse email de l'utilisateur
     * @param  mixed $first Prénom de l'utilisateur
     * @param  mixed $last Nom de l'utilisateur
     * @param  mixed $password Mot de passe de l'utilisateur
     * @return void Résultat de la requête
     */
    public function dbCreateUser($mail, $first, $last, $password){
        $password = hash('sha256', $password);
        $query = 'INSERT INTO user (mail, first, last, password) VALUES (:mail, :first, :last, :password)';
        $params = array(
            'mail' => $mail,
            'first' => $first,
            'last' => $last,
            'password' => $password,
        );
        return $this->fetchRequest($query, $params);
    }

    /**
     * Méthode pour mettre à jour un utilisateur dans la base de données
     *
     * @param  mixed $mail Adresse email de l'utilisateur
     * @param  mixed $first Prénom de l'utilisateur
     * @param  mixed $last Nom de l'utilisateur
     * @param  mixed $password Mot de passe de l'utilisateur
     * @return void Résultat de la requête
     */
    public function dbUpdateUser($mail, $first, $last, $password){
        $password = hash('sha256', $_password);
        $query = 'UPDATE user SET first = :first, last = :last, password = :password WHERE mail = :mail';
        $params = array(
            'mail' => $mail,
            'first' => $first,
            'last' => $last,
            'password' => $password
        );
        return $this->fetchRequest($query, $params);
    }

    /**
     * Méthode pour récupérer les informations d'un utilisateur dans la base de données
     *
     * @param  mixed $mail Adresse email de l'utilisateur
     * @return Array Array contenant les informations d'un utilisateur 
     */
    public function dbInfoUser($mail){
        $query = 'SELECT * FROM user WHERE mail = :mail';
        $params = array(
            'mail' => $mail
        );
        return $this->fetchRequest($query, $params);
    }
}
