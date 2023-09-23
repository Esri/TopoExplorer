const formatSliderNumbers = (numbers) => {
	return numbers.toString().length > 4
		? numbers.toString().slice(0, -3) + 'k'
		: numbers.toString();
};

const formatNumbersForSliderHeader = (numbers) => {
	return numbers.toString().length > 4
		? '1:' + numbers.toString().slice(0, -3) + 'k'
		: numbers.toString();
};

const initDualSlider = (
	containerId,
	title,
	onChangeHandler,
	values,
	min,
	max,
	view
) => {
	const container = document.getElementById(`${containerId}`);
	//NOTE: I'm using an 'ondragstart' attribute to stop any drag events on that element. I'm using it to try and solve a bug. if this DOES work, I should implement this attribute more responsibly.
	container.innerHTML = `
    <div class="sliderHeader">
      <button class="sliderBtn">
        <div class="filterAndSortBtn">${title}:</div>
        <div class="headers">  
        <p>
            <span class="headerSpan">
              ${formatNumbersForSliderHeader(min)}
						</span> 
            - <span class="headerSpan">${formatNumbersForSliderHeader(max)}
            </span>
            <span class="tooltipText hidden">Zoom in to see this ${title
							.substring(0, title.length - 1)
							.toLowerCase()}</span>
          </p>
        </div>
      </button>
      <div class="sliderElement invisible">
        <div class="dualSliderContainer">
          <div class="slider-group" ondragstart="return false;">
            <div class="slider-tracks inputs">
            <div class="clickable-track inputs"></div>
            <div class="slider-foreground inputs">
              </div>
              <div class="slider-handles">
                <div class="input-track">
                  <input class="minSlider" type="range" list="" value="0" min="0" max="${
										values.length - 1
									}">
                  </input>
                  <input class="maxSlider" type="range" value="${
										values.length - 1
									}" min="0" max="${values.length - 1}"/>
                </div>
                <div class="slider-background"></div>
              </div>
            </div>
            <datalist class='tickmarks-container'>
            </datalist>
            <div class="sliderNumbers">
              <span class="minSliderValue">${formatSliderNumbers(min)}</span>
              <span class="maxSliderValue">${formatSliderNumbers(max)}</span>
            </div>
            <div class='zoomInHelpText hidden'>
                  Zoom in to see this ${title
										.substring(0, title.length - 1)
										.toLowerCase()}
            </div>
          </div>
       </div>
    </div>
  </div>
`;

	const zoomDependentSelections = () => {
		console.log(view.zoom);
		if (view.zoom == 4) {
			return values.length - 1;
		}
		if (view.zoom == 5 || view.zoom == 6) {
			console.log(view.zoom);
			return values.length - 2;
		}
		if (view.zoom == 7 || view.zoom == 8) {
			return values.length - 3;
		}
		if (view.zoom >= 9) {
			//because the array is
			return -1;
		}
	};

	const isScaleValueWithinAvailableRange = (handle, value) => {
		const maxScaleChoice = sliderComponents.querySelector('.maxSlider').value;
		const minScaleChoice = sliderComponents.querySelector('.minSlider').value;

		let isAvailable = false;
		if (value < zoomDependentSelections()) {
			isAvailable = false;
			udpdateSliderHeading(handle, value, isAvailable);
			// debounceInput(handle, value);
		} else {
			isAvailable = true;
			udpdateSliderHeading(handle, value, isAvailable);
			debounceInput(handle, value);
		}

		if (
			minScaleChoice < zoomDependentSelections() &&
			maxScaleChoice < zoomDependentSelections()
		) {
			const noMapsText = `<div class='helpText'>
      Change your map extent,
      or adjust filter selections,
      to find topo maps.
      </div>
      `;
			document.querySelector('.mapCount').innerHTML = 0;
			document.querySelector('#exploreList').innerHTML = noMapsText;
		}
	};

	const sliderComponents = container.querySelector('.inputs');

	//creating the slider sections on the track. Highlighting the change of slection whn the handles move
	const sliderBar = values
		.map((sections) => {
			return `
	    <div  class="slider-area slider-color" value="${sections}">
        
	    </div>`;
		})
		.join('');

	const testBar = values
		.map((sections, index) => {
			return `
	    <div  class="clickable" value="${index}">
        
	    </div>`;
		})
		.join('');

	container.querySelector('.slider-foreground').innerHTML = sliderBar;
	container.querySelector('.clickable-track').innerHTML = testBar;

	//creating ticks for slider
	const sliderOptionsHTMLStr = values
		.map((sliderSteps) => {
			return `
      <div class="tick" value='${sliderSteps}'>
        <output class="tooltip invisible">${formatSliderNumbers(
					sliderSteps
				)}</output>

			</div>
      `;
		})
		.join('');

	container.querySelector('.tickmarks-container').innerHTML =
		sliderOptionsHTMLStr;

	//This querySelector finds the minValue for the Scale slider's header and adds a transparency effect to it. Because the initial value is outside the available range.
	//I'm not a big fan of implementing this kind of solution, but I needed something quick at the moment.
	if (container.querySelectorAll('#scales .sliderBtn span')[0]) {
		container
			.querySelectorAll('#scales .sliderBtn span')[0]
			.classList.add('transparency');
	}

	const udpdateSliderHeading = (child, value, isAvailable) => {
		const headerSpan = container.querySelectorAll(`.sliderBtn span`)[child];
		const headerSpanWithOpacity = headerSpan.classList.contains('transparency');
		headerSpan.innerHTML = formatNumbersForSliderHeader(values[value]);

		if (isAvailable) {
			headerSpan.classList.remove('transparency');
		} else {
			headerSpan.classList.add('transparency');
		}
	};

	const addSliderTooltipVisibility = (index) => {
		container.querySelectorAll('.tooltip').forEach((tooltip) => {
			tooltip.classList.add('invisible');
		});
		container.querySelectorAll('.tooltip')[index].classList.remove('invisible');
	};

	const removeSliderToolTipVisibility = () => {
		container.querySelectorAll('.tooltip').forEach((tooltip) => {
			// console.log(tooltip);
			if (!tooltip.classList.contains('invisible')) {
				tooltip.classList.add('invisible');
			}
		});
	};

	const adjustSliderTrackSelection = () => {
		container.querySelectorAll('.slider-area').forEach((section, index) => {
			if (index < minRangeHandle.value || index >= maxRangeHandle.value) {
				section.classList.add('slider-transparent');
				section.classList.remove('slider-color');
			} else {
				section.classList.remove('slider-transparent');
				section.classList.add('slider-color');
			}
		});
	};

	const unavailbleScalesToolTip = (value) => {
		const zoomInHelpTextElement = document.querySelector(
			'#scales .zoomInHelpText'
		);
		if (value < zoomDependentSelections()) {
			zoomInHelpTextElement.classList.remove('hidden');
		} else {
			zoomInHelpTextElement.classList.add('hidden');
		}
	};

	//Debounce
	const debounce = (func, wait) => {
		let timer;

		return (...args) => {
			clearTimeout(timer);

			return new Promise((resolve) => {
				timer = setTimeout(() => resolve(func(...args)), wait);
			});
		};
	};

	//The time for the debounce
	const debounceInput = debounce(
		(index, value) => onChangeHandler(index, value),
		1100
	);

	//ADDING EVENT LISTENERS
	const minRangeHandle = sliderComponents.querySelector('.minSlider');
	const maxRangeHandle = sliderComponents.querySelector('.maxSlider');
	let isSelecting = false;

	window.addEventListener('mouseup', () => {
		if (isSelecting) {
			isSelecting = false;
			removeSliderToolTipVisibility();
		}
	});

	sliderComponents.querySelectorAll('input').forEach((input) => {
		//updating the color of the selected range AND controling the interaction between the min & max slider handles

		input.addEventListener('input', (e) => {
			let minRange = parseInt(minRangeHandle.value);
			let maxRange = parseInt(maxRangeHandle.value);

			//TODO: I want them to overlap now. how do I do that AND make sure you can access the previously used slider??
			//TODO: That's done, but now I need the sliders to recognize which handle is getting pulled when they overlap each other

			//note: there is a 'change' event listener that is resetting the values.making this not work
			// if (maxRange < minRange) {
			// 	console.log('max lower than min');
			// 	debounceInput(0, maxRangeHandle.value);
			// 	debounceInput(1, minRangeHandle.value);
			// 	udpdateSliderHeading(0, maxRangeHandle.value, true);
			// 	udpdateSliderHeading(1, minRangeHandle.value, true);
			// 	return;
			// }

			if (minRange >= maxRange) {
				if (e.target.className === 'minSlider') {
					minRangeHandle.value = maxRange;
				} else {
					maxRangeHandle.value = minRange;
				}
			}

			// if (maxRange < minRange) {
			// 	console.log('max lower than min');
			// 	console.log(e.target.value);
			// 	minRangeHandle.value = maxRange;
			// 	console.log(maxRange);
			// 	console.log(minRangeHandle);
			// }

			// if (minRange >= maxRange && e.target.classList.contains('maxSlider')) {
			// 	console.log('testing slider overlap');
			// 	console.log(e.target);
			// 	console.log('minRange', minRange);
			// 	console.log('minRangeHandle', minRangeHandle);
			// 	// maxRangeHandle.value = placeholder;
			// 	if (e.target.valueAsNumber < minRange) {
			// 		console.log('moving the min away on overlap');
			// 		minRangeHandle.value = e.target.valueAsNumber;
			// 		maxRangeHandle.value = placeholder;
			// 	}
			// else if (e.target.value > maxRange) {
			// 	console.log('moving the MAX on overlap');
			// 	maxRangeHandle.value = e.target.value;
			// }
			// }

			if (e.target.closest('#scales')) {
				unavailbleScalesToolTip(e.target.valueAsNumber);
			}

			// else {
			//NOTE: needs a better name
			adjustSliderTrackSelection(e.target, e.target.valueAsNumber);
			// }
		});

		//adding a 'change' event listener for ONLY the '#scales' slider
		// if (input.closest('#scales')) {
		// 	input.addEventListener('change', (e) => {
		// 		console.log('scale slider changin');
		// 		console.log('this is a scales handle');
		// 		zoomDependentSelections(view);
		// 	});
		// }
		input.addEventListener('input', (e) => {
			// console.log(e);
			addSliderTooltipVisibility(e.target.value);
		});

		input.addEventListener('mouseup', (e) => {
			removeSliderToolTipVisibility();
		});

		// input.addEventListener('mousedown', (e) => {
		// 	console.log('click', e);
		// 	console.log(e.target.attributes.value.nodeType);
		// 	minRangeHandle.value = e.target.attributes.value.value;
		// });
	});

	sliderComponents.querySelectorAll('.clickable').forEach((area) => {
		area.addEventListener('click', (e) => {
			let currentSelection = e.target.attributes.value.value;

			let minHandleDiffernce = Math.abs(
				currentSelection - minRangeHandle.value
			);
			let maxHandleDiffernce = Math.abs(
				currentSelection - maxRangeHandle.value
			);

			if (minHandleDiffernce === maxHandleDiffernce) {
				console.log();
				if (currentSelection - maxRangeHandle.value > 0) {
					console.log(currentSelection - maxRangeHandle.value > 0);
					console.log('max should move');
					maxRangeHandle.value = currentSelection;
					adjustSliderTrackSelection(maxRangeHandle, maxRangeHandle.value);

					if (e.target.closest('#scales')) {
						isScaleValueWithinAvailableRange(1, maxRangeHandle.value);
						unavailbleScalesToolTip(minRangeHandle.value);
						return;
					}

					debounceInput(1, maxRangeHandle.value);
					udpdateSliderHeading(1, maxRangeHandle.value, true);
					return;
				}

				if (currentSelection - minRangeHandle.value < 0) {
					console.log(currentSelection - minRangeHandle.value < 0);
					console.log('min should move');
					minRangeHandle.value = currentSelection;
					adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
					if (e.target.closest('#scales')) {
						isScaleValueWithinAvailableRange(0, minRangeHandle.value);
						unavailbleScalesToolTip(minRangeHandle.value);
						return;
					}

					debounceInput(0, minRangeHandle.value);
					udpdateSliderHeading(0, minRangeHandle.value, true);
					return;
				}

				//if these handles are not overlapping move the minimum handle
				minRangeHandle.value = currentSelection;
				adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
				if (e.target.closest('#scales')) {
					isScaleValueWithinAvailableRange(0, minRangeHandle.value);
					unavailbleScalesToolTip(minRangeHandle.value);
					return;
				}

				debounceInput(0, minRangeHandle.value);
				udpdateSliderHeading(0, minRangeHandle.value, true);

				return;
			}

			if (
				currentSelection < minRangeHandle.value &&
				minHandleDiffernce < maxHandleDiffernce
			) {
				minRangeHandle.value = currentSelection;
				adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
				if (e.target.closest('#scales')) {
					isScaleValueWithinAvailableRange(0, minRangeHandle.value);
					unavailbleScalesToolTip(minRangeHandle.value);
					return;
				}

				debounceInput(0, minRangeHandle.value);
				udpdateSliderHeading(0, minRangeHandle.value, true);
			}

			if (
				currentSelection > maxRangeHandle.value &&
				minHandleDiffernce > maxHandleDiffernce
			) {
				maxRangeHandle.value = currentSelection;
				adjustSliderTrackSelection(maxRangeHandle, maxRangeHandle.value);
				if (e.target.closest('#scales')) {
					isScaleValueWithinAvailableRange(1, maxRangeHandle.value);
					unavailbleScalesToolTip(maxRangeHandle.value);
					return;
				}

				debounceInput(1, maxRangeHandle.value);
				udpdateSliderHeading(1, maxRangeHandle.value, true);
			}

			if (
				currentSelection > minRangeHandle.value &&
				minHandleDiffernce < maxHandleDiffernce
			) {
				minRangeHandle.value = currentSelection;
				adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);
				if (e.target.closest('#scales')) {
					isScaleValueWithinAvailableRange(0, minRangeHandle.value);
					unavailbleScalesToolTip(minRangeHandle.value);
					return;
				}

				debounceInput(0, minRangeHandle.value);
				udpdateSliderHeading(0, minRangeHandle.value, true);
			}

			if (
				currentSelection < maxRangeHandle.value &&
				minHandleDiffernce > maxHandleDiffernce
			) {
				maxRangeHandle.value = currentSelection;
				adjustSliderTrackSelection(maxRangeHandle, maxRangeHandle.value);
				if (e.target.closest('#scales')) {
					isScaleValueWithinAvailableRange(1, maxRangeHandle.value);
					unavailbleScalesToolTip(maxRangeHandle.value);
					return;
				}

				debounceInput(1, maxRangeHandle.value);
				udpdateSliderHeading(1, maxRangeHandle.value, true);
			}

			// if (minHandleDiffernce <= maxHandleDiffernce) {
			// 	minRangeHandle.value = currentSelection;
			// 	adjustSliderTrackSelection(minRangeHandle, minRangeHandle.value);

			// 	if (e.target.closest('#scales')) {
			// 		isScaleValueWithinAvailableRange(0, minRangeHandle.value);
			// 		unavailbleScalesToolTip(minRangeHandle.value);
			// 		return;
			// 	}

			// 	debounceInput(0, minRangeHandle.value);
			// 	udpdateSliderHeading(0, minRangeHandle.value, true);
			// } else {
			// 	maxRangeHandle.value = currentSelection;
			// 	adjustSliderTrackSelection(maxRangeHandle, maxRangeHandle.value);

			// 	if (e.target.closest('#scales')) {
			// 		console.log('clickable for scales only');
			// 		isScaleValueWithinAvailableRange(1, maxRangeHandle.value);
			// 		unavailbleScalesToolTip(minRangeHandle.value);
			// 		return;
			// 	}

			// 	debounceInput(1, maxRangeHandle.value);
			// 	udpdateSliderHeading(1, maxRangeHandle.value, true);
			// }
		});
	});

	//Listener that will updating the slider's header and the values
	container.querySelector('.minSlider').addEventListener('change', (event) => {
		let minVal = event.target.value;
		let sliderHandle;

		sliderHandle = 0;

		if (event.target.closest('#scales')) {
			isScaleValueWithinAvailableRange(sliderHandle, minVal);

			return;
		}
		debounceInput(0, minVal);
		udpdateSliderHeading(0, minVal, true);
	});

	container.querySelector('.maxSlider').addEventListener('change', (event) => {
		let maxVal = event.target.value;
		let sliderHandle = 1;

		if (event.target.closest('#scales')) {
			isScaleValueWithinAvailableRange(sliderHandle, maxVal);

			return;
		}

		debounceInput(1, maxVal);
		udpdateSliderHeading(1, maxVal, true);
	});

	//Listener to toggle the slider container and sort choice container visibility
	container.querySelector(`button`).addEventListener('click', () => {
		container.querySelector(`.sliderElement`).classList.contains('invisible')
			? (document
					.querySelectorAll(`.sliderElement`)
					.forEach((slideContainer) => {
						slideContainer.classList.add('invisible');
					}),
			  container.querySelector(`.sliderElement`).classList.remove('invisible'))
			: document
					.querySelectorAll(`.sliderElement`)
					.forEach((slideContainer) => {
						slideContainer.classList.add('invisible');
					});
	});

	window.addEventListener('click', (e) => {
		if (e.target.closest('.filter')) {
			null;
		} else if (!e.target.closest('.sliderElement')) {
			document.querySelectorAll(`.sliderElement`).forEach((slideContainer) => {
				!slideContainer.classList.contains('invisible')
					? slideContainer.classList.add('invisible')
					: null;
			});
		}
	});
};

export { initDualSlider };
