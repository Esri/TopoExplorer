const minYearOutStats = JSON.stringify([
	{
		statisticType: 'min',
		onStatisticField: 'DateCurrent',
		outStatisticFieldName: 'MinMapYear',
	},
]);
const maxYearOutStats = JSON.stringify([
	{
		statisticType: 'max',
		onStatisticField: 'DateCurrent',
		outStatisticFieldName: 'MaxMapYear',
	},
]);
const minScaleOutStats = JSON.stringify([
	{
		statisticType: 'min',
		onStatisticField: 'Map_Scale',
		outStatisticFieldName: 'MinMapScale',
	},
]);
const maxScaleOutStats = JSON.stringify([
	{
		statisticType: 'max',
		onStatisticField: 'Map_Scale',
		outStatisticFieldName: 'MaxMapScale',
	},
]);

const allScaleAndYears = JSON.stringify([
	{
		statisticType: 'min',
		onStatisticField: 'DateCurrent',
		outStatisticFieldName: 'MinMapYear',
	},
	{
		statisticType: 'max',
		onStatisticField: 'DateCurrent',
		outStatisticFieldName: 'MaxMapYear',
	},
	{
		statisticType: 'min',
		onStatisticField: 'Map_Scale',
		outStatisticFieldName: 'MinMapScale',
	},
	{
		statisticType: 'max',
		onStatisticField: 'Map_Scale',
		outStatisticFieldName: 'MaxMapScale',
	},
]);

// const findAllScalesAndYears = (url) => {
// 	return new Promise((resolve, reject) => {
// 		const params = new URLSearchParams({
// 			where: '',
// 			returnGeometry: false,
// 			returnQueryGeometry: false,
// 			returnIdsOnly: false,
// 			returnCountOnly: false,
// 			returnextentOnly: false,
// 			returnDistinctValues: false,
// 			outStatistics: allScaleAndYears,
// 			f: 'pjson',
// 		});
// 		axios
// 			.get(url, {
// 				params,
// 			})
// 			.then((response) => {
// 				console.log('all scales and years', response);
// 			});
// 	});
// };

const findMinYear = (url) => {
	// const outStatsParams
	return new Promise((resolve, reject) => {
		// const url =
		// 	'https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/query';
		//NOTE: you need to take these out of here. They
		const params = new URLSearchParams({
			where: '',
			returnGeometry: false,
			returnQueryGeometry: false,
			returnIdsOnly: false,
			returnCountOnly: false,
			returnextentOnly: false,
			returnDistinctValues: false,
			// outFields: 'Map_Scale, Date_On_Map',
			outStatistics: minYearOutStats,
			f: 'pjson',
		});

		axios
			.get(url, {
				params,
			})
			.then((response) => {
				//NOTE: checking the years and scales of all the returned maps
				// console.log(response);
				const minYear = response.data.features[0].attributes.MinMapYear;
				console.log(minYear);
				resolve(minYear);
			});
	});
};

const findMaxYear = (url) => {
	// const outStatsParams
	return new Promise((resolve, reject) => {
		// const url =
		// 	'https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/query';
		//NOTE: you need to take these out of here. They
		const params = new URLSearchParams({
			where: '',
			returnGeometry: false,
			returnQueryGeometry: false,
			returnIdsOnly: false,
			returnCountOnly: false,
			returnextentOnly: false,
			returnDistinctValues: false,
			// outFields: 'Map_Scale, Date_On_Map',
			outStatistics: maxYearOutStats,
			f: 'pjson',
		});

		axios
			.get(url, {
				params,
			})
			.then((response) => {
				// console.log(response);
				const maxYear = response.data.features[0].attributes.MaxMapYear;
				console.log(maxYear);
				resolve(maxYear);
			});
	});
};

const findMinScale = (url) => {
	// const outStatsParams
	return new Promise((resolve, reject) => {
		// const url =
		// 	'https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/query';
		//NOTE: you need to take these out of here. They
		const params = new URLSearchParams({
			where: '',
			returnGeometry: false,
			returnQueryGeometry: false,
			returnIdsOnly: false,
			returnCountOnly: false,
			returnextentOnly: false,
			returnDistinctValues: false,
			// outFields: 'Map_Scale, Date_On_Map',
			outStatistics: minScaleOutStats,
			f: 'pjson',
		});

		axios
			.get(url, {
				params,
			})
			.then((response) => {
				// console.log(response);
				const minScale = response.data.features[0].attributes.MinMapScale;
				console.log(minScale);
				resolve(minScale);
			});
	});
};

const findMaxScale = (url) => {
	// const outStatsParams
	return new Promise((resolve, reject) => {
		// const url =
		// 	'https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/query';
		//NOTE: you need to take these out of here. They
		const params = new URLSearchParams({
			where: '',
			returnGeometry: false,
			returnQueryGeometry: false,
			returnIdsOnly: false,
			returnCountOnly: false,
			returnextentOnly: false,
			returnDistinctValues: false,
			// outFields: 'Map_Scale, Date_On_Map',
			outStatistics: maxScaleOutStats,
			f: 'pjson',
		});

		axios
			.get(url, {
				params,
			})
			.then((response) => {
				console.log(response);
				const maxScale = response.data.features[0].attributes.MaxMapScale;
				console.log(maxScale);
				resolve(maxScale);
			});
	});
};

// const getAllMapsScalesAndYears = (url) => {
// 	console.log('all years and scales');

// 	return new Promise((resolve, reject) => {
// 		//NOTE: you need to take these out of here. They
// 		const params = {
// 			where: 'DateCurrent >= 1878 AND Map_Scale >= 10000',
// 			returnGeometry: false,
// 			returnQueryGeometry: false,
// 			outFields: 'Map_Scale, DateCurrent',
// 			returnDistinctValues: true,
// 			f: 'json',
// 		};
// 		axios
// 			.get(url, {
// 				params,
// 			})
// 			.then((response) => {
// 				//NOTE: checking the years and scales of all the returned maps
// 				console.log(response);
// 				const allMaps = response.data.features;

// 				let mapYears = allMaps.map((maps) => maps.attributes.DateCurrent);
// 				console.log(mapYears.sort());
// 				let availableYears = [
// 					...new Set(mapYears.map((year) => Math.ceil(year / 10) * 10).sort()),
// 				].filter((year) => year !== 0);
// 				console.log(availableYears);

// 				availableYears[0] = availableYears[0] - 1;

// 				const mapScales = allMaps.map((maps) => maps.attributes.Map_Scale);

// 				const allScales = [...new Set(mapScales.sort((a, b) => a - b))];

// 				const scaleArrayIndexes = [
// 					0,
// 					Math.round(allScales.length / 2 / 2),
// 					Math.round(allScales.length / 2) + 1,
// 					Math.round(
// 						Math.round(allScales.length / 2) +
// 							Math.round(allScales.length / 2) / 2
// 					),
// 					allScales.length - 1,
// 				];
// 				const availableScales = scaleArrayIndexes.map((scalePosition) => {
// 					return allScales[scalePosition];
// 				});

// 				resolve({ availableYears, availableScales });
// 			});
// 	});
// };

export {
	findMinYear,
	findMaxYear,
	findMinScale,
	findMaxScale,
	// findAllScalesAndYears,
};
