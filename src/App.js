import React from 'react';
import { evaluate } from 'mathjs';
import styles from './App.module.scss';

const buttons = [
	{
		id: 'zero',
		display: 0,
		type: 'NUMBER',
		value: 0,
	},
	{
		id: 'one',
		display: 1,
		type: 'NUMBER',
		value: 1,
	},
	{
		id: 'two',
		display: 2,
		type: 'NUMBER',
		value: 2,
	},
	{
		id: 'three',
		type: 'NUMBER',
		display: 3,
		value: 3,
	},
	{
		id: 'four',
		type: 'NUMBER',
		display: 4,
		value: 4,
	},
	{
		id: 'five',
		type: 'NUMBER',
		display: 5,
		value: 5,
	},
	{
		id: 'six',
		type: 'NUMBER',
		display: 6,
		value: 6,
	},
	{
		id: 'seven',
		type: 'NUMBER',
		display: 7,
		value: 7,
	},
	{
		id: 'eight',
		type: 'NUMBER',
		display: 8,
		value: 8,
	},
	{
		id: 'nine',
		type: 'NUMBER',
		display: 9,
		value: 9,
	},
	{
		id: 'clear',
		type: 'CLEAR',
		display: 'AC',
		value: 10,
	},
	{
		id: 'decimal',
		type: 'DECIMAL',
		display: '.',
		value: 11,
	},
	{
		id: 'equals',
		type: 'EVALUATE',
		display: '=',
		value: 12,
	},
	{
		id: 'add',
		type: 'OPERATOR',
		display: ' + ',
		value: 13,
	},
	{
		id: 'subtract',
		type: 'OPERATOR',
		display: ' - ',
		value: 14,
	},
	{
		id: 'multiply',
		type: 'OPERATOR',
		display: ' * ',
		value: 15,
	},
	{
		id: 'divide',
		type: 'OPERATOR',
		display: ' / ',
		value: 16,
	},
];

class Display extends React.Component {
	render() {
		return (
			<div className={styles.primary} id='primary'>
				<p className={styles.formula}>{this.props.formula}</p>
				<p className={styles.display} id='display'>
					{this.props.display}
				</p>
			</div>
		);
	}
}

class Button extends React.Component {
	constructor(props) {
		super(props);
		this.click = this.click.bind(this);
	}
	click() {
		this.props.handleClick(this.props.buttonObj);
	}
	render() {
		const { id, value, display } = this.props.buttonObj;
		return (
			<button
				className={`${styles.btn} ${styles[`button-${value}`]}`}
				id={`${styles[`${id}`]}`}
				onClick={(e) => this.click()}>
				{display}
			</button>
		);
	}
}

