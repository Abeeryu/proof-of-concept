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

function formatDate(dateString) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const date = new Date(dateString);

    const dayName = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const monthName = months[date.getMonth()];

    const suffix = (dayOfMonth % 10 === 1 && dayOfMonth !== 11)
        ? 'st'
        : (dayOfMonth % 10 === 2 && dayOfMonth !== 12)
            ? 'nd'
            : (dayOfMonth % 10 === 3 && dayOfMonth !== 13)
                ? 'rd'
                : 'th';

    return `${dayName} ${dayOfMonth}${suffix} ${monthName}`;
}


app.get('/', (request, response) => {
    Promise.all([fetchJson('https://dtnl-frontend-case.vercel.app/api/get-forecast'), fetchJson('https://dtnl-frontend-case.vercel.app/api/get-weather')]).then(([forecastData, weatherData]) => {
        // Filter forecast data to only get CELCIUS
        var forecast = forecastData.forecast.filter((forecast) => forecast.metric === "CELCIUS").map((el) => {
            return {
                icon: el.condition.icon,
                date: formatDate(el.date),
                minTemp: el.minTemp,
                maxTemp: el.maxTemp,
                windDirection: el.windDirection,
                precipitation: el.precipitation,
            }
        });

        var temp = weatherData.temperature.temp;
        var title = "";
        var description = ""
        if (temp < 0) {
            title = weatherData.weatherInfo[0].title.replace("{{ CELCIUS }}", temp);
            description = weatherData.weatherInfo[0].description;
        } else if (temp >= 1 && temp <= 10) {
            title = weatherData.weatherInfo[1].title.replace("{{ CELCIUS }}", temp);
            description = weatherData.weatherInfo[1].description;
        } else if (temp >= 11 && temp <= 20) {
            title = weatherData.weatherInfo[2].title.replace("{{ CELCIUS }}", temp);
            description = weatherData.weatherInfo[2].description;
        } else if (temp >= 21 && temp <= 30) {
            title = weatherData.weatherInfo[3].title.replace("{{ CELCIUS }}", temp);
            description = weatherData.weatherInfo[3].description;
        } else if (temp >= 31) {
            title = weatherData.weatherInfo[4].title.replace("{{ CELCIUS }}", temp);
            description = weatherData.weatherInfo[4].description;
        }

        var weather = {
            temp,
            title,
            description,
        }

         response.render('home', { forecast, weather });
    }).catch(error => {
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



app.get('/get-weather', (request, response) => {
    
    fetchJson('https://dtnl-frontend-case.vercel.app/api/get-weather')
        .then((itemsDataFromAPI) => {
            var temp = itemsDataFromAPI.temperature.temp;
            var description = "";
            switch (temp) {
                case value < 0:
                    description = itemsDataFromAPI.weatherInfo[0].replace("{{ CELCIUS }}", temp);
                    break;
                case value >= 1 <= 10:
                    description = itemsDataFromAPI.weatherInfo[1].replace("{{ CELCIUS }}", temp);
                    break;
                case value >= 11 <= 20:
                    description = itemsDataFromAPI.weatherInfo[2].replace("{{ CELCIUS }}", temp);
                    break;
                case value >= 21 <= 30:
                    description = itemsDataFromAPI.weatherInfo[3].replace("{{ CELCIUS }}", temp);
                    break;
                case value >= 31:
                    description = itemsDataFromAPI.weatherInfo[4].replace("{{ CELCIUS }}", temp);
                    break;
            }

            var results = {
                temp,
                description,
            }

            console.log(results);
            
        })
        .catch(error => {
            console.error("Error fetching data from API:", error);
            response.status(500).send("Internal Server Error");
        });
});




// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})