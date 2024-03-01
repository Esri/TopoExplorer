const animationLoadingHTML = `             
                                      <div style='position: absolute; left:25px; top: 25px;'>
                                        <div style='display: flex;'>
                                          <div class='spinner'>
                                            <calcite-icon class="queryIndicator" icon="spinner" scale="l" aria-hidden="true" calcite-hydrated=""></calcite-icon>
                                          </div>
                                          <div class='animationLoadClose'>
                                            <calcite-icon class="cancelAnimationBtn" icon="x-circle-f" scale="s" aria-hidden="true" calcite-hydrated=""></calcite-icon>
                                          </div>
                                        </div>
                                        <div class='animationWaitText'>Creating Animation</div>
                                      </div>
                              `;

const downloadFormatUI = `
                          <div>
                            <div>
                              <div style='width: ; height: ;' >

                              </div> 
                              <span> maxWidth x maxHeight</span>
                            </div>
                            <div>
                              <div></div>
                              <span>minWidth x minHeight</span>
                            </div>
                          </div>
                        `;

const pixelSizes = [1920, 1080, 720];

const formats = [
	{
		format: 'horizontal',
		largeFormatSize: `${pixelSizes[0]} x ${pixelSizes[1]}`,
		smallFormatSize: `${pixelSizes[1]} x ${pixelSizes[2]}`,
	},
	{
		format: 'square',
		largeFormatSize: `${pixelSizes[1]} x ${pixelSizes[1]}`,
		smallFormatSize: `${pixelSizes[2]} x ${pixelSizes[2]}`,
	},
	{
		format: 'vertical',
		largeFormatSize: `${pixelSizes[1]} x ${pixelSizes[0]}`,
		smallFormatSize: `${pixelSizes[2]} x ${pixelSizes[1]}`,
	},
];

const downloadOptionsHTML = formats
	.map((format) => {
		return `
            <div>
              <h4>${formats.format.toUpperCase()}</h4>
              <div>
                <div style='width: ; height: ;'></div>
                <span>${format.largeFormatSize}</span>
              </div>
              <div>
                <div style='width: ; height: ;'></div>
                <span>${format.smallFormatSize}</span>
              </div>
            </div>
         `;
	})
	.join(' ');

console.log(downloadOptionsHTML);
const closeAnimationBtnHTML = ` 
                                <div class='animationOptionsWrapper'>
                                  <div class='downloadOptions invisible'>
                                    ${downloadOptionsHTML}
                                  </div>
                                  <div style='display: flex; position: absolute; left:25px; top: 25px;'>                             
                                    <div class='closeAnimationBtn' style='text-align: right;'>
                                      <svg width="64" height="64" viewBox="0 0 32 32" >
                                        <path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z"></path>
                                      </svg>
                                    </div>
                                    <div class='downloadAnimationBtn' style='text-align: right;'>
                                      <svg width="64" height="64" viewBox="0 0 32 32" >
                                      <path d="M25 27H8v-1h17zm-3.646-9.646l-.707-.707L17 20.293V5h-1v15.293l-3.646-3.646-.707.707 4.853 4.853z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              `;

console.log('in the Options UI file', closeAnimationBtnHTML);
export { animationLoadingHTML, closeAnimationBtnHTML };
