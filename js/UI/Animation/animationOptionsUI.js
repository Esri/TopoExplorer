/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { formats } from './animationOptionsSettings.js?v=0.03';
import { setAnimationDimensions } from './AnimationControl.js?v=0.03';

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
            <div class='choiceGroup'>
              <h4  class='orientation' style='text-align: center;'>${size.format.toUpperCase()}</h4>
              ${
								size.format.includes('square')
									? `<div class='choice'>
										<div
											style='width:${size.largeFormatWidth}; height: ${size.largeFormatHeight};'
										></div>
										<a>${size.largeFormatSize}</a>
									</div>`
									: ''
							}
             
              
                
              <div class='choice'>
                <div class= 'smallerSize' style='width:${
									size.smallFormatWidth
								}; height: ${size.smallFormatHeight};'></div>
                <a>${size.smallFormatSize}</a>
              </div>
            </div>
         `;
	})
	.join(' ');

const downloadAnimationElement = () => {
	if (
		window.location.host.includes('arcgis.com') ||
		window.location.host.includes('esri.com')
	) {
		return `
    <div class='downloadAnimationBtn' style='text-align: right;'>
                                      <svg width="64" height="64" viewBox="0 0 32 32" >
                                      <path d="M25 27H8v-1h17zm-3.646-9.646l-.707-.707L17 20.293V5h-1v15.293l-3.646-3.646-.707.707 4.853 4.853z"></path>
                                      </svg>
                                    </div>
                                  </div>                                
<div class='downloadOptionsWrapper invisible'>
                                  <div class='downloadOptions' style='padding:10px'>
                                    ${downloadOptionsHTML}
                                    <div style='padding 1rem 0 0'>
                                      <label for"animation-title" style='font-size:0.9rem;'> <em>Optional title (45 character max)</em> </label>
                                      <input class='animation-title' id='animation-title' type='text' placeholder='Topo Map Explorer' minlength="0" maxlength="45"/>
                                    </div>
                                  </div>
                                </div>
                                `;
	}
	return ``;
};

const closeAnimationBtnHTML = ` 
<div style='display: flex; position: absolute; left:25px; top: 25px; z-index: 2;'>                             
                                    <div class='closeAnimationBtn' style='text-align: right;'>
                                      <svg width="64" height="64" viewBox="0 0 32 32" >
                                        <path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z"></path>
                                      </svg>
                                    </div>                                   
${downloadAnimationElement()}

                              `;

const animationDownloadAspectRatioPreviewElement = `
                                                    <div class='downloadPreview'>
                                                     <div class='invisible' style="width: 1920px; height: 1080px; box-shadow: rgba(0, 0, 0, 0.8) 0px 0px 0px 9999px;"></div>
                                                    </div>
                                                    `;

const creatingDownloadHTML = `
                              <div>
                                <div style = 'display:flex;' > 
                                <div class='downloadIndicator flex'>
                                  <span class='spinner'>
                                    <calcite-icon class="queryIndicator" icon="spinner" scale="l" aria-hidden="true" calcite-hydrated=""></calcite-icon>
                                  </span>
                                  <div>...creating mp4.</div>
                                  <a class='invisible'>Cancel</a>
                                  </div>
                                </div>
                              </div>
                             `;

const downloadCancelMessageHTML = `
                                  <span>Creation of MP4 file Cancelled.</span>
                              `;

const downloadAbortMessage = `
                            <span> MP4 export aborted due to window resize. </span>
                            `;

const findAspectRatio = (dimension) => {
	let newWidth;
	let newHeight;
	//this function receives a value for width and a value for height, then adjusts the size of mapView
	//dimensions to create a preview for the download area that reflects the aspect ratio from the given dimensions.

	const widthOfSideBar = 400;
	const mapViewWidth = window.innerWidth - widthOfSideBar;
	const mapViewHeight = window.innerHeight;
	const previewHighlight = document.querySelector('.downloadPreview div').style;

	//parse the values of the potential download's width & height from the download options' UI into an array
	const previewDimensions = dimension.split(' x ');
	const previewWidth = parseInt(previewDimensions[0]);
	const previewHeight = parseInt(previewDimensions[1]);
	const aspectRatio = previewWidth / previewHeight;

	//determine the width and height of the MP4 based on the aspect ratio
	newHeight = mapViewHeight;
	newWidth = mapViewHeight * aspectRatio;

	if (newWidth > mapViewWidth) {
		newWidth = mapViewWidth;
		newHeight = mapViewWidth * (1 / aspectRatio);
	}

	previewHighlight.width = `${newWidth}px`;
	previewHighlight.height = `${newHeight}px`;

	return setAnimationDimensions(previewWidth, previewHeight);
};
export {
	animationLoadingHTML,
	closeAnimationBtnHTML,
	animationDownloadAspectRatioPreviewElement,
	creatingDownloadHTML,
	downloadCancelMessageHTML,
	downloadAbortMessage,
	findAspectRatio,
};
