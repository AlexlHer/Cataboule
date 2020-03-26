<?php
	// Auteur : Alexandre l'Heritier

	// On récupère l'id du niveau demandé.
	$level_voulu = htmlspecialchars($_POST["level"]);

	// Si le niveau existe, on l'echo.
	if(file_exists("../levels/level" . $level_voulu . ".json"))
		echo file_get_contents("../levels/level" . $level_voulu . ".json");
	// Sinon, on echo un json spécial.
	else
		echo "{\"end\": true}";
?>