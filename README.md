# OlympicJs

## L'origine du projet
Ce projet émerge d'un cours d'HTML5, où nous avons pour mission de réaliser une application Web sans aucune limite, hormis d'utiliser les techniques vue en cours.

## Le projet
A la suite de notre première séance, nous avons décidé de créer une application où il sera possible de jouer à plusieurs jeux sous forme d'un tournoi.
Les jeux seront des jeux simples que tout le monde connait, tels que le puissance 4 ou le tic tac toe.

## Les objectifs

- Création de comptes utilisateurs
- Connexion avec son compte
- Création de partie
- Rejoindre des parties
- Statistiques Victoire / Nul / Défaite
- Chat 
- Jeux : TicTacToe, Puissance4, bataille royal, etc...

## Technologies utilisées

- NodeJS : Backend
- React : Frontend
- MongoDB : Base de données
- SocketIO : communications temps réel

# Prérequis

## Installation de NodeJS

https://nodejs.org/en/

## Installation de MongoDB

1) mongoDB : Télécharger https://www.mongodb.com/download-center/community : extraire le zip de mongoDB
2) Lancement de la base de données "cd mongoRepertoire/bin/" puis executer "/mongod"
3) Lancement de l'invit de commande mongoDB : "cd mongoRepertoire/bin/" puis "/mongo"

4) mongo Compass (UI pour visualiser la BDD) : Télécharger https://www.mongodb.com/download-center/compass : extraire et lancer MongoDBCompass.exe
5) Connexion BDD avec Compass : localhost:20017

# Lancement du projet

0) Cloner le projet
1) Récupérer les packages : dans /server puis dans /client : npm install
2) Lancer MongoDB : executer 'mongod'
3) Lancer le serveur NodeJS : cd /server : npm start
4) Lancer l'application React : cd /client : npm start
5) Avec un navigateur, aller sur localhost:3000


# Tester
 
- Ouvrir 2 fenêtres de navigateur web en navigation privée pour simuler deux utilisateurs. 
-  Aller sur localhost:3000 puis créer des comptes utilisateurs, par exemple user1 et user2.
- Avec user1 créez une partie.
- Avec user2 rejoignez la partie. 
- Jouez.

# Autres

## Utilisation de source tree
Télécharger et installer SourceTree : https://www.sourcetreeapp.com/
Ensuite il va falloir générer une clef SSH et l'ajouter à GitLab et SourceTree pour pouvoir utiliser SourceTree.
### Génération de la clef
    ssh-keygen -o -t rsa -b 4096 -C "example@example.com"
Avec l'adresse mail qui correspond à celle de GitLab.
Ensuite il propose une destination d'enregistrement, il est préférable de conserver celle par défaut en tapant sur entrer. Il est également possible de mettre un mot de passe, mais ce n'est pas obligatoire (sans mot de passe : 2x entrer)
Une fois que la clef est générée (chemin par défaut : C:\Users\user\.ssh), copier l'**INTEGRALITE** du contenu du fichier **id_rsa.pub**.
### Configuration GitLab
Coller ce contenu sur GitLab dans **User>Settings>SSHKey>Key** et cliquer sur Add Key.
### Configuration SourceTree
Lors de l'installation de SourceTree si il vous demande si vous avez une clef dite non. Ensuite aller dans **Tool>Options>General** dans l'onglet **SSH client** modifier l'option **Putty/Link** par défaut en **SSHKey** ensuite renseigner le chemin de votre clef **.ssh\id_rsa**.
**And it's done !!**
>>>>>>> 612423ee002fe086286991e4265ebf12bb46c289
