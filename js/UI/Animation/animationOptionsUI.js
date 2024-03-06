import { formats } from './animationOptionsSettings.js?v=0.01';

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
	.map((size) => {
		return `
            <div>
              <h4 style='text-align: center;'>${size.format.toUpperCase()}</h4>
              <div class='choice'>
                <div style='width:${size.largeFormatWidth}; height: ${
			size.largeFormatHeight
		};'></div>
                <span>${size.largeFormatSize}</span>
              </div>
              <div class='choice'>
                <div class= 'smallerSize' style='width:${
									size.smallFormatWidth
								}; height: ${size.smallFormatHeight};'></div>
                <span>${size.smallFormatSize}</span>
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
                                  <div class='downloadOptions' style='padding:20px'>
                                    ${downloadOptionsHTML}
                                  </div>
                                  
                                </div>
                              `;

const test = () => closeAnimationBtnHTML;

export { animationLoadingHTML, closeAnimationBtnHTML, test };