class ButtonGrid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentVal: '0',
			previousVal: '0',
			formula: '',
			operator: '',
			negCount: 0,
			previousAnswer: '',
			evaluated: false,
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleClear = this.handleClear.bind(this);
		this.handleNumber = this.handleNumber.bind(this);
		this.handleOperator = this.handleOperator.bind(this);
		this.handleDecimal = this.handleDecimal.bind(this);
		this.handleEvaluate = this.handleEvaluate.bind(this);
		this.endsWithOperator = this.endsWithOperator.bind(this);
		this.endsWithNegative = this.endsWithNegative.bind(this);
		this.trimFormula = this.trimFormula.bind(this);
		this.checkCurrentValForOperator =
			this.checkCurrentValForOperator.bind(this);
		this.evaluateEvaluated = this.evaluateEvaluated.bind(this);
		this.applyOperator = this.applyOperator.bind(this);
	}
	evaluateEvaluated() {
		if (this.state.evaluated) {
			this.setState({
				formula: this.state.previousAnswer,
				evaluated: false,
			});
		}
	}
	checkCurrentValForOperator(value) {
		const regex = /-|\+|\*|\//g;
		if (regex.test(this.state.currentVal)) {
			console.log('is operator');
			this.setState({
				currentVal: value,
			});
		}
	}
	trimFormula(operator) {
		const regex = /\W+$/g;
		if (operator) {
			this.setState({
				formula: this.state.formula.replace(regex, '') + operator,
			});
		} else {
			this.setState({
				formula: this.state.formula.replace(regex, ''),
			});
		}
	}
	endsWithOperator() {
		const regex = /\s-\s$|\s\+\s$|\s\*\s$|\s\/\s$/g;
		if (regex.test(this.state.formula)) {
			console.log('formula ends with operator');
			return true;
		}
		return false;
	}
	endsWithNegative() {
		const regex = /\s-\s$/g;
		if (regex.test(this.state.formula)) {
			return true;
		}
		return false;
	}
	handleEvaluate() {
		const answer = evaluate(this.state.formula);
		console.log(
			`formula was ${this.state.formula} and the answer was ${answer}`
		);
		this.setState({
			currentVal: answer,
			formula: this.state.formula + ' = ' + answer,
			operator: '',
			negCount: 0,
			previousAnswer: answer,
			evaluated: true,
		});
	}
	applyOperator(operator) {
		const endsWithOp = this.endsWithOperator();
		const endsWithNeg = this.endsWithNegative();
		let currentNegCount = this.state.negCount;

		if (endsWithOp) {
			if (endsWithNeg) {
				if (this.state.negCount === 1 && operator !== ' - ') {
					this.setState(() => this.trimFormula(operator));
				} else if (this.state.negCount === 2 && operator !== ' - ') {
					this.setState(() => this.trimFormula(operator));
				}
			} else {
				if (this.state.negCount === 1 && operator !== ' - ') {
					this.setState(() => this.trimFormula(operator));
				} else if (operator !== ' - ') {
					this.setState(() => this.trimFormula(operator));
				}
			}
		}
		switch (operator) {
			case ' - ':
				if (this.state.negCount === 2) {
					break;
				}
				this.setState({
					currentVal: operator,
					formula: this.state.formula + operator,
					operator,
					negCount: (currentNegCount += 1),
				});
				break;
			case ' + ':
				if (this.state.currentVal === ' + ') {
					break;
				}
				this.setState({
					currentVal: operator,
					formula: this.state.formula + operator,
					operator,
					negCount: 0,
				});
				break;
			case ' / ':
				if (this.state.formula === '') {
					break;
				}
				if (this.state.currentVal === ' / ') {
					break;
				}
				this.setState({
					currentVal: operator,
					formula: this.state.formula + operator,
					operator,
					negCount: 0,
				});
				break;
			case ' * ':
				if (this.state.formula === '') {
					break;
				}
				if (this.state.currentVal === ' * ') {
					break;
				}
				this.setState({
					currentVal: operator,
					formula: this.state.formula + operator,
					operator,
					negCount: 0,
				});
				break;
			default:
				this.setState({ currentVal: '0' });
		}
	}
	handleOperator(operator) {
		console.log(operator);
		if (this.state.evaluated) {
			this.setState(
				{ formula: this.state.previousAnswer + operator, evaluated: false },
				this.applyOperator(operator)
			);
		} else {
			this.applyOperator(operator);
		}
	}
	handleDecimal() {
		const regex = /\./g;
		const isOperator = this.endsWithOperator();
		if (!regex.test(this.state.currentVal)) {
			if (this.state.currentVal === '0' && this.state.formula === '') {
				this.setState({
					currentVal: this.state.currentVal + '.',
					formula: this.state.formula + '0.',
				});
			} else {
				this.setState({
					currentVal: isOperator ? '0.' : this.state.currentVal + '.',
					formula: isOperator
						? this.state.formula + '0.'
						: this.state.formula + '.',
				});
			}
		}
	}

	handleNumber(value) {
		console.log(value);
		this.setState(() => this.checkCurrentValForOperator(value));
		if (this.state.currentVal === '0' && value === '0') {
			return;
		}
		if (this.state.currentVal === '0' && value !== '0') {
			this.setState({
				currentVal: value,
				formula: value,
				negCount: 0,
			});
		} else {
			if (this.state.evaluated) {
				return this.setState({
					currentVal: value,
					formula: value,
					negCount: 0,
					evaluated: false,
				});
			}
			this.setState({
				currentVal: this.state.currentVal + value,
				formula: this.state.formula + value,
				negCount: 0,
			});
		}
	}
	handleClear() {
		this.setState({
			currentVal: '0',
			formula: '',
			negCount: 0,
			operator: '',
			previousAnswer: '',
			evaluated: false,
		});
	}
	handleClick(obj) {
		const { type, display, value } = obj;
		switch (type) {
			case 'CLEAR':
				this.handleClear();
				break;
			case 'NUMBER':
				this.handleNumber(value.toString());
				break;
			case 'OPERATOR':
				this.handleOperator(display);
				break;
			case 'DECIMAL':
				this.handleDecimal();
				break;
			case 'EVALUATE':
				this.handleEvaluate();
				break;
			default:
				this.setState({ currentVal: '0' });
		}
	}
	render() {
		return (
			<div className={styles.button_grid}>
				<Display display={this.state.currentVal} formula={this.state.formula} />
				{buttons.map((button) => (
					<Button
						key={button.id}
						buttonObj={button}
						handleClick={this.handleClick}
					/>
				))}
			</div>
		);
	}
}

function App() {
	return (
		<div id={styles.calculator}>
			<ButtonGrid />
		</div>
	);
}

export default App;
