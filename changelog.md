# Projet WEB

Projet WEB : Projet Cataboule (M1S2 - 2019-2020)

&nbsp;

# Changelog

## [Version 1.2 / Build F200405.1] - 2020-04-05

### Changed

- Dans une optique de 100% JS, suppression de tous les php :
	- Chargement des niveaux directement avec XMLHttpRequest() sans passer par php.
	- Utilisation de localStorage au lieu des cookies.
	- Ajout d'un fichier nbLevels.json dans levels/ pour avoir le nombre de niveaux sans exploration.
	- Mise à jour du rapport.

&nbsp;
___
&nbsp;

## [Version 1.1 / Build F200402.1] - 2020-04-02

### Changed

- Suppression de jQuery (donc remplacement des jQuery.ajax par des XMLHttpRequest).
- Modification de la déco des niveaux.

&nbsp;
___
&nbsp;

## [Version 1.0 / Build F200325.1] - 2020-03-25
### Build Release Candidate 2 -> Final

### Added

- Ajout de quelques try catch en cas de mauvais JSON.

### Changed

- Ajout d'un compteur de pas pour les objets mouvants pour éviter les interbloquages.

### Fixed

- Dernière correction sur la collision entre deux objets masse Infinity qui faisait disparaitre ces objets.
- Correction au niveau du menu pause depuis un niveau perso.

&nbsp;
___
&nbsp;

## [Build RC2200318.1] - 2020-03-18


### Added

- Ajout du tri des objets pour éviter qu'ils vibrent.
- Ajout du niveau de zoom initial dans les saves.
- Ajout du clique gauche pour le déplacement de la caméra uniquement (pas de déclenchement de pouvoir, ni de lancé de boule).

### Changed

- Amélioration du zoom, il s'applique par rapport au centre de l'écran maintenant.

### Fixed

- ReAjout des dégats sur b dans Body::collision() (sinon, pas pris en compte).
- Bug au niveau du suivi de la caméra corrigé.
- Ajout de quelques return true oubliés dans Jeu::click().
- Correction d'un bug lors du retour accueil depuis le menu pause (le niveau suivant apparaissait).

&nbsp;
___
&nbsp;

## [Build RC2200316.1] - 2020-03-16

### TODO

- Retirer vibration.
- Création des niveaux.
- Rapport/Doc.

### Added

