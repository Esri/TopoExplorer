// const findMapsUXText = () => {

//   const findMapsText = `<em>Zoom in to find <br/> historical topo maps...</em>`;

//   renderSidebarUXText(findMapsText)
// }

// const noMapsUXText = () => {
//   const noMapsHelpText = `<em> no maps found</em>`;

//   renderSidebarUXText(noMapsHelpText)
// }

const renderSidebarUXText = (helpText) => {
	document.querySelector('#exploreList').innerHTML = '';
	document.querySelector('#mapsListUxText').classList.remove('invisible');
	document.querySelector('#mapsListUxText').innerHTML = helpText;
};

export { renderSidebarUXText };
