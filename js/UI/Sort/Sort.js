const sortBtn = document.querySelector('.sortOrder');
const sortOptions = sortBtn.querySelector('.sortOptions');
const sortChoices = sortOptions.querySelectorAll('a');

const sortChoice = (callBack) => {
	console.log('sorties');
	sortBtn.addEventListener('click', (event) => {
		console.log('choices');
		document.querySelectorAll('.sliderElement').forEach((filterSlider) => {
			!filterSlider.classList.contains('invisible')
				? filterSlider.classList.add('invisible')
				: null;
		});

		sortOptions.classList.contains('invisible')
			? sortOptions.classList.remove('invisible')
			: sortOptions.classList.add('invisible');
	});

	sortChoices.forEach((choice) => {
		choice.addEventListener('click', (event) => {
			event.stopPropagation();

			sortChoices.forEach((string) => {
				string.classList.remove('bold');
			});

			event.target.classList.add('bold');
			console.log(event);
			console.log(event.target.attributes.value.value);
			callBack(event.target.attributes.value.value);
		});
	});
};

export { sortChoice };
