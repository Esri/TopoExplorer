const allYearChoices = (minMaxYears) => {
	return new Promise((resolve, reject) => {
		let startYear = Math.ceil(minMaxYears[0] / 10) * 10;
		const decadesArr = [minMaxYears[0]];
		while (startYear <= minMaxYears[1]) {
			decadesArr.push(startYear);
			startYear = startYear + 10;
			// console.log(decades);
		}
		decadesArr.push(startYear);

		// console.log(decades);
		resolve(decadesArr);
	});
};

const allScaleChoices = (minMaxScales) => {
	return new Promise((resolve, reject) => {
		let startScale = minMaxScales[1];
		const scalesArr = [];
		while (startScale > minMaxScales[0]) {
			if (startScale === 31250) {
				startScale = 24000;
			} else if (startScale === 12000) {
				startScale = 10000;
			}
			scalesArr.unshift(startScale);
			startScale = startScale / 2;
			// console.log(scalesArr);
		}
		resolve(scalesArr);
	});
};

export { allYearChoices, allScaleChoices };
