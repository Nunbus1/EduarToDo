<?php

    class SubTask{
        private $id; 
        private $name;
        private $status;
        private $idTask;

        public function __construct($name, $status, $idTask){
            $this->name = $name;
            $this->status = $status;
            $this->idTask = $idTask;
        }

        public function getName(){
            return $this->name;
        }

        public function getStatus(){
            return $this->status;
        }

        public function getIdTask(){
            return $this->idTask;
        }

        public function __toString(){
            return $this->id . ' ' . $this->name . ' ' . $this->status . ' ' . $this->idTask;
        }
    }