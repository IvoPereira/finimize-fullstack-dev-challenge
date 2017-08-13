const router = require('express').Router(),
      request = require('request'),
      Utils = require('./../../../common/utils')

module.exports = function (req, res) {

  const baseCurrency = req.query.base || null,
        newCurrency = req.query.to || null,
        oldInitialSavingsAmount = parseFloat(req.query.initialSavingsAmount) || null,
        oldMonthlyDeposit = parseFloat(req.query.monthlyDeposit) || null

  const invalidFields = Utils.getInvalidFields([
    'base',
    'to',
    'initialSavingsAmount',
    'monthlyDeposit'
  ], req.query)

  if (invalidFields && invalidFields.length) {
    return res.status(400).json({
      'status': 'error',
      'message': 'The fields "' + invalidFields.join('", "') + '" are not valid.'
    })
  }

  request('https://api.fixer.io/latest?base=' + baseCurrency + '&symbols=' + newCurrency, function (error, response, body) {
    if (!body) {
      return res.json({
        'status': 'error',
        'message': 'Rate not found.'
      })
    }

    const json = JSON.parse( body )

    if (!json || !'rates' in json || !newCurrency in json.rates) {
      return res.json({
        'status': 'error',
        'message': 'Rate not found.'
      })
    }

    let newCurrencyRate = json.rates[newCurrency],
        newMonthlyDeposit = parseFloat( (newCurrencyRate * oldMonthlyDeposit).toFixed(3) ),
        newInitialSavingsAmount = parseFloat( (newCurrencyRate * oldInitialSavingsAmount).toFixed(3) )

      res.json({
        value: newCurrencyRate,
        monthlyDeposit: newMonthlyDeposit,
        initialSavingsAmount: newInitialSavingsAmount
      })

    })

}
