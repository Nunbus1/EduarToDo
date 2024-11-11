<?php

    class User{
        private $mail;
        private $first;
        private $last;
        private $password;
        private $picture;

        public function __construct($mail, $first, $last, $password, $picture){
            $this->mail = $mail;
            $this->first = $first;
            $this->last = $last;
            $this->password = $password;
            $this->picture = $picture;
        }

        public function getMail(){
            return $this->mail;
        }

        public function getFirst(){
            return $this->first;
        }

        public function getLast(){
            return $this->last;
        }

        public function getPassword(){
            return $this->password;
        }

        public function getPicture(){
            return $this->picture;
        }

        public function __toString(){
            return $this->mail . ' ' . $this->first . ' ' . $this->last . ' ' . $this->password . ' ' . $this->picture;
        }

    }
