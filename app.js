'use strict';
const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const app = express();
const transporter = nodemailer.createTransport({
  host: 'smtp.transip.email',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'info@ticketverkoperworden.nl',
    pass: 'naGJc7QQ'
  },
  debug: true,
  logger: true,
});

app.use(bodyParser());

app.get('/', (req, res) => {
  console.log('GET /')
  const html = `
    <html>
      <body>
        <form
           method="post" action="http://localhost:8080">
          <div class="field half first">
            <label for="name">Naam</label>
            <input type="text" name="name" id="name" placeholder="Voornaam + Achternaam"/>
          </div>
          <div class="field half">
            <label for="date_of_birth">Geboortedatum</label>
            <input type="text" name="date_of_birth" id="date_of_birth" placeholder="Dag / Maand / Jaar" />
          </div>
          <div class="field half first">
            <label for="email_input">Email</label>
            <input type="email" name="email_input" id="email_input" placeholder="Email adres" />
          </div>
          <div class="field half">
            <label for="phone_input">Telefoon</label>
            <input type="text" name="phone_input" id="phone_input" placeholder="Telefoonnummer" />
          </div>
          <div class="field half first">
            <label for="studie_choice">Hoogst genoten opleiding</label>
            <div class="select-wrapper">
              <select name="studie_choice" id="studie_choice">
                <option value="">-</option>
                <option value="vmbo">VMBO</option>
                <option value="havo-vwo">Havo / VWO</option>
                <option value="hbo">HBO</option>
                <option value="wo">WO</option>
              </select>
            </div>
          </div>
          <div class="field half first">
            <label for="location">Waar wil je werken</label>
            <div class="select-wrapper">
              <select name="location" id="location">
                <option>-</option>
                <option value="shooters">Shooters</option>
                <option value="beachhouse">Beachhouse</option>
                <option value="crazys">Crazys</option>
                <option value="chupitos">Chupitos</option>
                <option value="heerenvanamstel">Heeren van Amstel</option>
                <option value="aroma">Aroma</option>
                <option value="gusto">Gusto</option>
                <option value="delmar">Del Mar</option>
                <option value="roadhouse">Roadhouse</option>
                <option value="vibes">Vibes</option>
                <option value="quickies">Quickies</option>
                <option value="skylounge">Sky Lounge</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label for="job_title">Welke functie</label>
            <div class="select-wrapper">
              <select name="job_title" id="job_title">
                <option>-</option>
                <option value="bar">Bar</option>
                <option value="bediening">Bediening</option>
                <option value="propper">Propper</option>
                <option value="kaartverkoper">Kaartverkoper</option>
                <option value="keuken">Keuken</option>
                <option value="dj">DJ</option>
              </select>
            </div>
          </div>
          <div class="field half first">
            <label for="start_date">Beschikbaarheid start</label>
            <input type="text" name="start_date" id="start_date" placeholder="bijv. 01 Juni" />
          </div>
          <div class="field half">
            <label for="end_date">Beschikbaarheid eind</label>
            <input type="text" name="end_date" id="end_date" placeholder="bijv. 31 Augustus" />
          </div>
          <div class="field half first">
            <input type="checkbox" id="single_check" name="single_check" />
            <label for="single_check">Ik ben vrijgezel</label>
          </div>
          <div class="field">
            <input ref="fileInput" style={{display: 'none'}} type="file" name="image_upload" id="image_upload" />
            <p class="button button_default"> Upload 3 afbeeldingen</p>
          </div>
          <div class="field">
            <label for="motivation_input">Motivatie</label>
            <textarea name="motivation_input" id="motivation_input" placeholder="Vertel ons kort waarom jij de geschikte persoon bent voor deze functie." rows="6"></textarea>
          </div>
          <input type="submit" value="Verstuur sollicitatie" class="button button_default" />
        </form>
      </body>
    </html>
  `;
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);
});

app.post('/', (req, res) => {
  console.log('POST /');
  console.dir(req.body);

  const mailOptions = {
    from: `"${req.body.name}" <info@ticketverkoperworden.nl>`,
    to: 'rutger@polarrolled.com, zizotje@gmail.com',
    subject: `${req.body.name} heeft gesoliciteerd voor ${req.body.job_title}`,
    text: `Beste ${req.body.location},\n\n${req.body.name} heeft gesolliciteerd voor de functie ${req.body.job_title} binnen jouw bedrijf.\n\nBekijk hieronder de gegevens:\nNaam: ${req.body.name}\n Geboortedatum: ${req.body.date_of_birth}\nEmail:${req.body.email_input}\n Telefoon:${req.body.phone_input}\n Burgerlijke staat: ${req.body.relation_check}Hoogst genoten opleiding: ${req.body.studie_choice}\nBeschikbaarheid: ${req.body.start_date} tot ${req.body.end_date}\n\nHeeft gesolliciteerd voor: ${req.body.job_title}\n\nMotivatie:${req.body.motivation_input}\n\n`, // plaintext body
    html: `<p>Beste ${req.body.location},</p><p>${req.body.name} heeft gesolliciteerd voor de functie ${req.body.job_title} binnen jouw bedrijf.</p><p>Bekijk hieronder de gegevens:</br>Naam: ${req.body.name}</br>Geboortedatum: ${req.body.date_of_birth}</br>Email: ${req.body.email_input}</br> Telefoon: ${req.body.phone_input}</br> Burgerlijke staat: ${req.body.single_check ? 'vrijgezel' : 'anders'}</br>Hoogst genoten opleiding: ${req.body.studie_choice}</br>Beschikbaarheid: ${req.body.start_date} tot ${req.body.end_date}</p><p>Heeft gesolliciteerd voor: ${req.body.job_title}</br>Motivatie:${req.body.motivation_input}</p>` // html body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if(error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <html>
      <head>
        <script>
          window.location = "http://www.mallorcamotion.com";
        </script>
      </head>
      <body>
        <h1>Thank you!</h1>
      </body>
    </html>
  `);
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');

  // verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });
});
