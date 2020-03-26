<?php
	// Auteur : Alexandre l'Heritier

	// On regarde jusqu'a combien de niveau on peut aller.
	$i = 1;
	while(file_exists("../levels/level" . $i . ".json"))
		$i++;
	
	// On l'écrit.
	echo $i-1;
?>