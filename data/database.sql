-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3307
-- Généré le : mar. 10 déc. 2024 à 17:32
-- Version du serveur : 11.3.2-MariaDB
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `eduartodo`
--

-- --------------------------------------------------------

--
-- Structure de la table `assigned_to`
--

DROP TABLE IF EXISTS `assigned_to`;
CREATE TABLE IF NOT EXISTS `assigned_to` (
  `id` int(11) NOT NULL,
  `mail` varchar(50) NOT NULL,
  PRIMARY KEY (`id`,`mail`),
  KEY `assigned_to_user0_FK` (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `part_of`
--

DROP TABLE IF EXISTS `part_of`;
CREATE TABLE IF NOT EXISTS `part_of` (
  `id` int(11) NOT NULL,
  `mail` varchar(50) NOT NULL,
  PRIMARY KEY (`id`,`mail`),
  KEY `part_of_user0_FK` (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `subtask`
--

DROP TABLE IF EXISTS `subtask`;
CREATE TABLE IF NOT EXISTS `subtask` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `id_task` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subtask_task_FK` (`id_task`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `task`
--

DROP TABLE IF EXISTS `task`;
CREATE TABLE IF NOT EXISTS `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `deadline` date NOT NULL,
  `start_date` date NOT NULL,
  `significance` varchar(20) NOT NULL,
  `status` varchar(50) NOT NULL,
  `id_team` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `task_team_FK` (`id_team`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `team`
--

DROP TABLE IF EXISTS `team`;
CREATE TABLE IF NOT EXISTS `team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teamName` varchar(50) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `picture` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `mail` varchar(50) NOT NULL,
  `first` varchar(50) NOT NULL,
  `last` varchar(50) NOT NULL,
  `password` varchar(256) NOT NULL,
  `picture` varchar(500) DEFAULT NULL,
  `token` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `assigned_to`
--
ALTER TABLE `assigned_to`
  ADD CONSTRAINT `assigned_to_task_FK` FOREIGN KEY (`id`) REFERENCES `task` (`id`),
  ADD CONSTRAINT `assigned_to_user0_FK` FOREIGN KEY (`mail`) REFERENCES `user` (`mail`);

--
-- Contraintes pour la table `part_of`
--
ALTER TABLE `part_of`
  ADD CONSTRAINT `part_of_team_FK` FOREIGN KEY (`id`) REFERENCES `team` (`id`),
  ADD CONSTRAINT `part_of_user0_FK` FOREIGN KEY (`mail`) REFERENCES `user` (`mail`);

--
-- Contraintes pour la table `subtask`
--
ALTER TABLE `subtask`
  ADD CONSTRAINT `subtask_task_FK` FOREIGN KEY (`id_task`) REFERENCES `task` (`id`);

--
-- Contraintes pour la table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_team_FK` FOREIGN KEY (`id_team`) REFERENCES `team` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
