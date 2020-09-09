import React, { Component } from 'react';
import Node from './Node/Node';
import './PathfindingVisualizer.css';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { dfs, getDFSPath } from '../algorithms/dfs';
import { bfs, getBFSPath } from '../algorithms/bfs';
import { astar, getAStarPath } from '../algorithms/astar';
export default class PathfindingVisualizer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			grid: [],
			mouseIsPressed: false,
			start_row: null,
			start_col: null,
			fin_row: null,
			fin_col: null,
			set_start: false,
			set_end: false,
			inAnimation: false,
		};
	}

	componentDidMount() {
		const grid = getInitialGrid();
		this.setState({ grid });
	}

	animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
		this.clearPath();
		this.setState({ set_end: false, set_start: false, inAnimation: true });
		for (let i = 0; i <= visitedNodesInOrder.length; i++) {
			if (i === visitedNodesInOrder.length) {
				setTimeout(() => {
					this.animatePath(nodesInShortestPathOrder);
				}, 20 * i);
				this.setState({ inAnimation: false });
				return;
			}

			setTimeout(() => {
				const node = visitedNodesInOrder[i];
				document.getElementById(`node-${node.row}-${node.col}`).className =
					'node node-visited';
			}, 20 * i);
		}
	}

	animatePath(nodesInShortestPathOrder) {
		for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
			setTimeout(() => {
				const node = nodesInShortestPathOrder[i];
				document.getElementById(`node-${node.row}-${node.col}`).className =
					'node node-shortest-path';
			}, 50 * i);
		}
	}

	toggleOff() {
		this.setState({ set_start: false, set_end: false });
	}
	visualizeDijkstra() {
		const { grid, start_row, start_col, fin_row, fin_col } = this.state;
		if (
			start_row != null &&
			start_col != null &&
			fin_row != null &&
			fin_col != null
		) {
			const startNode = grid[start_row][start_col];
			const finishNode = grid[fin_row][fin_col];
			const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
			const nodesInShortestPathOrder = getNodesInShortestPathOrder(
				finishNode
			);
			this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
		}
	}

	visualizeDFS() {
		const { grid, start_row, start_col, fin_row, fin_col } = this.state;
		if (
			start_row != null &&
			start_col != null &&
			fin_row != null &&
			fin_col != null
		) {
			const startNode = grid[start_row][start_col];
			const finishNode = grid[fin_row][fin_col];
			const visitedNodesInOrder = dfs(grid, startNode, finishNode);
			const nodesInDFSPathOrder = getDFSPath(finishNode);
			this.animateAlgorithm(visitedNodesInOrder, nodesInDFSPathOrder);
		}
	}

	visualizeBFS() {
		const { grid, start_row, start_col, fin_row, fin_col } = this.state;
		if (
			start_row != null &&
			start_col != null &&
			fin_row != null &&
			fin_col != null
		) {
			const startNode = grid[start_row][start_col];
			const finishNode = grid[fin_row][fin_col];
			const visitedNodesInOrder = bfs(grid, startNode, finishNode);
			const nodesInBFSPathOrder = getBFSPath(finishNode);
			this.animateAlgorithm(visitedNodesInOrder, nodesInBFSPathOrder);
		}
	}

	visualizeAStar() {
		const { grid, start_row, start_col, fin_row, fin_col } = this.state;
		if (
			start_row != null &&
			start_col != null &&
			fin_row != null &&
			fin_col != null
		) {
			const startNode = grid[start_row][start_col];
			const finishNode = grid[fin_row][fin_col];
			const visitedNodesInOrder = astar(grid, startNode, finishNode);
			const nodesInAStarPathOrder = getAStarPath(finishNode);
			this.animateAlgorithm(visitedNodesInOrder, nodesInAStarPathOrder);
		}
	}

	handleMouseDown(row, col) {
		const { set_start, set_end, inAnimation } = this.state;
		if (!inAnimation) {
			if (set_start) {
				const newGrid = setStartNode(this.state.grid, row, col);
				this.setState({ grid: newGrid, start_row: row, start_col: col });
			} else if (set_end) {
				const newGrid = setEndNode(this.state.grid, row, col);
				this.setState({ grid: newGrid, fin_row: row, fin_col: col });
			} else {
				const newGrid = getNewGridWithWallToggled(
					this.state.grid,
					row,
					col
				);
				this.setState({ grid: newGrid, mouseIsPressed: true });
			}
		}
	}

	handleMouseEnter(row, col) {
		if (!this.state.mouseIsPressed) return;
		const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
		this.setState({ grid: newGrid });
	}

	handleMouseUp() {
		this.setState({ mouseIsPressed: false });
	}

	toggleStart() {
		const { set_start } = this.state;
		this.setState({ set_start: !set_start, set_end: false, is_wall: false });
	}

	toggleEnd() {
		const { set_end } = this.state;
		this.setState(
			{ set_start: false, set_end: !set_end, is_wall: false },
			() => this.forceUpdate()
		);
	}

	clearBoard() {
		const grid = getInitialGrid();
		for (const row of grid) {
			for (const node of row) {
				document.getElementById(`node-${node.row}-${node.col}`).className =
					'node';
			}
		}
		this.setState({
			grid,
			mouseIsPressed: false,
			start_row: null,
			start_col: null,
			fin_row: null,
			fin_col: null,
			set_start: false,
			set_end: false,
		});
	}

	clearPath() {
		const { grid } = this.state;
		for (const row of grid) {
			for (const node of row) {
				node.isVisited = false;
				node.previousNode = null;
				node.isAddedToQueue = false;
				node.distance = Infinity;
				if (!node.isStart && !node.isWall && !node.isFinish) {
					document.getElementById(
						`node-${node.row}-${node.col}`
					).className = 'node';
				}
				if (node.isFinish) {
					document.getElementById(
						`node-${node.row}-${node.col}`
					).className = 'node node-finish';
				}
			}
		}
	}

	render() {
		const { grid, mouseIsPressed } = this.state;

		return (
			<>
				<nav className="NavbarItems">
					<h1 className="navbar-logo">
						PathFinder <i className="fas fa-road"></i>
					</h1>

					<button
						className="nav-button"
						onClick={() => this.visualizeDijkstra()}
					>
						Visualize Dijkstra
					</button>
					<button
						className="nav-button"
						onClick={() => this.visualizeDFS()}
					>
						Visualize Depth First Search
					</button>
					<button
						className="nav-button"
						onClick={() => this.visualizeBFS()}
					>
						Visualize Breath First Search
					</button>
					<button
						className="nav-button"
						onClick={() => this.visualizeAStar()}
					>
						Visualize A*
					</button>
					<button
						className="nav-button"
						onClick={() => this.toggleStart()}
					>
						Set Start Point
					</button>
					<button className="nav-button" onClick={() => this.toggleEnd()}>
						Set End Point
					</button>
					<button className="nav-button" onClick={() => this.toggleOff()}>
						Set Wall
					</button>
					<button className="nav-button" onClick={() => this.clearBoard()}>
						Clear
					</button>
				</nav>

				<div className="grid">
					{grid.map((row, rowIdx) => {
						return (
							<div key={rowIdx}>
								{row.map((node, nodeIdx) => {
									const {
										isStart,
										isFinish,
										isVisited,
										isWall,
										row,
										col,
									} = node;
									return (
										<Node
											key={nodeIdx}
											isStart={isStart}
											isFinish={isFinish}
											isVisited={isVisited}
											isWall={isWall}
											row={row}
											col={col}
											mouseIsPressed={mouseIsPressed}
											onMouseDown={(row, col) =>
												this.handleMouseDown(row, col)
											}
											onMouseEnter={(row, col) =>
												this.handleMouseEnter(row, col)
											}
											onMouseUp={() => this.handleMouseUp()}
										></Node>
									);
								})}
							</div>
						);
					})}
				</div>
			</>
		);
	}
}