- Ajout de plein de commentaires.
- Ajout de très légers frôttement (léger sinon c'est moins drôle !).
- Ajout de "pouvoir" pour les cibles. Lors de leur libération, les cibles se transforment en boule et se lance vers une des cibles.
- Ajout d'une interface d'erreur (copie de l'interface win(true)) pour les erreurs fatales de save (les autres reste affichées dans les logs).
- Ajout d'un mode debug, à activer dans Constants, qui réunis quelques trucs dans le code.
- Création des niveaux 1 et 2.

### Changed

- Reajout du suivi de la boule 2 (l'utilisateur peut mettre et enlever le suivi de la boule s'il veut).
- Le déplacement des objets mouvant est maintenant fait avec la vitesse et non directement avec la position (permet de distribuer la vitesse lors d'une collision mais on perd le fait qu'aucun objet ne peut les faire dévier de leur trajectoire (un objet fixe les fera dévier)).
- Suppression de vieux calculs un peu partout.
- Augmentation de la vitesse de la boule2.
- Calcul de la taille du texte point de vie effectué en fonction de la taille de la cible.
- La masse de la boule1 après transformation est maintenant de 150.
- La vitesse minimal pour perte de PV est maintenant de 0.4.

### Fixed

- Oubli lors de la fin d'un niveau perso, le idLevel etait incrémenté de 1.

&nbsp;
___
&nbsp;


## [Build RC2200314.1] - 2020-03-14
### Build Release Candidate 1 -> Release Candidate 2

### TODO

- Commentaires.
- Création des niveaux.
- Rapport/Doc.

### Added

- Ajout de inv() dans Vector pour inverser un vector.
- Ajout de l'inversion de viseur. Lorsqu'on tire sur la boule, la corde se tire de l'autre sens, ce qui permet au curseur de la souris de devenir un viseur.
- Ajout d'un Param pour changer l'inversion de viseur.
- Ajout de vérifications supplémentaire dans la lecture de save (Jeu::loadLevel()).
- Ajout d'un mode gravité zéro dans la save.
- Ajout de l'affichage des PV sur les cibles.
- Ajout d'un paramètre force du lanceur dans la save.
- [Hors Code] Création des murs "du bas" (sans herbe par exemple).
- [Hors Code] Conversion de toutes les images en WebP.
- Changement des .png en .webp.
- Ajout d'un mode plein écran.
- Ajout de plein de commentaires.
- Ajout de la possibilité de charger un niveau perso.

### Changed

- Dans Engine::deplace_souris, lorsqu'on tire sur la boule, la limite de taille de corde est ronde (et non plus carré).
- Le repositionnement sur la boule de la caméra est effectué selon la largeur du canvas, pour que ce soit plus fonctionnel.
- Le suivi de la boule continue maintenant après le déclenchement de son pouvoir (et ajout du suivi de la boule 3 après son pouvoir (je laisse ce bug, c'est finalement pratique)).
- Suppression du paramètre vitesse des zoom_plus et moins.
- Amélioration du redimentionnement, le height est maintenant ajusté.

### Fixed

- Le suivi de la boule etait effectué de manière "sale" (les calculs n'avait pas été retouché depuis leurs ajouts et un bug de suivi rare etait présent). Maintenant, oldOrigine prend la position initial de la boule dans le repère lors du lancement de la boule et update() se charge d'ajouter la position x de la boule à oldOrigine pour suivre la boule.
- Correction d'une erreur dans Canvas::set_size_canvas() qui appliquait un mauvais resize().
- Correction d'un bug dans le moteur de jeu qui faisait disparaitre des objets.

&nbsp;
___
&nbsp;

## [Build RC1200311.1] - 2020-03-11

### TODO

- Verifications du json plus poussée.
- Faire les blocs spé.
- Mettre valeur absolu pour reposition sur boule.
- Voir pour bug de suivi de boule.
- Voir resize qui ne se fait pas tout le temps.
- Bouton pour mettre en plein écran.
- Mettre un rond pour le lanceur de boule.
- Voir pour utiliser movementX et Y au lieu de origineDorigine.
- Voir pour utiliser le webStorage au lieu des cookies.
- Commentaires.
- Création des niveaux.
- Rapport/Doc.

### Added

- Ajout de plein de commentaires.

### Changed

- Les push ont été réunis dans les interfaces pour que ce soit plus clair.
- Simplification de Jeu::click().

### Fixed

- Modification des conditions pour vérifier si les éléments indispensable sont présent dans la save.

&nbsp;
___
&nbsp;

## [Build RC1200308.3] - 2020-03-08
### Build SuperStable -> Release Candidate 1
#### Version pouvant être définitive.

### TODO

- Commentaires.
- Création des niveaux.
- Rapport.

### Added

- Ajout des crédits sur la page d'accueil.
- Ajout de plein de commentaires.

### Changed

- Les chargements d'images sont maintenant async (obligatoire si on retire le cache).

&nbsp;
___
&nbsp;


## [Build SS200308.2] - 2020-03-08
### Build Stable -> SuperStable
#### Toutes les fonctionnalités avancées sont implémentées et fonctionnelles. Jeu jouable sans problème. Interface générale définitive. Plus aucun bug majeur.

### TODO

- Pb save (dans la conception de loadLevel, voir pour changer la manière de détecter end).
- Création des niveaux.
- Commentaires.
- Rapport.

### Changed

- Mise en place d'elements facultatifs pour les sauvegardes.
- La detection du win() est maintenant faite par Jeu::update().
- Ajout d'un paramètre à la méthode Jeu::getLevel() pour dire qu'on veut patienter pour l'obtention d'un level (quand le joueur choisi un niveau sur la liste ou quand il veut recommencer le jeu).

### Fixed

- Le texte de selection de niveau est maintenant lisible.
- Correction de la perte de progression lors de la sauvegarde de celle-ci dans les cookies.
- Correction d'un problème qui faisait perdre sa progression lorsque le joueur faisait "Accueil" sur l'interface end().
- Correction de plusieurs problèmes qui affichait win() alors que le joueur n'avait pas commencer à jouer : c'est loadLevel() qui passe le relais à engine maintenant.
- Correction d'un problème qui faisait perdre la progression du joueur lorsqu'il se rendait sur l'accueil après la fin d'un niveau.
- Correction d'un problème qui n'affichait pas à la bonne position le texte de la save.

&nbsp;
___
&nbsp;

## [Build S200308.1] - 2020-03-08

### TODO

- Création des niveaux.
- Commentaires.
- Rapport.

### Added

- Ajout de la possibilité de donner une couleur autre que gris noir aux boutons.
- Ajout de la classe Imagee.
- Ajout de la méthode Texte::updateTexte().
- Ajout d'un bouton Setting qui fait apparaitre deux autres boutons : afficheFps et suiviCam (l'appui sur un de ces boutons recharge l'interface de jeu volontairement pour éviter plus de if dans update).
- Ajout de la condition d'affichage des FPS.
- Ajout de la condition de suivi dans Engine directement.
- Ajout de l'enregistrement / lecture cookie pour les params.
- Ajout d'un écran de chargement au début, le temps que toutes les images, les cookies et le premier level soit chargé.
- Ajout d'un fond généré aléatoirement pour les interface FS.

### Changed

- Conversion de l'interface InGame.
- Fusion des méthodes Jeu::clickInGame et Jeu::clickFS.
- Amélioration de la classe Texte : Alignement du texte plus poussé et un if en moins dans draw().
- Fusion des méthodes Jeu::updateFS() et Jeu::updateIG(). L'interface de jeu devient une interface comme les autres, avec l'id -1.
- La méthode Jeu::clickFS() devient Jeu::click().
- L'affichage des fps est transféré dans la classe Jeu.

### Fixed

- Le comptage de boule affichait undefined lors du changement de niveau.

&nbsp;
___
&nbsp;

## [Build S200307.1] - 2020-03-07

### TODO

- Mettre des paramètres de couleurs pour Bouton et Texte.
- Convertir interfaceDeJeu().
- Création des niveaux.
- Commentaires.
- Rapport.

### Added

- Ajout d'une classe Bouton.
- Ajout d'une classe Texte.

### Changed

- Conversion de l'interface Accueil : 
 - Affichage initiale.
 - Update.
 - Fonction qui est enregistrée dans le bouton appelée lors du clique sur bouton.
 - : Fonctionne parfaitement et rend lisible ces parties du code.
- Conversion des interfaces Pause, Win, End et choixNiveau.

### Fixed

- Effacement des tableaux de stockage des elements d'interface avant leurs remplissages par les fonctions de création d'interface.
- Création des méthodes resize() dans Jeu et Engine pour que les interfaces soit recréées lors d'un changement de dimension de fenetre.

&nbsp;
___
&nbsp;

## [Build S200229.1] - 2020-02-29

### TODO

- Classe Bouton/Interface
- Peaufiner interface Niveau.
- Ajouter une attente de chargement de niveau.

### Added

- Ajout d'une interface pour choisir un niveau.

### Changed

- Une vérification est fait lors de l'enregistrement dans un cookie pour ne pas perdre sa progression si on refait un niveau inferieur (servira pour une futur fonctionnalité de choix de niveau). Possibilité de forcer malgré tout l'enregistrement.

### Fixed

- 

&nbsp;
___
&nbsp;

## [Build S200228.1] - 2020-02-28

### Added

- Ajout des murs invisible avec simplification par rapport à ce qui était prévu (juste à donner x1, y1, x2, y2 et le programme se charge de dessiner des murs autour).
- Ajout de plein de types de mur. Modification du json pour supporter les nouvelles options.
- Ajout d'un effet au niveau du bg qui fait bouger le bg plus vite que les objets.
- Ajout de plusieurs types de background, avec adaptation de la couleur du bas.
- Ajout d'élasticités pour les differents matériaux et pour les boules.
- Ajout de la possibilité de définir une élasticité pour chaque Case dans le json (si rien, élasticité d'origine).
- Ajout de la possibilité de mettre du texte dans un niveau (dans le json).
- Ajout de la possibilité de faire déplacer d'un point A à un point B une case ou un mur.
- Ajout de la possibilité de faire un déplacement caméra instantané.
- Ajout de la possibilité de faire un déplacement caméra "doux" avec une destination et une vitesse.

### Changed

- La taille des murs invisible est maintenant demandé.
- Les body ont maintenant leur élasticité.
- Le déplacement caméra est maintenant fait de manière moins...mathématique mais plus rapide.
- Les traits autout des textes prennent en compte le zoom.
- Changement de l'apparence des boutons de choix de boule et pause/reload.

### Fixed

- Certaines élasticités n'était pas prisent en compte : ajout d'une moyenne entre this et b dans Body::Collision().
- Quelques correction sur les variables qui déplacent la caméra, pour éviter les conflits.

&nbsp;
___
&nbsp;


## [Build S200227.1] - 2020-02-27

### Added

- Ajout d'une image de lance-pierre (https://favpng.com/png_view/angry-angry-birds-stella-angry-birds-star-wars-ii-slingshot-png/RQ00S2Nd).
- Ajout d'une corde au lance-pierre.
- Ajout de plusieurs types de cibles avec plusieurs caractéristiques differentes.
- Ajout de pleeeein de cases : 4 types differents, 8 formes differentes, 3 niveaux de friabilités (108 cases).

### Changed

- Découpage de l'image de lance-pierre en deux, pour avoir un effet 3d leger.
- Modification de la couleur de la ligne qui servai de corde avant (blanc -> rouge) : sert à présent de viseur.
- Le suivi de la balle (toujours désactivé, plus facile à debug) est maintenant uniquement en x (plus agréable à regarder).
- Création de la classe Boule qui réuni les éléments en commun entre les boules.
- Modification du json pour supporter la nouvelle config des cases (type, forme).

### Fixed

- Bug au niveau de la vie des body. Si la masse était supérieur à 50, la case perdait de la vie seul.
- Le bug de la vie etait toujours présent, donc j'ai ajouté une condition de vitesse, ça a l'air de fonctionner pour les blocs empilés.

&nbsp;
___
&nbsp;

## [Build S200226.2] - 2020-02-26

### TODO

- Bouton reload avec niveau 1 recommencé.
- 

### Added

- Ajout d'un carré noir semi-transparent sous le compteur d'IPS.
- Changement de la gestion des boules : pour simplifier Jeu et Engine, création de 4 classes Boule représentant les 4 types de boules. Avec un attribut image pour mettre une image plus tard et un attribut emplacementInitBoule qui sera utile pour Engine.
- Ajout des méthodes fixeToDynamique() qui s'occupe de la partie lancement de boule et des méthodes pouvoir() qui s'occupe des pouvoirs de la boule.
- Ajout des images de boules dans les carrés de séléction.

### Changed

- Suppression des attributs typeBoule, bouleFutur et emplacementInitBoule de la classe Engine. Adaptation des méthodes de la classe Engine.
- Changement dans la méthode de stockage des images (avant, il n'y avait que le background) : création d'un objet image qui stockera toutes les images chargé (background et celles ajoutées plus tard).
- Ajout d'une image pour la boule0.
- Ajout des images pour les autres boules.
- Pour les boules uniquement, l'emplacement initial demandé est le centre (car plusieurs tailles de boule).

### Fixed

- Le bouton reload ne fonctionnait plus à cause de la modification du chargement de niveau de la build précédante.
- Correction d'un bug qui ne triplait pas la boule triple.
- Correction d'un bug qui ne changai pas la taille de l'image lors du grossissement de la boule1.

&nbsp;
___
&nbsp;

## [Build S200226.1] - 2020-02-26
### Build Beta -> Stable
#### Toutes les fonctionnalités de bases sont implémentées et fonctionnelles.

&nbsp;

### Added

- Ajout d'un écran FS d'annonce de niveau terminé.
- Ajout de l'écran de fin de jeu avec possibilité de recommencer le jeu.

### Changed

- Gestion du chargement du niveau suivant modifié pour que ça fonctionne.

### Fixed

- Bug de chargement de l'image de fond résolu.
- Problème d'ajout de cible par le lecteur de json corrigé.
- Problème de suppression de cible lors de sa destruction corrigé.
- Les cookies sont enfin enregistrés correctement.

&nbsp;
___
&nbsp;

## [Build B200223.1] - 2020-02-23

### Added

- Ajout du téléchargement dynamique des niveaux actuel et suivant.
- Ajout du chargement basique du niveau récupéré (sans prendre en compte toute la sauvegarde pour l'instant).
- Mise en place d'une coloration des boutons lors du passage de la souris dessus.
- Introduction de la méthode interfaceEnJeu() dans la classe Jeu pour faire appareitre des élements pendant le jeu.
- Ajout d'un bouton pause pour tester. Il met le jeu en pause. Lors de l'appuis sur le bouton "Reprendre", il revient au jeu.
- Ajout d'un bouton pour revenir à l'accueil depuis le menu pause.
- Ajout de l'enregistrement du dernier niveau joué.
- Ajout d'un bouton "Reload" pour recommencer le niveau.
- Ajout de la lecture du nombre de boules disponible dans le json avec selection du premier type de boule avec au moins une unité dispo.
- Ajout des quatres boutons permettant de séléctionner l'une des quatre boules disponible.
- Ajout d'une image de fond qui se déplace avec l'origine (méthode basé sur l'affichage des graduations de TEC).
- Ajout de plusieurs paramètres pour l'affichage du fond.


### Fixed

- Correction d'un bug qui permettai de pouvoir lancer des boules à l'infini.

&nbsp;
___
&nbsp;

## [Build B200222.1] - 2020-02-22

### Added

- Création de la classe Jeu qui se chargera de gérer le jeu (passage à differents niveaux, scores) et les interfaces (accueil, les boutons pendant le jeu, pause, &c).
- Ajout de la délégation des cliques et affichages pour Jeu, s'il y a une interface plein écran.
- Ajout de la détection du clique sur les deux boutons de l'accueil.
- Ajout de la récupération du cookie de dernier niveau joué.
- Ajout de la récupération des json de niveau.

&nbsp;
___
&nbsp;

## [Build B200221.1] - 2020-02-21

### Added

- Affichage des fps.
- Ajout des objets déco, sans prise en compte des collisions.
- Ajout d'un système de point de vie pour les Body (donc, des cibles).
- Ajout d'un système de friabilité des objets (basé et placé comme le système de point de vie).
- Ajout du type de boule 1 qui, quand on clique, s'agrandi, s'alourdi et perd en vitesse.
- Ajout du type de boule 2 qui, quand on clique, prend la direction du clique.
- Ajout du type de boule 3 qui, quand on clique, se divise en deux.
- Début de rangement de toutes les modifications dans divers méthodes.
- Début de création de l'accueil.

### Changed

- La création de la boule de lancement demande maintenant un sprite au lieu de juste une position.
- Réorganisation des paramètres des sprites et de Body (masse devient obligatoire, isDeco et isCible à la fin).

### Fixed

- Le nouveau système de point de vie ne fonctionnait pas avec la gravité (les points de vie descendait à cause du sol), donc ajout de la condition du niveau de puissance de la collision (fixé à > 2 pour l'instant).
- Nouveau changement pour prendre en compte les changements éventuels de la gravité : j > gravité.norm() * 1000.

### Other
- Recherche des graphismes à mettre (thx www.kenney.nl) : https://opengameart.org/content/physics-assets

&nbsp;
___
&nbsp;

## [Build B200219.1] - 2020-02-19

### TODO
- Les fonctionnalités de base.
- Le fantom de lancé.

### Added

- Ajout d'une ligne de la boule vers son point de départ.
- Ajout d'un suivi caméra lors d'un lancé.

### Changed

- Integration plus propre du lancement de boule : Support du zoom, possibilité de créer une boule n'importe où avec possibilité de la lancer.

### Fixed

- Bug de collision dû au changement de repère corrigé.

&nbsp;
___
&nbsp;

## [Build B200218.1] - 2020-02-18

### TODO
- Adapter les y avec l'origine pour les collisions.
- Zoom + tir de boule.

### Added

- Table rase, reprise du TP2 (je verrai une autre fois pour l'implémentation d'un moteur physique).
- Création de la classe Canvas, avec set_size_canvas() et l'origine au centre.
- Ajout des méthodes mouseDown, mouseUp et deplace_souris pour le déplacement dans le canvas(TsEasyCanvas).
- Ajout des méthodes de zoom de TEC avec agrandissement des objets.
- Ajout d'une boule à l'origine du repère pouvant être lancée (pour tester le bug des collisions).  

### Changed

- Conversion du modèle basé sur les div sur un modèle basé sur le canvas.
- Fusion des classes Renderer et Engine et de leurs méthodes update.
- Engine étend maintenant la classe Canvas.
- La classe Sprite est découpé en deux : Carre et Rond (il n'y a que l'apparence qui change pour l'instant).
- -Gravity au lieu de +Gravity (l'axe y est vers le haut).

### Fixed

- 

&nbsp;
___
&nbsp;

## [Build B200217.1] - 2020-02-17

### Added

- Projet repris de zéro : Méthode de collision plus ... mathématique.
- Implémentation des collisions Rond Sol.
- Implémentation des collisions Rond Rond.
- Ne fonctionne pas, problème dans mes calculs de math que je ne trouve pas (voir brouillons).

&nbsp;
___
&nbsp;

## [Build B200216.1] - 2020-02-16

### Added

- Création du projet Cataboule de zéro.
- Ajout de la fonction set_size_canvas() et des calculs simples d'origine au centre du projet perso TsEasyCanvas.
- Implémentation des pointsContact Carre et Rond.
- Implémentation des estDans Carre et Rond.
- Implémentation des collisions entre Rond et Sol.

&nbsp;
___
&nbsp;