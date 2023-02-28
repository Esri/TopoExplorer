import { orderMapsByDate } from '../UI/ListOfMaps.js?v=0.01';

//TODO: Figure out the earlest year for the US topo maps.
//NOTE: earlyMaps is unix timestamp that dates back to Dec 31, 1878. Prior to the first US topo maps.
const queryOutfields = '*';
// const yearsAndScales = {
// 	minYear: '',
// 	maxYear: '',
// 	minScale: '',
// 	maxScale: '',
// };
//outfields that might be used for the application
// [
// 	'Map_Name',
// 	'year',
// 	'DateCurren',
// 	'Map_Scale',
// 	'Download_GeoPDF',
// 	'View_FGDC_Metadata_XML',
// 	'View_Thumbnail_Image',
// 	'File_name',
// 	'DownloadG',
// ].join(',');

const extentQuery = async (viewExtent, scalesAndYears) => {
	console.log('extent query try');
	scalesAndYears ? console.log(scalesAndYears) : null;

	return new Promise((resolve, reject) => {
		const url =
			'https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/query';

		const params = {
			where: `year >= ${scalesAndYears.minYear} AND year <= ${scalesAndYears.maxYear} AND map_scale >= ${scalesAndYears.minScale} AND map_scale <= ${scalesAndYears.maxScale}`,
			// time: `${scalesAndYears.minYear}, ${scalesAndYears.maxYear}`,
			geometry: JSON.stringify(viewExtent),
			geometryType: 'esriGeometryEnvelope',
			spatialRel: 'esriSpatialRelIntersects',
			returnGeometry: false,
			returnQueryGeometry: true,
			outFields: queryOutfields,
			f: 'json',
		};
		axios
			.get(url, {
				params,
			})
			.then((response) => {
				// console.log(response)
				const topoMapsInExtent = response.data.features;
				// console.log(topoMapsInExtent);

				let mapsList = topoMapsInExtent.map((topo) => ({
					topo,
					OBJECTID: topo.attributes.OBJECTID,
					date: topo.attributes.Date_On_Map,
					mapName: topo.attributes.Map_Name,
					mapScale: `1:${topo.attributes.Map_Scale}`,
					location: `${topo.attributes.Map_Name}, ${topo.attributes.Primary_State}`,
					thumbnail: `https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/${topo.attributes.OBJECTID}/info/thumbnail`,
					mapCenterGeographyX: topo.attributes.CenterX,
					mapCenterGeographyY: topo.attributes.CenterY,
					downloadLink: topo.attributes.DownloadG,
				}));

				orderMapsByDate(mapsList);
				resolve(mapsList);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

const initalQueryforUI = () => {
	console.log('initQuery');

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

				let availableYears = [
					...new Set(mapYears.map((year) => Math.ceil(year / 10) * 10).sort()),
				].filter((year) => year !== 0);

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
//NOTE: do I need to export both?
export { extentQuery, initalQueryforUI };
