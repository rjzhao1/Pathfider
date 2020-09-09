export function dfs(grid, startNode, finishNode) {
	const visitedNodesInOrder = [];
	const nodeQueue = [];
	if (!startNode || !finishNode || startNode === finishNode) {
		return false;
	}
	nodeQueue.unshift(startNode);
	while (!!nodeQueue.length) {
		const currNode = nodeQueue.shift();
		if (currNode === finishNode) return visitedNodesInOrder;
		visitedNodesInOrder.push(currNode);
		currNode.isVisited = true;
		const unvisitedNeighbors = getUnvisitedNeighbor(grid, currNode);

		for (const neighbor of unvisitedNeighbors) {
			if (neighbor.isWall) continue;
			if (neighbor.previousNode === null) {
				neighbor.previousNode = currNode;
			}
			nodeQueue.unshift(neighbor);
		}
	}

	return visitedNodesInOrder;
}

function getUnvisitedNeighbor(grid, node) {
	const neighbors = [];
	const { col, row } = node;
	if (row > 0) neighbors.push(grid[row - 1][col]);
	if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
	if (col > 0) neighbors.push(grid[row][col - 1]);
	if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

	return neighbors.filter((neighbors) => !neighbors.isVisited);
}

export function getDFSPath(finishNode) {
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
