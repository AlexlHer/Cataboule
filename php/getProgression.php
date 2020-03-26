<?php
	// Auteur : Alexandre l'Heritier

	// Si le cookie existe, on l'écrit.
	if(isset($_COOKIE["level_cataboule"])){
		echo htmlspecialchars($_COOKIE["level_cataboule"]);
	}

	// Sinon on le crée.
	else{
		setcookie("level_cataboule", 1);
		echo 1;
	}
?>