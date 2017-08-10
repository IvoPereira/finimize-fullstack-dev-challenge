import {
  SET_INITIAL_SAVINGS_AMOUNT,
  SET_MONTHLY_DEPOSIT,
  SET_INTEREST_RATE,
  SET_INTEREST_RATE_PAYMENT_PERIOD,
  SET_MONTHLY_PROJECTION_DATA
} from '../actionTypes'

const initialState = {
  initialSavingsAmount: 1500,
  monthlyDeposit: 2000,
  interestRate: 10,
  interestRatePaymentPeriod: 'monthly',
  monthlyProjectionData: [
    {
      month: 1,
      amount:500
    },
    {
      month: 2,
      amount:700
    },
    {
      month: 3,
      amount:1000
    },
    {
      month: 4,
      amount:1500
    }
  ]
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case SET_INITIAL_SAVINGS_AMOUNT:
      return Object.assign({}, state, {
        initialSavingsAmount: action.value
      })
    case SET_MONTHLY_DEPOSIT:
      return Object.assign({}, state, {
        monthlyDeposit: action.value
      })
    case SET_INTEREST_RATE:
      return Object.assign({}, state, {
        interestRate: action.value
      })
    case SET_INTEREST_RATE_PAYMENT_PERIOD:
      return Object.assign({}, state, {
        interestRatePaymentPeriod: action.value
      })
    case SET_MONTHLY_PROJECTION_DATA:
      return Object.assign({}, state, {
        monthlyProjectionData: action.value
      })
    default:
      return state
  }
}

export default app
