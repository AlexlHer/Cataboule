# Cataboule
## Par Alexandre l'Heritier
Jeu de catapulte en JavaScript.

Projet WEB M1S2 :
https://www.lri.fr/~kn/teaching/js/projet/2019-2020/projet_m1_info_2019-2020.pdf

"Le but de ce projet est de concevoir un jeu de catapulte (de type Angry Birds, mais plus modeste) en HTML5 + Javascript."

![alt text](Evolution/Fin.png)

## Fonctionnalités de base
- Toutes implémentées.

## Fonctionnalités avancées
- Toutes implémentées.

# Derniers changements :

## [Version 1.22 / Build F200510.1] - 2020-05-10

### Changed

- Le bouton "Continuer" devient le bouton "Jouer".

### Fixed

- Correction au niveau de la récupération d'un niveau suivant inexistant.
- Correction au niveau de l'actualisation de maxCookie.


## [Version 1.21 / Build F200405.2] - 2020-04-05

### Fixed

- Quelques corrections.


## [Version 1.2 / Build F200405.1] - 2020-04-05

### Changed

- Dans une optique de 100% JS, suppression de tous les php :
    - Chargement des niveaux directement avec XMLHttpRequest() sans passer par php.
    - Utilisation de localStorage au lieu des cookies.
    - Ajout d'un fichier nbLevels.json dans levels/ pour avoir le nombre de niveaux sans exploration.
    - Mise à jour du rapport.