import { formats, pixelSizes } from './animationOptionsSettings.js?v=0.01';

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

const downloadOptionsHTML = formats
	.map((format) => {
		return `
            <div>
              <h4 style='text-align: center;'>${format.format.toUpperCase()}</h4>
              <div class='choice' style='padding: 10px; display: flex; justify-content: space-evenly'>
                <div style='width:${format.largeFormatWidth}; height: ${
			format.largeFormatHeight
		};'></div>
                <span>${format.largeFormatSize}</span>
              </div>
              <div class='choice' style='padding: 10px; display: flex; justify-content: space-evenly'>
                <div style='width:${format.smallFormatWidth}; height: ${
			format.smallFormatHeight
		};'></div>
                <span>${format.smallFormatSize}</span>
              </div>
            </div>
         `;
	})
	.join(' ');

const closeAnimationBtnHTML = ` 
<div style='display: flex; position: absolute; left:25px; top: 25px; z-index: 2;'>                             
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
<div class='downloadOptionsWrapper invisible'>
                                  <div class='downloadOptions'>
                                    ${downloadOptionsHTML}
                                  </div>
                                  
                                </div>
                              `;

const test = () => closeAnimationBtnHTML;
console.log('in the Options UI file', closeAnimationBtnHTML);
export { animationLoadingHTML, closeAnimationBtnHTML, test };
