const express = require('express');
const { default: axios } = require('axios');
const router = express.Router();
const lang2 = require('./lang2.json');
const lang = require('./lang.json');

const CCLW='04704CB103DA6FEF16EA2E089D0D1D51AC61E61270F394ACEB33030A1D4C71D5F7F1E17C40E75EDDA2FD4A4D4B2A6E17F8E42C8F33A2924F83115340D4FEFDFF';
const redirectUrl=" https://api.trabajos24.com/api/payment/redirect/callback";

const createRedirectUrl=()=>{    
     // Step 1: Encode the URL
     let encodedUrl = encodeURIComponent(redirectUrl);
    
     // Step 2: Convert the encoded URL to hexadecimal
     let hexEncodedUrl = '';
     for (let i = 0; i < encodedUrl.length; i++) {
         hexEncodedUrl += encodedUrl.charCodeAt(i).toString(16).toUpperCase();
     }

    return hexEncodedUrl
}
// Define a route to render the payment form
router.post('/',async (req, res) => {
    try {
        const {amount}=req.body
        const body = {
            "CCLW": CCLW,
            "CMTN": amount,
            "CDSC": "Agregar dinero en la cuenta.",
            "CTAX": 0.0,
            "RETURN_URL" : createRedirectUrl(),
        }
        const response= await axios.post('https://secure.paguelofacil.com/LinkDeamon.cfm', body, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*'
          }
        })

        res.send(response.data);
    } catch (error) {
        res.send(error);
    }
    });
    // Define a route to render the payment form
router.get('/redirect/:callback?', (req, res) => {
    // Render the payment form view
    res.send(req?.user?.lang=='english'?lang["paydone"]:lang2["paydone"])
});

module.exports = router;
