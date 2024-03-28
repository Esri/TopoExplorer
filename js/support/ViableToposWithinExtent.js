//This function takes two parameters -- an array of topo maps with their extent and the view's extent.
//Creates an area for the topomap and the extent.
//Checks the percentage of area the topo map takes up within the extent
//and if the area of the topomap passes the percentage threshold it is added to the returned array to be processed

const percentageThreshold = 1;

const setExtentArea = (extent) => {
	const extentWidth = extent.ymax - extent.ymin;
	const extentLength = extent.xmax - extent.xmin;
	extentArea = extentWidth * extentLength;
};

let extentArea;

const isEnvelopeWithinExtent = (listOfToposWithEnvelope, extent) => {
	setExtentArea(extent);
	const mapList = listOfToposWithEnvelope.map((topo) => {
		if (
			topo.envelope[0].minX >= extent.xmin &&
			topo.envelope[0].minY >= extent.ymin &&
			topo.envelope[0].maxX <= extent.xmax &&
			topo.envelope[0].maxY <= extent.ymax
		) {
			console.log('all in');
			topo.envelope[0].isWithinExtent = true;
			return createAreaOfTopoAndExtent(topo, extent);
		}
		if (topo.envelope[0].minX < extent.xmin) {
			topo.envelope[0].minX = extent.xmin;
		}
		if (topo.envelope[0].minY < extent.ymin) {
			topo.envelope[0].minY = extent.ymin;
		}
		if (topo.envelope[0].maxX > extent.xmax) {
			topo.envelope[0].maxX = extent.xmax;
		}
		if (topo.envelope[0].maxY > extent.ymax) {
			topo.envelope[0].maxY = extent.ymax;
		}
		topo.envelope[0].isWithinExtent = false;

		return createAreaOfTopoAndExtent(topo, extent);
	});

	return mapList.filter((map) => map !== undefined);
};

const createAreaOfTopoAndExtent = (topo, extent) => {
	const arrayOfVisibleTopos = [];
	if (topo.envelope[0].isWithinExtent) {
		// arrayOfVisibleTopos.push(topo);
		return topo;
	}

	const topoWidth = topo.envelope[0].maxY - topo.envelope[0].minY;
	const topoLength = topo.envelope[0].maxX - topo.envelope[0].minX;
	const topoArea = topoWidth * topoLength;

	const percentOfTopoInExtent = (topoArea / extentArea) * 100;

	if (percentOfTopoInExtent >= percentageThreshold) {
		arrayOfVisibleTopos.push(topo);
		return topo;
	}
};

const generateEnvelopeForTopo = (geometry) => {
	const topoEnvelope = {
		minX: 0,
		minY: 0,
		maxX: 0,
		maxY: 0,
	};

	geometry.map((coordinatePair, index) => {
		if (index === 0) {
			topoEnvelope.minX = coordinatePair[0];
			topoEnvelope.minY = coordinatePair[1];
			topoEnvelope.maxY = coordinatePair[1];
			topoEnvelope.maxX = coordinatePair[0];
			topoEnvelope.isWithinExtent = null;
		}

		if (coordinatePair[0] < topoEnvelope.minX) {
			topoEnvelope.minX = coordinatePair[0];
		}
		if (coordinatePair[1] < topoEnvelope.minY) {
			topoEnvelope.minY = coordinatePair[1];
		}
		if (coordinatePair[0] > topoEnvelope.maxX) {
			topoEnvelope.maxX = coordinatePair[0];
		}
		if (coordinatePair[1] > topoEnvelope.maxY) {
			topoEnvelope.maxY = coordinatePair[1];
		}
	});

	return topoEnvelope;
};

const evaluateItemsBasedOnVisibilityWithinExtent = (
	arrayFromReturnedQuery,
	extent
) => {
	arrayFromReturnedQuery.map((topo) => {
		//topo.envelope is property that will contain the topo's new extent coordinate information
		topo.envelope = null;
		return (topo.envelope = topo.geometry.rings.map((geometry) => {
			return (topo.envelope = generateEnvelopeForTopo(geometry));
			// console.log(envelope);
			//  topo.envelope = envelope;
		}));
	});
	return isEnvelopeWithinExtent(arrayFromReturnedQuery, extent);
};

export {
	generateEnvelopeForTopo,
	isEnvelopeWithinExtent,
	evaluateItemsBasedOnVisibilityWithinExtent,
};
