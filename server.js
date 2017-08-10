const express = require('express');

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
        interestRatePaymentPeriod = req.query.interestRatePaymentPeriod || null;

  // TODO: Handle the possibility of not receiving any of the values above

  const result = [],
        interestRatePercentage = interestRate / 100

  let currentSavingsValue = initialSavingsAmount

  for (let month = 0; month < 12; month++) {

    // Sum monthly deposit to current savings each month
    currentSavingsValue += monthlyDeposit

    //-----------------------------------------------------
    // Depending on the interest rate payment period
    // Add or not the percentage to current savings value
    //-----------------------------------------------------

    // Based on current savings value, calculate the interest rate percentage
    // and multiply the current saving by it
    switch (interestRatePaymentPeriod) {
      case 'monthly':
        console.log('current savings value with rate: ' + currentSavingsValue * interestRatePercentage)
        currentSavingsValue += currentSavingsValue * interestRatePercentage
        break
      case 'quarterly':
        if (month === 3 || month === 7 || month === 11) {
          currentSavingsValue += currentSavingsValue * interestRatePercentage
        }
        break
      case 'anually':
        if (month === 11) {
          currentSavingsValue += currentSavingsValue * interestRatePercentage
        }
        break
    }

    result.push({
      month: month,
      amount: currentSavingsValue
    })

  }

  res.json({
    'status': 'success',
    'data': result
  });
})

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
