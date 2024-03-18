console.log('modal module');

const livingAtlasURL = 'https://livingatlas.arcgis.com/en/home/';
const USGSTopoMapCollection =
	'https://www.arcgis.com/home/item.html?id=ee19794feeed4e068ba99b2ddcb6c2db';
const topMapExplorerItemPage =
	'https://www.arcgis.com/home/item.html?id=c66fe3e5d16043e4bde748af2e84ecf5';

const information = `<div class='modalBox'> 
                      <div class='modalText'>
                        <div>
                          The <em>Historical Topo Map Explorer</em> is an application provided by Esri's <a href='${livingAtlasURL}' target='_blank'>Living Atlas of the World</a>. It provides an interface into the United States Geological Survey's 
                          <a href='${USGSTopoMapCollection}' target='_blank'>Historical Topographic Map Collection</a>. Explore geographically, and filter by map scale and publication year, to browse over 181,000 maps.
                        </div>
                        <div>
                          Maps can be downloaded as GeoTIFF images to your computer or added to an ArcGIS Online web map. You can do this individually our by pinning a collection of maps and then performing a bulk action.
                        </div>
                        <div>
                          Learn more about the Historical Topo Map Explorer <a href='${topMapExplorerItemPage}' target='_blank'>here</a>.
                        </div> 
                      </div>
                      <div class='modalClose' style='margin: 0 1rem;'>
                      <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32"><path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z"></path></svg>
                      </div>
                      
                    </div> `;

const infoModalBackground = document.createElement('div');
infoModalBackground.classList.add('infoModalBackground');
infoModalBackground.innerHTML = information;

console.log(infoModalBackground);

const displayInfoModal = () => {
	const infoModalWrapper = document.createElement('div');
	infoModalWrapper.classList.add('infoModalWrapper');
	infoModalWrapper.append(infoModalBackground);
	document.querySelector('main').prepend(infoModalWrapper);
};

const removeInfoModal = () => {
	console.log('remove');
	document.querySelector('.infoModalWrapper').remove();
};

export { displayInfoModal, removeInfoModal };
