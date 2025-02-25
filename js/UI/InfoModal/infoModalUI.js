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

import { appConfig } from '../../../app-config.js?v=0.03';

const USGSTopoMapCollection =
	'https://www.arcgis.com/home/item.html?id=ee19794feeed4e068ba99b2ddcb6c2db';
const topMapExplorerItemPage =
	'https://www.arcgis.com/home/item.html?id=c66fe3e5d16043e4bde748af2e84ecf5';
const appEmail = 'topoexplorer@esri.com';

const modalInfoText = `<div>
                          <div>
                            About the USGS Historical Topo Map Collection and Explorer
                          </div>
                          <div>
                          The US Geological Survey (USGS) and Esri collaborated to bring the ever-increasing collection of US historical topographic maps to everyone through the Historical Topo Map Explorer. This app, now in its second generation, brings to life more than 180,000 maps dating from 1882 to 2006. Previously available only as printed lithographic copies, the legacy quadrangles are now available as web-viewable images and free, downloadable digital files. The Historical Topo Map Explorer allows users to explore the historical maps, save the current view as a web map, and download the maps as high-resolution georeferenced images in GeoTIFF format for use in web mapping applications and GIS. Learn more about the app in the <a href="${topMapExplorerItemPage}" target="_blank">item description</a> on ArcGIS Online.
                          </br>
                          </br>
                          The historical maps are part of the USGS Historical Topographic Map Collection ― a project that was launched in 2011. The collection includes all scales and all editions of the topographic maps published by the USGS since the inception of the topographic mapping program in 1879. The maps have been prepared at scales ranging from 1:10,000 to 1:250,000. Some scales have broad coverage across the United States, while others may have only one map.
                          </div>
                          <div>
                          The USGS scanned each map as is to capture the content and condition of each map sheet. All maps were georeferenced, and metadata was captured as part of the process. Using ArcGIS, the scanned maps comprise the USGS Historical Topographic Maps image service, which can be viewed on the web and provides links to allow users to download individual scanned images. Learn more about the image service in the <a href = '${USGSTopoMapCollection}' target="_blank">item description</a> in ArcGIS Online.
                          </br>
                          </br>
                          <em>
                          "We are so pleased to see these historic topographic maps being made more accessible to the nation," said Kevin Gallagher, associate director of Core Science Systems for the USGS. "We recognize the fundamental role of government in acquiring mapping information and putting it in the public domain. At the same time, we recognize the tremendous benefits of the private industry adding value through innovative approaches to access and distribution."                          
                          </em>
                          </div>
                          <div>
                          How to use the Historical Topo Map Explorer:
                            <div>
                            <ul style="margin 0 0 0 5%">
                            <li>
                              Navigate to your location of interest and click on the map view to see which USGS maps are available in that area.
                            </li>
                            </br>
                            <li>
                              Use the timeline list on the left to explore the names, dates, and thumbnails of the topo maps. Mouse over the list to see geographic extents. Click a topo map to add it to the map.
                            </li>
                            </br>
                            <li>
                            	Pin maps to create a collection of topographic maps for bulk download, web map creation, or animation.
                            </li>
                            </br>
                            	Once logged in to your ArcGIS Online account, you can create a web map that includes the historical maps you have pinned.
                            </ul>
                            
                            </div>
                          </div>
                          <div>
                          The USGS published <a href ="https://www.usgs.gov/faqs/where-can-i-find-topographic-map-symbol-sheet" target="_blank">these symbol keys</a> to help you identify the symbols used on their topographic maps.
                          </br>
                          </br>
                          <em>
                          "We are pleased to partner with the USGS on this app to bring this national treasure to life," said Jack Dangermond, president of Esri. "This application provides an easy way for anyone to explore the historic map collection by both place and time. The ArcGIS platform supports the building and sharing of amazing maps and content such as this collection."
                          </em>
                          </div>

                        <div> Please contact us at <a href="mailto:${appEmail}" target="_blank">${appEmail}</a> with your questions or comments about the map collection or the online app.</div> 
                      </div>`;

const information = `<div class='modalBox'> 
<div style='margin: 0 1rem; text-align: right;'>
  <div>
    <svg class='modalClose' xmlns="http://www.w3.org/2000/svg" height="32" width="32"><path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z"></path></svg>
  </div>
</div>
                      <div class='modalText'>
                        ${appConfig.informationParagraph || modalInfoText}
                      </div>
                      
                    </div> `;

const infoModalBackground = document.createElement('div');
infoModalBackground.classList.add('infoModalBackground');
infoModalBackground.innerHTML = information;

const displayInfoModal = () => {
	const infoModalWrapper = document.createElement('div');
	infoModalWrapper.classList.add('infoModalWrapper');
	infoModalWrapper.append(infoModalBackground);
	document.querySelector('main').prepend(infoModalWrapper);
};

const removeInfoModal = () => {
	document.querySelector('.infoModalWrapper').remove();
};

export { displayInfoModal, removeInfoModal };
