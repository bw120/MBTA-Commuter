<?php
//URL of GTFS .zip file on server
$gtfsURL = "http://www.mbta.com/uploadedfiles/MBTA_GTFS.zip";
//location to download file to
$localFile = 'gtfs/gfts.zip';

//file to pull out of zip file
$routes = "routes.txt";

//download file from MBTA site
file_put_contents($localFile, fopen($gtfsURL, 'r'));

function GtfsToJSON ($item, $source) {
	$path = sprintf('zip://%s#%s', $source, $item);

	$Data = trim(file_get_contents($path));

	$array = array_map("str_getcsv", explode("\n", $Data));

	//pull out the first line to use as field names
	$fieldNames = array_slice($array, 0, 1);
	//the rest set as the data fields
	$dataFields = array_slice($array, 1);

	//assign filedNames as key names in the array.
	//return JSON file
	$x = 0;
	while ($x < count($dataFields)) {
		
		if (count($dataFields[$x]) === count($fieldNames[0])) { 
			$dataFields[$x] = array_combine($fieldNames[0], $dataFields[$x]);

		}
		$x++;
	}
	return json_encode($dataFields);
}

$myJson = GtfsToJSON($routes, $localFile);

print_r($myJson);




?>