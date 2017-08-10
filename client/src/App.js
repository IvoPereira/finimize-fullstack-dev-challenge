import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  fetchCurrencyValues,
  setInitialSavingsAmount,
  setMonthlyDeposit,
  setInterestRate,
  setInterestRatePaymentPeriod,
  fetchMonthlyProjectionData
} from './actions'

import CurrencyInput from './components/CurrencyInput'
import SliderInput from './components/SliderInput'
import SelectInput from './components/SelectInput'
import DisplayGraph from './components/DisplayGraph'

import './App.css'

class App extends Component {
  componentDidMount() {
    console.log(this.props)
    const { fireOnSettingsChanged } = this.props
    fireOnSettingsChanged()
  }

  render() {
    let {
      currency,
      onCurrencyChanged,
      initialSavingsAmount,
      onInitialSavingsAmountChanged,
      monthlyDeposit,
      onMonthlyDepositChanged,
      interestRate,
      onInterestRateChanged,
      interestRatePaymentPeriod,
      onInterestRatePaymentPeriodChanged,
      monthlyProjectionData
    } = this.props

    const interestRatePaymentOptions = [
      {
        value: 'monthly',
        label: 'Monthly'
      },
      {
        value: 'quarterly',
        label: 'Quarterly'
      },
      {
        value: 'anually',
        label: 'Anually'
      }
    ]

    const currencyOptions = [
      {
        value: 'GBP',
        label: '£'
      },
      {
        value: 'EUR',
        label: '€'
      },
      {
        value: 'USD',
        label: '$'
      }
    ]

    return (
      <div className="App">
        <div className="header-banner">
          <h1 className="fmz-white-font">Finimize Interest Rate Calculator</h1>
        </div>

        <div className="financial-inputs">
          <p className="input-label">What is your currency?</p>
          <SelectInput defaultValue={currency} options={currencyOptions} onChange={onCurrencyChanged} />

          <p className="input-label">How much have you saved?</p>
          <CurrencyInput currency={currency} defaultValue={initialSavingsAmount} value={initialSavingsAmount} onChange={onInitialSavingsAmountChanged} />

          <p className="input-label">How much will you save each month?</p>
          <CurrencyInput currency={currency} defaultValue={monthlyDeposit} value={monthlyDeposit} onChange={onMonthlyDepositChanged} />

          <p className="input-label">How much interest will you earn per year?</p>
          <SliderInput defaultValue={interestRate} onChange={onInterestRateChanged} />

          <p className="input-label">How often is interest rate paid?</p>
          <SelectInput defaultValue={interestRatePaymentPeriod} options={interestRatePaymentOptions} onChange={onInterestRatePaymentPeriodChanged} />
        </div>

				<div className="financial-display">
					<DisplayGraph data={monthlyProjectionData}/>
				</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currency: state.app.currency,
    initialSavingsAmount: state.app.initialSavingsAmount,
    monthlyDeposit: state.app.monthlyDeposit,
    interestRate: state.app.interestRate,
    monthlyProjectionData: state.app.monthlyProjectionData
  }
}

const mapDispatchToProps = dispatch => {
  function fireOnSettingsChanged() {
    dispatch(fetchMonthlyProjectionData())
  }

  return {
    fireOnSettingsChanged,
    onCurrencyChanged: value => {
      dispatch(fetchCurrencyValues(value))
      fireOnSettingsChanged()
    },
    onInitialSavingsAmountChanged: value => {
      dispatch(setInitialSavingsAmount(value))
      fireOnSettingsChanged()
    },
    onMonthlyDepositChanged: value => {
      dispatch(setMonthlyDeposit(value))
      fireOnSettingsChanged()
    },
    onInterestRateChanged: value => {
      dispatch(setInterestRate(value))
      fireOnSettingsChanged()
    },
    onInterestRatePaymentPeriodChanged: value => {
      dispatch(setInterestRatePaymentPeriod(value))
      fireOnSettingsChanged()
    }
  }
}

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default ConnectedApp;
