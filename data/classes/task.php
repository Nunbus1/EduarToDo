<?php

    class Task{
        private $id;
        private $name;
        private $description;
        private $deadline;
        private $startDate;
        private $significance;
        private $status;
        private $idTeam;

        public function __construct($name, $description, $deadline, $startDate, $significance, $status, $idTeam){
            $this->name = $name;
            $this->description = $description;
            $this->deadline = $deadline;
            $this->startDate = $startDate;
            $this->significance = $significance;
            $this->status = $status;
            $this->idTeam = $idTeam;
        }

        public function getName(){
            return $this->name;
        }

        public function getDescription(){
            return $this->description;
        }

        public function getDeadline(){
            return $this->deadline;
        }

        public function getStartDate(){
            return $this->startDate;
        }

        public function getSignificance(){
            return $this->significance;
        }

        public function getStatus(){
            return $this->status;
        }

        public function getIdTeam(){
            return $this->idTeam;
        }

        public function __toString(){
            return $this->id . ' ' . $this->name . ' ' . $this->description . ' ' . $this->deadline . ' ' . $this->startDate . ' ' . $this->significance . ' ' . $this->status . ' ' . $this->getIdTeam;
        }
    }

