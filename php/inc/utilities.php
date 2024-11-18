<?php

/**
 * Fonction pour vérifier si les données existent
 *
 * @param  mixed $data Données à vérifier
 * @param  mixed $success_code Code de succès
 * @param  mixed $error_code Code d'erreur
 * @return void
 */
function checkData($data, $success_code, $error_code)
{
  if ($data != false) {
    sendJsonData($data, $success_code);
  } else {
    sendError($error_code);
  }
}

/**
 * Fonction pour vérifier si une variable est null
 *
 * @param  mixed $variable Variable à vérifier
 * @param  mixed $error_code Code d'erreur
 * @return Bool true si la variable n'est pas null, false sinon
 */
function checkVariable($variable, $error_code)
{
  if ($variable == null) {
    sendError($error_code);
    return false;
  }
  return true;
}

/**
 * Fonction pour vérifier les inputs
 *
 * @param  mixed $input Input à vérifier
 * @param  mixed $error_code Code d'erreur
 * @return Bool true si l'input est valide, false sinon
 */
function checkInput($input, $error_code)
{
  if ($input == false) {
    sendError($error_code);
    return false;
  }
  return true;
}

/**
 * Function pour récupérer l'id de la requête
 *
 * @param  mixed $request Requête reçu
 * @return String id de la requête
 */
function getId($request)
{
  $id = array_shift($request);
  if ($id == '') {
    $id = null;
  }
  return $id;
}
