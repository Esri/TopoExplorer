const getAllMapsScalesAndYears = () => {
	console.log('all years and scales');

	// const url =
	// 	'https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/query';

	return new Promise((resolve, reject) => {
		const url =
			'https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/query';

		const params = {
			where: 'Map_Scale >= 10000',
			returnGeometry: false,
			returnQueryGeometry: false,
			outFields: 'Map_Scale, Date_On_Map',
			returnDistinctValues: true,
			f: 'json',
		};
		axios
			.get(url, {
				params,
			})
			.then((response) => {
				//NOTE: checking the years and scales of all the returned maps
				// console.log(response);
				const allMaps = response.data.features;

				let mapYears = allMaps.map((maps) => maps.attributes.Date_On_Map);
				console.log(mapYears.sort());
				let availableYears = [
					...new Set(mapYears.map((year) => Math.ceil(year / 10) * 10).sort()),
				].filter((year) => year !== 0);
				console.log(availableYears);

				availableYears[0] = availableYears[0] - 1;

				const mapScales = allMaps.map((maps) => maps.attributes.Map_Scale);

				const allScales = [...new Set(mapScales.sort((a, b) => a - b))];

				const scaleArrayIndexes = [
					0,
					Math.round(allScales.length / 2 / 2),
					Math.round(allScales.length / 2) + 1,
					Math.round(
						Math.round(allScales.length / 2) +
							Math.round(allScales.length / 2) / 2
					),
					allScales.length - 1,
				];
				const availableScales = scaleArrayIndexes.map((scalePosition) => {
					return allScales[scalePosition];
				});

				resolve({ availableYears, availableScales });
			});
	});
};

export { getAllMapsScalesAndYears };
