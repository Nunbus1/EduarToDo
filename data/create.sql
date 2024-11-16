-- créer une ligne dans chaque table de la base
INSERT INTO user VALUES ('aubin@gmail.com', 'Aubin', 'Rochefort', 'chemin/vers/photo');
INSERT INTO team VALUES ('Team', 'Super team', 'chemin/vers/photo');
INSERT INTO task VALUES ('Courses', 'Faire les courses', '2024/11/30', '2024/11/23', 'High', 'in queue', '1');
INSERT INTO subtask VALUES ('lait', 0, 1);
INSERT INTO part_of VALUES ('aubin@gmail.com');