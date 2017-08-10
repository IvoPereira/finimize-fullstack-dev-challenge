import fetch from 'isomorphic-fetch'
import queryString from 'query-string'
import {
  SET_CURRENCY,
  SET_INITIAL_SAVINGS_AMOUNT,
  SET_MONTHLY_DEPOSIT,
  SET_INTEREST_RATE,
  SET_INTEREST_RATE_PAYMENT_PERIOD,
  SET_MONTHLY_PROJECTION_DATA
} from '../actionTypes'

export function setInitialSavingsAmount(value) {
  return { type: SET_INITIAL_SAVINGS_AMOUNT, value }
}

export function setCurrency(value) {
  return { type: SET_CURRENCY, value }
}

export function fetchCurrencyValues(newCurrency) {
  return (dispatch, getState) => {

    const oldCurrency = getState().app.currency

    dispatch(setCurrency(newCurrency))

    const oldMonthlyDeposit = getState().app.monthlyDeposit,
            oldInitialSavingsAmount = getState().app.initialSavingsAmount

    fetch('https://api.fixer.io/latest?base=' + oldCurrency + '&symbols=' + newCurrency)
      .then(response => response.json())
      .then(json => {

        if ('rates' in json && newCurrency in json.rates) {
          let newCurrencyRate = json.rates[newCurrency],
                newMonthlyDeposit = parseFloat( (newCurrencyRate * oldMonthlyDeposit).toFixed(3) ),
                newInitialSavingsAmount = parseFloat( (newCurrencyRate * oldInitialSavingsAmount).toFixed(3) )

          dispatch(setMonthlyDeposit( newMonthlyDeposit ))
          dispatch(setInitialSavingsAmount( newInitialSavingsAmount ))
        }

      })
  }
}

export function setMonthlyDeposit(value) {
  return { type: SET_MONTHLY_DEPOSIT, value }
}

export function setInterestRate(value) {
  return { type: SET_INTEREST_RATE, value }
}

export function setInterestRatePaymentPeriod(value) {
  return { type: SET_INTEREST_RATE_PAYMENT_PERIOD, value }
}

export function setMonthlyProjectionData(value) {
  return { type: SET_MONTHLY_PROJECTION_DATA, value }
}

export function fetchMonthlyProjectionData() {
  return (dispatch, getState) => {
    const currentState = getState().app
    const querystring = queryString.stringify({
      initialSavingsAmount: currentState.initialSavingsAmount,
      monthlyDeposit: currentState.monthlyDeposit,
      interestRate: currentState.interestRate,
      interestRatePaymentPeriod: currentState.interestRatePaymentPeriod
    })

    fetch('projection/monthly?' + querystring)
      .then(response => response.json())
      .then(json => {
        if (json.status === 'success') {
          dispatch(setMonthlyProjectionData(json.data))
        }
      })
  }
}
