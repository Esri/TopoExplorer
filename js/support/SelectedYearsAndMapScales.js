const yearsAndMapScales = {
	years: {
		allYears: [],
		minYear: '',
		maxYear: '',
	},
	scales: {
		allScales: [],
		minScale: '',
		maxScale: '',
	},
	setMinMaxYears: function (years) {
		return (
			(this.years.allYears = years),
			(this.years.minYear = years[0]),
			(this.years.maxYear = years[years.length - 1])
		);
	},
	updateYear: function (index, sliderPosition) {
		// console.log(index, sliderPosition);
		// console.log(yearsAndMapScales);
		// console.log(this);
		index === 0
			? (yearsAndMapScales.years.minYear =
					yearsAndMapScales.years.allYears[sliderPosition])
			: (yearsAndMapScales.years.maxYear =
					yearsAndMapScales.years.allYears[sliderPosition]);
		console.log(yearsAndMapScales.years);
		// console.log(this);
		// updateWhereStatement();
	},
	// updateMaxYear: function (sliderPosition) {
	// 	console.log(sliderPosition);
	// 	this.years.maxYear = this.years.allYears[sliderPosition];
	// 	updateWhereStatement();
	// },
	setMinMaxMapScales: function (mapScales) {
		return (
			(this.scales.allScales = mapScales),
			(this.scales.minScale = mapScales[0]),
			(this.scales.maxScale = mapScales[mapScales.length - 1])
		);
	},
	updateScale: function (index, sliderPosition) {
		index === 0
			? (yearsAndMapScales.scales.minScale =
					yearsAndMapScales.scales.allScales[sliderPosition])
			: (yearsAndMapScales.scales.maxScale =
					yearsAndMapScales.scales.allScales[sliderPosition]);
		console.log(yearsAndMapScales.scales);
		// updateWhereStatement();
	},
	updateMaxScale: function (sliderPosition) {
		this.scales.maxScale = this.scales.allScales[sliderPosition];
		updateWhereStatement();
	},
	whereStatement: function () {
		return `year >= ${yearsAndMapScales.years.minYear} AND year <= ${yearsAndMapScales.years.maxYear} AND map_scale >= ${yearsAndMapScales.scales.minScale} AND map_scale <= ${yearsAndMapScales.scales.maxScale}`;
	},
};

// const whereStatement = console.log(where);
// return `year >= ${yearsAndMapScales.years.minYear} AND year <= ${yearsAndMapScales.years.maxYear} AND map_scale >= ${yearsAndMapScales.scales.minScale} AND map_scale <= ${yearsAndMapScales.scales.maxScale}`;

export { yearsAndMapScales };
