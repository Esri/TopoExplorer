const initSingleSlider = (values) => {
	//  const container = document.getElementById(`${}`);
	console.log('sliders are sort of being made');
	console.log(values);

	// const sliderHandles = container.querySelectorAll('input');

	const singleSliderHTML = (values) => {
		return `
    <div class="singleSliderContainer">
      <div class="slider-group">
        <div class="slider-tracks">
          <div class="slider-foreground">
            ${sliderBar(values)}
          </div>
            <div class = "slider-handles">
              <div class="input-track">
                <input class="opacitySliderHandle" type="range" list="" value="0" min="0" max="100">
                </input>
              </div>
              <div class="slider-background">
              </div>
            </div>
          </div>
          <datalist class='tickmarks-container'>
            ${sliderOptionsHTMLStr(values)}
          </datalist>
        </div>
      </div>
    </div>
  `;
	};

	//creating the slider sections on the track. Highlighting the change of slection whn the handles move
	const sliderBar = (values) => {
		console.log('foreground');
		console.log(typeof values);

		values
			.map((sections) => {
				console.log(sections);
				return `
	    <div  class="slider-area slider-color" value="${sections}">
	    </div>`;
			})
			.join('');
	};

	// container.querySelector('.slider-foreground').innerHTML = sliderBar;

	//creating ticks for slider
	const sliderOptionsHTMLStr = (values) => {
		console.log('datalist ' + values);
		[values]
			.map((sliderSteps) => {
				return `
      <div class="tick" value='${sliderSteps}'>
			</div>
      `;
			})
			.join('');
	};

	// container.querySelector('.tickmarks-container').innerHTML =
	// 	sliderOptionsHTMLStr;

	console.log(sliderBar(values));
	console.log(sliderOptionsHTMLStr(values));
	console.log(singleSliderHTML(values));
	return singleSliderHTML(values);
};
export { initSingleSlider };
