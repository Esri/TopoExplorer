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
