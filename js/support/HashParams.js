//Not sure if it's a good/useful idea to create another module just to manage the URL's hash params,
//but, at the moment, I wasn't sure how else to structure my code to accomodate the fact that
//the map IDs and the location/zoom information rely on different modules and both will ned to access the hash params.
//I am VERY open to other solutions.

const urlHash = window.location.hash;

const parseHashParams = urlHash
	.substring(1)
	.split('&')
	.reduce((res, item) => {
		const paramElement = item.split('=');
		res[paramElement[0]] = paramElement[1];
		return res;
	}, {});

const updateHashParams = (data) => {
	//NOTE: I'm not sure if using one function to update the hashParams string is the best idea,
	//I'm worried that it could clutter the goal of the function,
	//but I thought this apporach might be a simple way to track and implement the changes to the hash params
	console.log(data);
	console.log(typeof data);

	if (Array.isArray(data)) {
		// console.log(data)
		// data.reverse();
		parseHashParams.maps = data.join(',');
	} else {
		parseHashParams.loc = `${data.center.longitude.toFixed(
			2
		)},${data.center.latitude.toFixed(2)}`;
		parseHashParams.LoD = data.zoom;
	}

	console.log(parseHashParams);

	const hashString = `maps=${parseHashParams.maps || ''}&loc=${
		parseHashParams.loc
	}&LoD=${parseHashParams.LoD}`;

	window.location.hash = hashString;
};

const hashCoordinates = () => {
	if (!parseHashParams.loc) {
		return;
	}

	return parseHashParams.loc.split(',');
};

const hashLoD = () => {
	if (!parseHashParams.LoD) {
		return;
	}

	return parseHashParams.LoD;
};

const checkForPreviousTopos = () => {
	return parseHashParams.maps;
};
export { updateHashParams, hashCoordinates, checkForPreviousTopos, hashLoD };
