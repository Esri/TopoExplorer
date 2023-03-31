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
	max
) => {
	const container = document.getElementById(`${containerId}`);

	container.innerHTML = `
    <div class="sliderHeader">
      <button class="sliderBtn">
        <div class="filterAndSortBtn">${title}:</div>
        <div class="headers">  
        <p>
            <span class="headerSpan">
              ${formatNumbersForSliderHeader(min)}
						</span> 
            - <span class="headerSpan">${formatNumbersForSliderHeader(
							max
						)}</span>
          </p>
        </div>
      </button>
      <div class="sliderElement invisible">
        <div class="dualSliderContainer">
          <div class="slider-group">
            <div class="slider-tracks">
              <div class="slider-foreground">
              </div>
              <div class = "slider-handles">
                <div class="input-track">
                  <input id="min" class="minSlider" type="range" list="" value="0" min="0" max="${
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
          </div>
       </div>
    </div>
  </div>
`;

	const sliderHandles = container.querySelectorAll('input');

	//creating the slider sections on the track. Highlighting the change of slection whn the handles move
	const sliderBar = values
		.map((sections) => {
			return `
	    <div  class="slider-area slider-color" value="${sections}">
        
	    </div>`;
		})
		.join('');

	container.querySelector('.slider-foreground').innerHTML = sliderBar;

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

	const udpdateSliderHeading = (child, value) => {
		container.querySelectorAll(`.sliderBtn span`)[child].innerHTML =
			formatNumbersForSliderHeader(values[value]);
	};

	const addSliderTooltipVisibility = (index) => {
		container.querySelectorAll('.tooltip').forEach((tooltip) => {
			tooltip.classList.add('invisible');
		});
		container.querySelectorAll('.tooltip')[index].classList.remove('invisible');
	};

	const removeSliderToolTipVisibility = (index) => {
		container.querySelectorAll('.tooltip')[index].classList.add('invisible');
	};

	const adjustSliderTrackSelection = () => {
		container.querySelectorAll('.slider-area').forEach((section, index) => {
			if (index < sliderHandles[0].value || index >= sliderHandles[1].value) {
				section.classList.add('slider-transparent');
				section.classList.remove('slider-color');
			} else {
				section.classList.remove('slider-transparent');
				section.classList.add('slider-color');
			}
		});
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
	//updating the color of the selected range AND controling the interaction between the min & max slider handles
	sliderHandles.forEach((input) => {
		input.addEventListener('input', (e) => {
			console.log(e);
			let minRange = parseInt(sliderHandles[0].value);
			let maxRange = parseInt(sliderHandles[1].value);

			//controling the limits of slider handels. Making sure they don't overlap over each other.
			//TODO: I want them to overlap now. how do I do that AND make sure you can access the previously used slider??
			if (minRange >= maxRange) {
				if (e.target.className === 'minSlider') {
					sliderHandles[0].value = maxRange - 1;
				} else {
					sliderHandles[1].value = minRange + 1;
				}
			} else {
				//NOTE: needs a better name
				adjustSliderTrackSelection(e.target, e.target.valueAsNumber);
			}
		});

		input.addEventListener('input', (e) => {
			addSliderTooltipVisibility(e.target.value);
		});

		input.addEventListener('mouseup', (e) => {
			removeSliderToolTipVisibility(e.target.value);
		});
	});

	//Listener that will updating the slider's header and the values
	//Is this a good method?
	container.querySelector('.minSlider').addEventListener('change', (evt) => {
		let minVal = evt.target.value;

		debounceInput(0, minVal);
		udpdateSliderHeading(0, minVal);
	});

	container.querySelector('.maxSlider').addEventListener('change', (evt) => {
		let maxVal = evt.target.value;

		debounceInput(1, maxVal);
		udpdateSliderHeading(1, maxVal);
	});

	//Listener to toggle the slider container visibility
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
