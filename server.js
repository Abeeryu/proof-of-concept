console.log('Hier komt je server voor Sprint 12.')

// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({extended: true}))

app.use(express.json());


app.get('/', (request, response) => {
    
    fetchJson('https://dtnl-frontend-case.vercel.app/api/get-forecast')
        .then((itemsDataFromAPI) => {
            response.render('home', { items: itemsDataFromAPI.data});
        })
        .catch(error => {
            console.error("Error fetching data from API:", error);
            response.status(500).send("Internal Server Error");
        });
});


let postsubscribe = {};

app.get('/post-subscribe', (request, response) => {
    fetch('https://dtnl-frontend-case.vercel.app/api/post-subscribe')
        .then(res => res.json())
        .then(itemsDataFromAPI => {
            response.render('post-subscribe', { items: itemsDataFromAPI.data });
        })
        .catch(error => {
            console.error("Error fetching data from API:", error);
            response.status(500).send("Internal Server Error");
        });
});

app.post('/post-subscribe', (request, response) => {
    const email = request.body.email;

    if (!email || !validateEmail(email)) {
        console.error('Invalid email address:', email);
        return response.status(400).json({ success: false, message: 'Invalid email address' });
    }

    postsubscribe[email] = true;
    console.log('Subscription successful for email:', email);

    response.json({ success: true });
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}







// app.get('/get-weather', (request, response) => {
    
//     fetchJson('https://dtnl-frontend-case.vercel.app/api/get-weather')
//         .then((itemsDataFromAPI) => {
//             response.render('forecast', { items: itemsDataFromAPI.data});
//         })
//         .catch(error => {
//             console.error("Error fetching data from API:", error);
//             response.status(500).send("Internal Server Error");
//         });
// });





  
//   // Route to render the EJS template
//   app.get('/', (req, res) => {
//     res.render('forecast', { forecast: [] }); // Initial empty forecast
//   });







// 3. Start de webserver

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})