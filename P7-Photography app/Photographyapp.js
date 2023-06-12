const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') })
const express = require('express');
const ejs = require('ejs');
const app = express();
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer')
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




const port = process.argv[2];
const server = app.listen(port, () => {
  console.log(`Server started and running at http://localhost:${port}/`);
  process.stdout.write('Stop to shutdown the server: ');
});

process.stdin.on('data', (data) => {
  const cmd = data.toString().trim();
  if (cmd === 'stop') {
    server.close(() => {
      console.log('Server shutting down...');
      process.exit(0);
    });
  } else {
    console.log(`Unknown command: ${cmd}`);
    process.stdout.write('Stop to shutdown the server: ');
  }
});

const renderFile = (path, res) => {
    ejs.renderFile(path, (err, html) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(html);
    });
  };


const userName = process.env.MONGO_DB_USERNAME;
const emailuser = process.env.EMAIL_USER;

const password = process.env.MONGO_DB_PASSWORD;
const dbname = process.env.MONGO_DB_NAME;
const emailPass = process.env.EMAIL_PASS
const collection = process.env.MONGO_COLLECTION ;
const databaseAndCollection = {db: `${dbname}`, collection:`${collection}`};

const uri = `mongodb+srv://${userName}:${password}@cluster0.ssnnqld.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: emailuser,
      pass: emailPass
  }
});

app.get('/', (req, res) => {
    renderFile('./templates/index.ejs', res);
});

app.get('/appointment', (req, res) => {
    renderFile('./templates/appointment.ejs', res);
});





app.post('/appointment', async (req, res) => {
    message = "For some reason, this appointment was not made. "
  try {
    await client.connect();
    let person = {
      name : req.body.name, email : req.body.email, phone: req.body.phone1 + "-"+ req.body.phone2 + "-" +req.body.phone3, 
    date: req.body.date, plan: req.body.plan, session : req.body.session
     }

    await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(person);
  


     const mailOptions = {
            from: process.env.EMAIL_USER,
            to: person.email,
            subject: 'Appointment Confirmation',
            html: `Dear ${person.name},<br><br>
            Thank you for making an appointment with us. Your appointment has been scheduled on ${person.date} for ${person.session}.<br><br>
            We look forward to seeing you soon.<br><br>
            Best regards,<br>
            Your AfroFlix team`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    ejs.renderFile('./templates/aptmade.ejs', {
      name: person.name,
      email: person.email,
      phone: person.phone,
      date: person.date,
      plan: person.plan,
      session: person.session

    }, (err, html) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(html);
    });


  } catch (e){
    console.error(e)
  } finally {
    await client.close();
  }
  
})

app.get('/prices', (req, res) => {
    renderFile('./templates/prices.ejs', res);
});
app.get('/review', (req, res) => {
    renderFile('./templates/write.review.ejs', res);
});
app.get('/index', (req, res) => {
    renderFile('./templates/index.ejs', res);
});

app.post('/submitreview', async (req, res) => {
    const applicationData = {
        writereview: req.body.writereview
    };
    
    try {
        await insertApplicationData(applicationData);
        ejs.renderFile('./templates/review.ejs', applicationData, (err, html) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
        res.send(html);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
    });

async function insertApplicationData(applicationData) {

    try {
        await client.connect();
        await insertreview(client, databaseAndCollection, applicationData);
    } catch (e) {
        console.error(e);
        throw new Error('Unable to insert application data');
    } finally {
        await client.close();
    }
    }

async function insertreview(client, databaseAndCollection, newReview) {
   await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(newReview);
}



