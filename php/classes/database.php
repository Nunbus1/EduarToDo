<?php

require_once('../inc/constants.php'); // Contient les constantes de connexion à la base de données
require_once('../inc/data_encode.php'); // Contient les Méthodes pour envoyer des données au format JSON

/**
 * Classe pour gérer les requêtes  à la base de données
 */
class Database{
  private PDO $db;

  /**
   * Constructeur qui initialise la connexion à la base de données 
   *
   * @return void
   */
  public function __construct()
  {
    try {
      $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8', DB_USER, DB_PASS);
    } catch (PDOException $e) {
      error_log('Erreur connexion: ' . $e->getMessage());
      sendError(500);
    }
  }

  /**
   * Méthode pour faire une requête à la base de données
   *
   * @param  mixed $query Requête SQL à effectuer
   * @param  mixed $params Paramètres de la requête
   * @return stmt Requête préparée
   */
  function request($query, $params = null)
  {
    if ($params != null) {
      $params = $this->sanitize_params($params);
    }

    try {
      $stmt = $this->db->prepare($query);
      $stmt->execute($params);
      return $stmt;
    } catch (PDOException $e) {
      error_log('Erreur requête SQL: ' . $e->getMessage());
      sendError(400);
    }
  }

  /**
   * Méthode pour faire une requête qui retourne plusieurs données
   *
   * @param  mixed $query Requête SQL à effectuer
   * @param  mixed $params Paramètres de la requête
   * @return Liste Résultat de la requête sous forme de liste d'array
   */
  public function fetchAllRequest($query, $params = null)
  {
    $stmt = $this->request($query, $params);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  /**
   * Méthode pour faire une requête qui retourne une seule donnée
   *
   * @param  mixed $query Requête SQL à effectuer
   * @param  mixed $params Paramètres de la requête
   * @return Array Résultat de la requête sous forme d'array
   */
  public function fetchRequest($query, $params = null)
  {
    $stmt = $this->request($query, $params);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
  }

  /**
   * Méthode pour enlever les caractères spéciaux des paramètres
   *
   * @param  mixed $params Paramètres à nettoyer
   * @return Array Paramètres nettoyés
   */
  function sanitize_params($params)
  {
    foreach ($params as $key => $value) {
      if ($key != 'password') {
        $params[$key] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
      }
    }
    return $params;
  }
}
