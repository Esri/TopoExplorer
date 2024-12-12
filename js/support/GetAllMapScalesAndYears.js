import { appConfig } from '../../app-config.js?v=0.03';

const minYearOutStats = JSON.stringify([
	{
		statisticType: 'min',
		onStatisticField: appConfig.outfields.dateCurrent,
		outStatisticFieldName: 'MapYear',
	},
]);
const maxYearOutStats = JSON.stringify([
	{
		statisticType: 'max',
		onStatisticField: appConfig.outfields.dateCurrent,
		outStatisticFieldName: 'MapYear',
	},
]);
const minScaleOutStats = JSON.stringify([
	{
		statisticType: 'min',
		onStatisticField: appConfig.outfields.mapScale,
		outStatisticFieldName: 'MapScale',
	},
]);
const maxScaleOutStats = JSON.stringify([
	{
		statisticType: 'max',
		onStatisticField: appConfig.outfields.mapScale,
		outStatisticFieldName: 'MapScale',
	},
]);

const findMinYear = (url) => {
	if (!appConfig.enableTimeFilterSlider) {
		return;
	}
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
				const minYear = response.data;
				resolve(minYear);
			});
	});
};

const findMaxYear = (url) => {
	if (!appConfig.enableTimeFilterSlider) {
		return;
	}
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
				const maxYear = response.data;
				resolve(maxYear);
			});
	});
};

const findMinScale = (url) => {
	if (!appConfig.enableScaleFilterSlider) {
		return;
	}

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
				const minScale = response.data;
				resolve(minScale);
			})
			.catch((error) => {
				console.error(
					"issue trying to obtain the image service's minimum map-scale attribute.",
					error
				);
			});
	});
};

const findMaxScale = (url) => {
	if (!appConfig.enableScaleFilterSlider) {
		return;
	}

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
				const maxScale = response.data;
				resolve(maxScale);
			})
			.catch((error) => {
				console.error(
					"issue trying to obtain the image service's maximum map-scale attribute.",
					error
				);
			});
	});
};

export { findMinYear, findMaxYear, findMinScale, findMaxScale };
