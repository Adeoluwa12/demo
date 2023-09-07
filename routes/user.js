const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const ConversionResult = require('../models/conversionModel');

const { handleRegister, handleLogin, handleLogout, handleDashboard } = require('../controllers/usercontroller')




router.get('/signup', (req, res) => {
    res.render('signup')
});

router.post('/signup', handleRegister)



// //login

router.get('/login', (req, res) => {
    res.render('login');
  });
  
  router.post('/login', handleLogin ) 


  
  //logout

  router.get('/logout', (req, res) => {
    res.render('login');
  });
  
  router.post('/logout', handleLogout )


// Dashboard

  router.get('/dashboard', handleDashboard);


// Conversion logic

const currencies = [
  "USD", "EUR", "GBP", "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN",
  "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL",
  "BSD", "BTC", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLF",
  "CLP", "CNH", "CNY", "COP", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF",
  // ... (and so on)
  "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL",
  "SCR", "SDG"
];




router.get('/dashboard/conversion', (req, res) => {
  res.render('index', {
      currencies,
      initialCurrency: '',
      nairaAmount: '',
      selectedCurrency: '',
  });
});

router.post('/dashboard/convert', (req, res) => {
  const nairaAmount = parseFloat(req.body.nairaAmount);
  const selectedCurrency = req.body.selectedCurrency;
  const customConversionRate = parseFloat(req.body.customConversionRate);

  const convertedAmount = nairaAmount / customConversionRate;

  res.render('result', { nairaAmount, selectedCurrency, convertedAmount, currencies });
});

// router.post('/dashboard/finalConvert', async (req, res) => {
//   const selectedCurrency = req.body.selectedCurrency;
//   const convertedAmount = parseFloat(req.body.convertedAmount);
//   const conversionRates = {};

//   // Convert conversion rates to numbers
//   for (const currency in req.body) {
//       if (currency.startsWith('conversionRates[')) {
//           const rate = parseFloat(req.body[currency]);
//           const currencyCode = currency.match(/\[(.*?)\]/)[1];
//           conversionRates[currencyCode] = rate;
//       }
//   }

//   // Debugging: Output form data to console
//   console.log("Form Data Received:", req.body);

//   const results = {};

//   // Calculate the converted amounts for each currency using the conversion rates
//   for (const currency in conversionRates) {
//       if (conversionRates.hasOwnProperty(currency)) {
//           const rate = parseFloat(conversionRates[currency]);
//           const convertedValue = rate * convertedAmount;
//           results[currency] = convertedValue.toFixed(2); // Convert to fixed decimal places
//       }
//   }

//   // Debugging: Output calculated results to console
//   console.log("Calculated Results:", results);

//   try {
//   //     // Create a new instance of the ConversionResult model
//   //    // Save the results to the database
//     const conversionResult = new ConversionResult({
//       selectedCurrency,
//       convertedAmount,
//       conversionRates,
//       results,
//     });

//     await conversionResult.save();

//     res.redirect('/user/dashboard/viewresult'); // Redirect to view saved results
//   } catch (error) {
//       console.error("Error saving result:", error);
//       res.status(500).send("Error saving result");
//   }
// });


















// automated


router.get('/dashboard/autoconversion', (req, res) => {
  res.render('autoindex', {
    currencies,
    initialCurrency: '',
    nairaAmount: '',
    selectedCurrency: '',
  });
});



