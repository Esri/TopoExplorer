import { configurables } from '../../app-config.js?v=0.03';

const minYearOutStats = JSON.stringify([
	{
		statisticType: 'min',
		onStatisticField: configurables.outfields.dateCurrent,
		outStatisticFieldName: 'MinMapYear',
	},
]);
const maxYearOutStats = JSON.stringify([
	{
		statisticType: 'max',
		onStatisticField: configurables.outfields.dateCurrent,
		outStatisticFieldName: 'MaxMapYear',
	},
]);
const minScaleOutStats = JSON.stringify([
	{
		statisticType: 'min',
		onStatisticField: configurables.outfields.mapScale,
		outStatisticFieldName: 'MinMapScale',
	},
]);
const maxScaleOutStats = JSON.stringify([
	{
		statisticType: 'max',
		onStatisticField: configurables.outfields.mapScale,
		outStatisticFieldName: 'MaxMapScale',
	},
]);

const findMinYear = (url) => {
	return new Promise((resolve, reject) => {
		const params = new URLSearchParams({
			where: '',
			returnGeometry: false,
			returnQueryGeometry: false,
			returnIdsOnly: false,
			returnCountOnly: false,
			returnextentOnly: false,
			returnDistinctValues: false,
			outStatistics: minYearOutStats,
			f: 'pjson',
		});

		axios
			.get(url, {
				params,
			})
			.then((response) => {
				const minYear = response.data.features[0].attributes.MinMapYear;
				resolve(minYear);
			});
	});
};

const findMaxYear = (url) => {
	return new Promise((resolve, reject) => {
		const params = new URLSearchParams({
			where: '',
			returnGeometry: false,
			returnQueryGeometry: false,
			returnIdsOnly: false,
			returnCountOnly: false,
			returnextentOnly: false,
			returnDistinctValues: false,

			outStatistics: maxYearOutStats,
			f: 'pjson',
		});

		axios
			.get(url, {
				params,
			})
			.then((response) => {
				const maxYear = response.data.features[0].attributes.MaxMapYear;
				resolve(maxYear);
			});
	});
};

const findMinScale = (url) => {
	return new Promise((resolve, reject) => {
		const params = new URLSearchParams({
			where: '',
			returnGeometry: false,
			returnQueryGeometry: false,
			returnIdsOnly: false,
			returnCountOnly: false,
			returnextentOnly: false,
			returnDistinctValues: false,

			outStatistics: minScaleOutStats,
			f: 'pjson',
		});

		axios
			.get(url, {
				params,
			})
			.then((response) => {
				const minScale = response.data.features[0].attributes.MinMapScale;
				resolve(minScale);
			});
	});
};

const findMaxScale = (url) => {
	return new Promise((resolve, reject) => {
		const params = new URLSearchParams({
			where: '',
			returnGeometry: false,
			returnQueryGeometry: false,
			returnIdsOnly: false,
			returnCountOnly: false,
			returnextentOnly: false,
			returnDistinctValues: false,
			outStatistics: maxScaleOutStats,
			f: 'pjson',
		});

		axios
			.get(url, {
				params,
			})
			.then((response) => {
				const maxScale = response.data.features[0].attributes.MaxMapScale;
				resolve(maxScale);
			});
	});
};

export { findMinYear, findMaxYear, findMinScale, findMaxScale };
