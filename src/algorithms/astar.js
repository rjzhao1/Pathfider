export function astar(grid, startNode, finishNode) {
	const visitedNodesInOrder = [];
	if (!startNode || !finishNode || startNode === finishNode) {
		return false;
	}

	startNode.distance = 0;
	const unvisitedNodes = getAllNodes(grid);
	while (!!unvisitedNodes.length) {
		sortNodeByDistance(unvisitedNodes);
		const closestNode = unvisitedNodes.shift();
		if (closestNode.isWall) continue;
		if (closestNode.distance === Infinity) return visitedNodesInOrder;
		closestNode.isVisited = true;
		visitedNodesInOrder.push(closestNode);
		if (closestNode === finishNode) return visitedNodesInOrder;
		updateUnvisitedNeighbors(closestNode, grid, finishNode);
	}
}

function sortNodeByDistance(unvisitedNodes) {
	unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function getAllNodes(grid) {
	const nodes = [];
	for (const row of grid) {
		for (const node of row) {
			nodes.push(node);
		}
	}
	return nodes;
}

function updateUnvisitedNeighbors(node, grid, finishNode) {
	const neighbors = getUnvisitedNeighbors(node, grid);
	for (const neighbor of neighbors) {
		const newDist =
			manhattanDistance(node, neighbor) +
			manhattanDistance(finishNode, neighbor);
		if (newDist < neighbor.distance) {
			neighbor.distance = newDist;
			neighbor.previousNode = node;
		}
	}
}

function getUnvisitedNeighbors(node, grid) {
	const neighbors = [];
	const { col, row } = node;
	if (row > 0) neighbors.push(grid[row - 1][col]);
	if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
	if (col > 0) neighbors.push(grid[row][col - 1]);
	if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

	return neighbors.filter((neighbors) => !neighbors.isVisited);
}

function manhattanDistance(node1, node2) {
	const row1 = node1.row;
	const col1 = node1.col;
	const row2 = node2.row;
	const col2 = node2.col;
	let x_dist = Math.abs(row2 - row1);
	let y_dist = Math.abs(col2 - col1);
	return x_dist + y_dist;
}

export function getAStarPath(finishNode) {
	const nodesInShortestPathOrder = [];
	let currentNode = finishNode;
	if (currentNode.previousNode != null) {
		while (currentNode !== null) {
			nodesInShortestPathOrder.unshift(currentNode);
			currentNode = currentNode.previousNode;
		}
	}

	return nodesInShortestPathOrder;
}