router.post('/dashboard/autoconvert', async (req, res) => {
  const nairaAmount = parseFloat(req.body.nairaAmount);
  const selectedCurrency = req.body.selectedCurrency;

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/4f50fae0954705094ca1a31e/latest/NGN`);
    const data = await response.json();
    const exchangeRates = data.conversion_rates;
    const rate = exchangeRates[selectedCurrency];
    const convertedAmount = (nairaAmount * rate).toFixed(2);

    res.render('autoresult', { nairaAmount, currencies, selectedCurrency, convertedAmount });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    res.status(500).send('Error fetching exchange ratess');
  }
});








// router.post('/dashboard/autofinalConvert', async (req, res) => {
//   const selectedCurrency = req.body.selectedCurrency;
//   const selectedCurrencies = req.body.selectedCurrencies;
//   const convertedAmount = parseFloat(req.body.convertedAmount);
//   let conversionRates = {};
//   console.log('test');

//   try {
//     const response = await fetch(`https://v6.exchangerate-api.com/v6/4f50fae0954705094ca1a31e/latest/${selectedCurrency}`);
//     const data = await response.json();
//      conversionRates = data.conversion_rates;
//      const rate = parseFloat(conversionRates[selectedCurrency]);
//     const convertedAmount = (convertedAmount * rate).toFixed(2);
//     console.log("make")
    
    
    
//   } catch (error) {
//     console.error('Error fetching exchange rates actually:', error);
//     res.status(500).send('Error fetching exchange rates actually');
//   }
//   console.log('selectedCurrencies', selectedCurrencies);

  // Convert conversion rates to numbers
  // for (const currency in req.body) {
  //     if (currency.startsWith('conversionRates[')) {
  //         const rate = parseFloat(req.body[currency]);
  //         const currencyCode = currency.match(/\[(.*?)\]/)[1];
  //         conversionRates[currencyCode] = rate;

  //         console.log('rate', rate);
  //         console.log('conversionRate', conversionRates);
  //         console.log('currencyCode', currencyCode);
  //     }
  // }

  // Debugging: Output form data to console
  // console.log("Form Data Received:", req.body);

  // const results = {};

  // Calculate the converted amounts for each currency using the conversion rates
  // for (const currency in conversionRates) {
  //     if (conversionRates.hasOwnProperty(currency)) {
  //         const rate = parseFloat(conversionRates[currency]);
  //         const convertedValue = rate * convertedAmount;
  //         results[currency] = convertedValue.toFixed(2); // Convert to fixed decimal places
  //     }
  // }

  // Debugging: Output calculated results to console
//   console.log("Calculated Results:", results);

//   try {
//   //     // Create a new instance of the ConversionResult model
//   //    // Save the results to the database
//     const conversionResult = new ConversionResult({
//       selectedCurrency,
//       selectedCurrencies,
//       convertedAmount,
//       conversionRates,
//       results,
//     });

//     await conversionResult.save();

//     res.render('autofinalresult', { selectedCurrency, convertedAmount, results });
//   } catch (error) {
//     console.error("Error calculating and saving results:", error);
//     res.status(500).send("Error calculating and saving results");
//   }
// });









// router.post('/dashboard/autofinalconvert', async (req, res) => {
//   const selectedCurrency = req.body.selectedCurrency;
//   const convertedAmount = parseFloat(req.body.convertedAmount);
//   const selectedCurrencies = req.body.selectedCurrencies; // An array of selected currencies

//   try {
//     // Fetch exchange rates for the selected currency
//     const response = await fetch(`https://v6.exchangerate-api.com/v6/4f50fae0954705094ca1a31e/latest/${selectedCurrency}`);
//     const data = await response.json();
//     const conversionRates = data.conversion_rates;

//     // Calculate the converted amounts for each selected currency using the conversion rates
//     const convertedResults = {};
//     for (const currency of selectedCurrencies) {
//       const rate = conversionRates[currency];
//       const convertedValue = (convertedAmount * rate).toFixed(2);
//       convertedResults[currency] = convertedValue;
//     }

//     // Render the view with the conversion results
//     res.render('autofinalresult', {
//       selectedCurrency,
//       selectedCurrencies,
//       convertedAmount,
//       results: convertedResults,
//     });
//   } catch (error) {
//     console.error('Error fetching exchange rates:', error);
//     res.status(500).send('Error fetching exchange rates');
//   }
// });


router.post('/dashboard/autofinalconvert', async (req, res) => {
  const selectedCurrency = req.body.selectedCurrency;
  const convertedAmount = parseFloat(req.body.convertedAmount);
  const selectedCurrencies = req.body.selectedCurrencies; // An array of selected currencies

  try {
    // Fetch exchange rates for the selected currency
    const response = await fetch(`https://v6.exchangerate-api.com/v6/4f50fae0954705094ca1a31e/latest/${selectedCurrency}`);
    const data = await response.json();
    const conversionRates = data.conversion_rates;

    // Initialize an object to store the converted amounts for each selected currency
    const convertedResults = {};

    // Calculate and accumulate the converted amounts for each selected currency
    for (const currency of selectedCurrencies) {
      const rate = conversionRates[currency];
      const convertedValue = (convertedAmount * rate).toFixed(2);
      convertedResults[currency] = convertedValue;
    }


          // Create a new instance of the ConversionResult model
          // Save the results to the database
        const conversionResult = new ConversionResult({
          selectedCurrency,
          selectedCurrencies,
          convertedAmount,
          results: convertedResults,
        });
    
        await conversionResult.save();
    
       
    // Render the view with the conversion results
    res.render('autofinalresult', {
      selectedCurrency,
      selectedCurrencies,
      convertedAmount,
      results: convertedResults,
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    res.status(500).send('Error fetching exchange rates');
  }
    });
  









router.post('/dashboard/saveresult', async (req, res) => {
    const selectedCurrency = req.body.selectedCurrency;
    const convertedAmount = req.body.convertedAmount;
    const results = JSON.parse(req.body.results);

    try {
    //     // Create a new ConversionResult document
    //     const newConversionResult = new ConversionResult({
    //         selectedCurrency: selectedCurrency,
    //         convertedAmount: convertedAmount,
    //         results: results
    //     });

    //     // Save the document to the database
    //     await newConversionResult.save();

        res.redirect('/user/dashboard/viewresult'); // Redirect to view saved results
    } catch (error) {
        console.error("Error saving result:", error);
        res.status(500).send("Error saving result");
    }
});



router.get('/dashboard/viewresult', async (req, res) => {
  try {
    const savedResults = await ConversionResult.find();
    res.render('viewresult', { results: savedResults });
  } catch (error) {
    console.error("Error retrieving saved results:", error);
    res.status(500).send("Error retrieving saved results");
  }
});


router.get('/dashboard/view', async (req, res) => {
  try {
      const savedResults = await ConversionResult.find(); // Fetch saved results from the database
      res.render('view', { results: savedResults }); // Pass the conversions data to the template
  } catch (error) {
      console.error("Error retrieving saved results:", error);
      res.status(500).send("Error retrieving saved results");
  }
});


// delete

router.post('/dashboard/clearresults', async (req, res) => {
  try {
    await ConversionResult.deleteMany({}); // Delete all saved results
    res.redirect('/user/dashboard/viewresult'); // Redirect back to the viewresult page
  } catch (error) {
    console.error("Error clearing results:", error);
    res.status(500).send("Error clearing results");
  }
});



module.exports = router;