const getInitialGrid = () => {
	const grid = [];
	for (let row = 0; row < 20; row++) {
		const curr_row = [];
		for (let col = 0; col < 50; col++) {
			curr_row.push(createNode(row, col));
		}
		grid.push(curr_row);
	}
	return grid;
};
const createNode = (row, col) => {
	return {
		row,
		col,
		isStart: false,
		isFinish: false,
		distance: Infinity,
		isVisited: false,
		isWall: false,
		isAddedToQueue: false,
		previousNode: null,
	};
};

const getNewGridWithWallToggled = (grid, row, col) => {
	const newGrid = grid.slice();
	const node = newGrid[row][col];
	if (!node.isStart && !node.isFinish) {
		const newNode = {
			...node,
			isWall: !node.isWall,
		};
		newGrid[row][col] = newNode;
	}

	return newGrid;
};

const setStartNode = (grid, row, col) => {
	const newGrid = grid.slice();
	for (const node of newGrid) {
		for (const row of node) {
			row.isStart = false;
		}
	}
	const node = newGrid[row][col];
	const newNode = {
		...node,
		isStart: true,
	};
	newGrid[row][col] = newNode;
	return newGrid;
};
const setEndNode = (grid, row, col) => {
	const newGrid = grid.slice();
	for (const node of newGrid) {
		for (const row of node) {
			row.isFinish = false;
		}
	}
	const node = newGrid[row][col];
	const newNode = {
		...node,
		isFinish: true,
	};
	newGrid[row][col] = newNode;
	return newGrid;
};
