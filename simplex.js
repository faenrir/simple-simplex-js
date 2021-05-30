#!/usr/bin/env node

class LinearModel {
	constructor(variables, limits, max) {
		this.variables = variables;
		this.limits = limits;
		this.max = max;
		this.tableau = [];
		// optimized = all values in last row positive?
		this.optimized = false;
		this.pivColumn;
		this.pivRow;
		this.pivElement;
	}

	createTableau() {
		let im = this.createIdentity(this.variables.length - 1);
		console.log(im);
		this.variables.forEach((v, i) => {
			this.tableau.push(this.variables[i].concat(im[i]));
		});
		// last row
		let lastRow = this.negate(this.max);
		im[im.length - 1].forEach((v) => {
			lastRow.push(v);
		});
		this.tableau.push(lastRow);

		// last column
		this.limits.forEach((v, i) => {
			this.tableau[i].push(this.limits[i]);
		});
		this.tableau[this.tableau.length - 1].push(0);
		console.log(this.tableau);
	}

	createIdentity(size) {
		let im = [];
		let row = [];
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (i === j) {
					row.push(1);
				} else {
					row.push(0);
				}
			}
			im.push(row);
			row = [];
		}
		return im;
	}

	// finds the lowest index in the last row
	pivotColumn() {
		let lastRow = this.tableau[this.tableau.length - 1];
		let lowest = 0;
		for (let i = 1; i < lastRow.length; i++) {
			if (lastRow[i] < lastRow[lowest]) lowest = i;
		}
		console.log("Pivot Column: " + lowest);
		this.pivColumn = lowest;
	}

	// find the pivotElement
	pivotElement() {
		// rhs = rightHandSight
		let rhs = [];
		// forEach row, except last row
		let iteration = 0;
		this.tableau.forEach((v, i) => {
			iteration++;
			if (iteration < this.tableau.length) {
				let number = this.tableau[i][this.tableau[0].length - 1];
				let divider = this.tableau[i][this.pivColumn];
				rhs.push(number / divider);
			}
		});
		let lowest = 0;
		for (let i = 1; i < rhs.length; i++) {
			if (rhs[i] < rhs[lowest]) lowest = i;
		}
		console.log("Pivot Row: " + lowest);
		this.pivRow = lowest;
		let pivElement = this.tableau[lowest][this.pivColumn];
		console.log("Pivot Element: " + pivElement);
		this.pivElement = pivElement;
	}

	simplex() {
		// divide row through pivot element
		this.tableau[this.pivRow].forEach((v, i) => {
			this.tableau[this.pivRow][i] = v / this.pivElement;
		});

		console.log(this.tableau);

		this.tableau.forEach((v, i) => {
			// do nothing for row with pivot element
			if (i === this.pivRow) return;
			// do nothing for last row
			// if (i === this.tableau.length - 1) return;

			// minus = how many times the pivot row should get subtracted
			let minus = -1 * this.tableau[i][this.pivColumn];
			// go through row and subtract the pivot row
			this.tableau[i].forEach((v, j) => {
				this.tableau[i][j] = v + minus * this.tableau[this.pivRow][j];
			});

			console.log(this.tableau);
		});
	}

	checkOptimized() {
		this.optimized = true;
		this.tableau[this.tableau.length - 1].forEach((v, i) => {
			if (v < 0) {
				this.optimized = false;
				console.log("NOT OPTIMIZED YET!");
			}
		});
	}

	optimize() {
		this.createTableau();
		while (!this.optimized) {
			this.pivotColumn();
			this.pivotElement();
			this.simplex();
			this.checkOptimized();
		}
		console.log("OPTIMIZED! :)");
		this.optimalSolution();
		this.optimalValue();
	}

	optimalSolution() {
		let optimalSol = [];
		this.tableau.forEach((v, i) => {
			if (i === this.tableau.length - 1) return;
			optimalSol.push(this.tableau[i][this.tableau[0].length - 1]);
		});
		// javascript converts the array when printing with text, make it nicer with brackets
		console.log("Optimal Solution: [" + optimalSol + "]");
	}

	optimalValue() {
		let optimalVal = this.tableau[this.tableau.length - 1][
			this.tableau[0].length - 1
		];
		console.log("Optimal Value: " + optimalVal);
	}

	negate(arr) {
		arr.forEach((v, i) => {
			arr[i] = arr[i] * -1;
		});
		return arr;
	}
}

// test0:
// variables
// 16x + 12y
// constraints:
// limits <= max
// 4x + 6y <= 24
// 8x + 4y <= 32

let test0 = new LinearModel(
	[
		[4, 6],
		[8, 4],
	],
	[24, 32],
	[16, 12]
);

test0.optimize();

// test1:
// variables
// 45a + 60b + 50c
// constraints:
// limits <= max
// 20a+28b+16c <= 2400
// 12a+28b+16c <= 2400
// 15a+6b+16c <= 2400
// 10a+15b <= 2400

let test1 = new LinearModel(
	[
		[20, 28, 16],
		[12, 28, 16],
		[15, 6, 16],
		[10, 15, 0],
	],
	[2400, 2400, 2400, 2400],
	[45, 60, 50]
);
// test1.optimize();

let test2 = new LinearModel(
	[
		[2, 1],
		[2, 3],
		[3, 1],
	],
	[18, 42, 24],
	[3, 2]
);

// test2.optimize();
