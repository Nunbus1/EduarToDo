#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------


#------------------------------------------------------------
# Table: user
#------------------------------------------------------------

CREATE TABLE user(
        mail     Varchar (50) NOT NULL ,
        first    Varchar (50) NOT NULL ,
        last     Varchar (50) NOT NULL ,
        password Varchar (50) NOT NULL ,
        picture  Varchar (500)
	,CONSTRAINT user_PK PRIMARY KEY (mail)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: team
#------------------------------------------------------------

CREATE TABLE team(
        id          Int  Auto_increment  NOT NULL ,
        name        Varchar (50) NOT NULL ,
        description Varchar (500) ,
        picture     Varchar (500)
	,CONSTRAINT team_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: task
#------------------------------------------------------------

CREATE TABLE task(
        id           Int  Auto_increment  NOT NULL ,
        name         Varchar (50) NOT NULL ,
        description  Varchar (500) ,
        deadline     Date NOT NULL ,
        start_date   Date NOT NULL ,
        significance Varchar (20) NOT NULL ,
        status       Varchar (5) NOT NULL ,
        id_team      Int NOT NULL
	,CONSTRAINT task_PK PRIMARY KEY (id)

	,CONSTRAINT task_team_FK FOREIGN KEY (id_team) REFERENCES team(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: subtask
#------------------------------------------------------------

CREATE TABLE subtask(
        id      Int  Auto_increment  NOT NULL ,
        name    Varchar (50) NOT NULL ,
        status  Bool NOT NULL ,
        id_task Int NOT NULL
	,CONSTRAINT subtask_PK PRIMARY KEY (id)

	,CONSTRAINT subtask_task_FK FOREIGN KEY (id_task) REFERENCES task(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: part_of
#------------------------------------------------------------

CREATE TABLE part_of(
        id   Int NOT NULL ,
        mail Varchar (50) NOT NULL
	,CONSTRAINT part_of_PK PRIMARY KEY (id,mail)

	,CONSTRAINT part_of_team_FK FOREIGN KEY (id) REFERENCES team(id)
	,CONSTRAINT part_of_user0_FK FOREIGN KEY (mail) REFERENCES user(mail)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: assigned_to
#------------------------------------------------------------

CREATE TABLE assigned_to(
        id   Int NOT NULL ,
        mail Varchar (50) NOT NULL
	,CONSTRAINT assigned_to_PK PRIMARY KEY (id,mail)

	,CONSTRAINT assigned_to_task_FK FOREIGN KEY (id) REFERENCES task(id)
	,CONSTRAINT assigned_to_user0_FK FOREIGN KEY (mail) REFERENCES user(mail)
)ENGINE=InnoDB;

