const express = require('express'),
      request = require('request');

const app = express();

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/projection/monthly', function (req, res) {
  const initialSavingsAmount = parseFloat(req.query.initialSavingsAmount) || null,
        monthlyDeposit = parseFloat(req.query.monthlyDeposit) || null,
        interestRate = parseFloat(req.query.interestRate) || null,
        interestRatePaymentPeriod = req.query.interestRatePaymentPeriod || null

  // TODO: Handle the possibility of not receiving any of the values above

  switch (interestRatePaymentPeriod) {
    case 'monthly':
      monthsPerYear = 12
      break
    case 'quarterly':
      monthsPerYear = 4
      break
    case 'anually':
      monthsPerYear = 1
      break
    default:
      throw new Error('Interest rate payment period not allowed.')
  }

  const result = [],
        maxYears = 50,
        totalMonths = maxYears * monthsPerYear,
        interestRatePercentage = 1 + interestRate / monthsPerYear

  let currentSavingsValue = initialSavingsAmount,
      indexMonth = 0

  for (let year = 0; year < maxYears; year++) {
    for (let month = 0; month < monthsPerYear; month++) {

      //-----------------------------------------------------
      // Depending on the interest rate payment period
      // Add or not the percentage to current savings value
      //-----------------------------------------------------
      currentSavingsValue += monthlyDeposit

      // Based on current savings value, calculate the interest rate percentage
      // and multiply the current saving by it
      switch (interestRatePaymentPeriod) {
        case 'monthly':
          currentSavingsValue += interestRatePercentage
          break
        case 'quarterly':
          if (month === 3 || month === 7 || month === 11) {
            currentSavingsValue += interestRatePercentage
          }
          break
        case 'anually':
          if (month === 11) {
            currentSavingsValue += interestRatePercentage
          }
          break
        default:
          throw new Error('Interest rate payment period not allowed.')
      }

      // Sum monthly deposit to current savings each month

      indexMonth++

      result.push({
        month: indexMonth,
        amount: Number(currentSavingsValue.toFixed(3)),
        interestRatePercentage: interestRatePercentage
      })

    }
  }

  res.json({
    'status': 'success',
    'data': result
  });
})

app.get('/currency/rate', function(req, res) {

  const baseCurrency = req.query.base || null,
        newCurrency = req.query.to || null,
        oldInitialSavingsAmount = parseFloat(req.query.initialSavingsAmount) || null,
        oldMonthlyDeposit = parseFloat(req.query.monthlyDeposit) || null

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

})

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
