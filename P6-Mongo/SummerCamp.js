const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') })

const express = require('express');
const ejs = require('ejs');

const app = express();

app.set('views', path.join(__dirname, 'views'));

const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/processApplication', async (req, res) => {
  const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.ssnnqld.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  try {
    await client.connect();
    const databaseName = process.env.MONGO_DB_NAME;
    const collectionName = process.env.MONGO_COLLECTION;
    const applicationData = {
      name: req.body.name,
      email: req.body.email,
      gpa: req.body.gpa,
      background: req.body.background,
      taskCompletedAt: new Date().toLocaleString()
    };
    const result = await insertApplication(client, databaseName, collectionName, applicationData);

    // Render applicationData page with form data
    ejs.renderFile('./templates/applicationData.ejs', {
      name: applicationData.name,
      email: applicationData.email,
      gpa: applicationData.gpa,
      background: applicationData.background,
      taskCompletedAt: applicationData.taskCompletedAt
    }, (err, html) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(html);
    });

  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }

});


app.post('/reviewApplication', async (req, res) => {
  const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.ssnnqld.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  try {
    await client.connect();
    const databaseName = process.env.MONGO_DB_NAME;
    const collectionName = process.env.MONGO_COLLECTION;
    const email = req.body.email;

    // Retrieve application data from the database
    const result = await client.db(databaseName).collection(collectionName).findOne({ email: email });
    if (!result) {
      res.status(404).send('APPLICATION NOT FOUND');
      return;
    }

    // Render the applicationData page with the retrieved data
    ejs.renderFile('./templates/applicationData.ejs', {
      name: result.name,
      email: result.email,
      gpa: result.gpa,
      background: result.background,
      taskCompletedAt: result.taskCompletedAt
    }, (err, html) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(html);
    });

  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});

app.post('/SelectbyGpa', async (req, res) => {
  const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.ssnnqld.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB_NAME);
    const collection = db.collection(process.env.MONGO_COLLECTION);
    
    const inputGpa = parseFloat(req.body.gpa);

    const cursor = await db.collection(process.env.MONGO_COLLECTION).find();
    const applicants = await cursor.toArray();
  
    let foundApplicants = applicants.filter(applicant => applicant.gpa >= inputGpa);

    if (foundApplicants.length === 0) {
      res.send('APPLICATION NOT FOUND');
      return;
    }

    let table = '<table border = 1><tr><th>Name</th><th>GPA</th></tr>';
    for (let i = 0; i < applicants.length; i++) {
        if (applicants[i].gpa >= inputGpa) {
      table += `<tr><td>${applicants[i].name}</td><td>${applicants[i].gpa}</td></tr>`;
    }
  }
    table += '</table>';
    
    ejs.renderFile('./templates/tablewithgpa.ejs', { GPAtable: table }, (err, html) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal server error');
      } else {
        res.send(html);
      }
    });
       
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  } finally {
    await client.close();
  }
});


app.post('/RemovedAdmin', async (req, res) => {
  const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.ssnnqld.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB_NAME);
    const collection = db.collection(process.env.MONGO_COLLECTION);
    
    const result = await collection.deleteMany({});

    const removedNum = result.deletedCount;

    ejs.renderFile('./templates/removed.ejs', { removedNum }, (err, html) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(html);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});


// Render home page
app.get('/', (req, res) => {
  // Render index page
  ejs.renderFile('./templates/index.ejs', (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(html);
  });
});

// Render apply page
app.get('/apply', (req, res) => {
  ejs.renderFile('./templates/apply.ejs', (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(html);
  });
});

app.get('/review-application', (req, res) => {
  ejs.renderFile('./templates/review.ejs', (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(html);
  });
});

app.get('/select-by-gpa', (req, res) => {
  ejs.renderFile('./templates/SelectGpa.ejs', (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(html);
  });
});

app.get('/remove-all-applications', (req, res) => {
  ejs.renderFile('./templates/remove.ejs', (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(html);
  });
});
// Start the server
const port = process.argv[2];
const server = app.listen(port, () => {
  console.log(`WebServer started and running at http://localhost:${port}/`);
  process.stdout.write('Stop to shutdown the server: ');
});

process.stdin.on('data', (data) => {
  const cmd = data.toString().trim();
  if (cmd === 'stop') {
    server.close(() => {
      process.exit(0);
    });
  } else {
    console.log(`Unknown command: ${cmd}`);
    process.stdout.write('Stop to shutdown the server: ');
  }
});


async function insertApplication(client, databaseName, collectionName, applicationData) {
  const db = client.db(databaseName);
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(applicationData);
  return result;
}