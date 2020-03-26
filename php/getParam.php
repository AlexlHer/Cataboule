<?php
	// Auteur : Alexandre l'Heritier

	// Si les cookies ne sont pas présent, on les crée.
	if(!isset($_COOKIE["fps"])){
		setcookie("fps", "true");
		setcookie("suivi", "true");
		setcookie("invVis", "true");

		// On écrit les params par défaut.
		echo "{\"fps\": true, \"suivi\": true, \"invVis\": true}";
	}

	// Sinon on les récupère.
	else{
		echo "{\"fps\": ";
		echo htmlspecialchars($_COOKIE["fps"]);
		echo ", \"suivi\": ";
		echo htmlspecialchars($_COOKIE["suivi"]);
		echo ", \"invVis\": ";
		echo htmlspecialchars($_COOKIE["invVis"]);
		echo "}";
	}
?>