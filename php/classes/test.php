<?php

require_once('assigned_to.php');
require_once('database.php');
require_once('part_of.php');
require_once('subtask.php');
require_once('task.php');
require_once('team.php');
require_once('user.php');


function checkTeamInfo($datas){
    $team = new Team();
    $teamInfo = $team->dbInfoTeam($datas['id']);

    // comparaison entre les données présentes dans la BDD et les données attendues
    try{
        assert($teamInfo[0]['id'] == $datas['id'], "L'id ne correspond pas");
        assert($teamInfo[0]['teamName'] === $datas['teamName'], "Le nom ne correspond pas");
        assert($teamInfo[0]['description'] === $datas['description'], "La description ne correspond pas");
        echo("Insertion ou modification de team réussie\n");
    }
    catch (AssertionError $e){
        echo("Erreur : ". $e->getMessage());
    }
    
}

function verifTeam(){
    // création d'une team
    $team = new Team();
    $team->dbCreateTeam('team', 'description');
    $idTeam = $team->lastInsertId();

    // comparaison entre les données insérées et celles de la BDD
    $params = array('id' => $idTeam, 'teamName' => 'team', 'description' => 'description');
    checkTeamInfo($params);

    // modification de la team et comparaison
    $team->dbUpdateTeam('nouveau nom', 'nouvelle description', $idTeam);
    $params = array('id' => $idTeam, 'teamName' => 'nouveau nom', 'description' => 'nouvelle description');
    checkTeam($params);
}


function checkTaskInfo($datas){
    $task = new Task();
    $taskInfo = $task->dbInfoTask($datas['id']);

    // comparaison entre les données présentes dans la BDD et les données attendues
    try{
        assert($teamInfo[0]['id'] == $datas['id'], "L'id ne correspond pas");
        assert($teamInfo[0]['name'] === $datas['name'], "Le nom ne correspond pas");
        assert($teamInfo[0]['description'] === $datas['description'], "La description ne correspond pas");
        assert($teamInfo[0]['deadline'] === $datas['deadline'], "La deadline ne correspond pas");
        assert($teamInfo[0]['start_date'] === $datas['start_date'], "La date de debut ne correspond pas");
        assert($teamInfo[0]['significance'] === $datas['significance'], "L'importance ne correspond pas");
        assert($teamInfo[0]['status'] === $datas['status'], "Le statut ne correspond pas");
        assert($teamInfo[0]['description'] === $datas['description'], "La description ne correspond pas");
        echo("Insertion ou modification de team réussie\n");
    }
    catch (AssertionError $e){
        echo("Erreur : ". $e->getMessage());
    }
    
}

function verifTask(){
    // création d'une team
    $team = new Team();
    $team->dbCreateTeam('team', 'description');
    $idTeam = $team->lastInsertId();

    // comparaison entre les données insérées et celles de la BDD
    $params = array('id' => $idTeam, 'teamName' => 'team', 'description' => 'description');
    checkTeamInfo($params);

    // modification de la team et comparaison
    $team->dbUpdateTeam('nouveau nom', 'nouvelle description', $idTeam);
    $params = array('id' => $idTeam, 'teamName' => 'nouveau nom', 'description' => 'nouvelle description');
    checkTeam($params);
}
verifTeam();