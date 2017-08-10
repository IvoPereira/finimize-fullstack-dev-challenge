import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './SelectInput.css'

export default class SelectInput extends Component {
	constructor(props) {
		super(props)

		this.state = {
			hasFocus: false,
			value: props.defaultValue
		}
	}

	handleChange(e) {
		const value = e.target.value
		this.setState({value})

		if (typeof this.props.onChange === 'function') {
			this.props.onChange(value)
		}
	}

	handleFocus(e) {
		this.setState({
			hasFocus: true
		})
	}

	render() {
		const { defaultValue, options } = this.props
		const { value } = this.state

		return (
			<div className={`select-input ${defaultValue !== undefined ? 'default-value' : ''}`}>
				<select
					onChange={this.handleChange.bind(this)}
					onFocus={this.handleFocus.bind(this)}
				>
					{options.map(option => (
						<option key={option.value} value={option.value} selected={value === option.value}>{option.label}</option>
			    ))}
				</select>
			</div>
		)
	}
}

SelectInput.propTypes = {
	defaultValue: PropTypes.number,
	onChange: PropTypes.function,
	options: PropTypes.array
}
