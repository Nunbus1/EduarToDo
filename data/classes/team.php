<?php

    class Team{
        private $id;
        private $name;
        private $description;
        private $picture;

        public function __construct($name, $description, $picture){
            $this->name = $name;
            $this->description = $description;
            $this->picture = $pîcture;
        }

        public function getName(){
            return $this->name;
        }

        public function getDescription(){
            return $this->description;
        }

        public function getPicture(){
            return $this->picture;
        }

        public function __toString(){
            return $this->id . ' ' . $this->name . ' ' . $this->description . ' ' . $this->picture;
        }
    }