import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
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

    /*
        let data = Object.assign({})

        let increasing_value = 1000

        for (let year=0; year < 50; year++) {
          for (let month=0; month < 12; month++) {
            increasing_value += increasing_value * (year * month)
    console.log('year: ' + year + ' - month: ' + month)

            data = {...data, month: month, amount: 1000}

            console.log(data)
          }
        }

        let data = {}
        data = {...data, month:1,amount:2000}
        data = {...data, month:2,amount:3000}
        console.log(data)
        */


    return (
      <div className="App">
        <div className="header-banner">
          <h1 className="fmz-white-font">Finimize Interest Rate Calculator</h1>
        </div>

        <div className="financial-inputs">
          <p className="input-label">How much have you saved?</p>
          <CurrencyInput defaultValue={initialSavingsAmount} onChange={onInitialSavingsAmountChanged} />

          <p className="input-label">How much will you save each month?</p>
          <CurrencyInput defaultValue={monthlyDeposit} onChange={onMonthlyDepositChanged} />

          <p className="input-label">How much interest will you earn per year?</p>
          <SliderInput defaultValue={interestRate} onChange={onInterestRateChanged} />

          <p className="input-label">How often is interest rate paid?</p>
          <SelectInput defaultValue={interestRatePaymentPeriod} options={interestRatePaymentOptions} onChange={onInterestRatePaymentPeriodChanged} />
        </div>

				<div className="financial-display">
					{/*We have included some sample data here, you will need to replace this
					with your own. Feel free to change the data structure if you wish.*/}
					<DisplayGraph data={monthlyProjectionData}/>
				</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
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
