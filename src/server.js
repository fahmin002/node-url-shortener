import express from 'express';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url'

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import shortid from 'shortid';
// call dirname to esmodule file
// CommonJS doesn't need this kind of method, it has global variable named "__dirname" itself
const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express();

// using a middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(express.urlencoded({ extended: false }))

// set view engine to ejs
app.set('view engine', 'ejs');
// to prevent error calling path from windows system, it needs to join full path of view folder and parsed it into unix based path typing
app.set('views', join(__dirname, 'views'))

// initialize sqlite db for store information about URL and click count
const db = await open({
  filename: 'src/utils/urlShortener.db',
  driver: sqlite3.Database
});

// create url table
await db.exec(`  
    CREATE TABLE IF NOT EXISTS url (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full TEXT,
      short TEXT,
      clicks INTEGER
  );
`);

// getting home page with all of data
app.get('/' , async (req, res) => {
  try {
    const response = await db.all(`SELECT full, short, clicks from url`);
    res.render('index', {
        title: 'Node.js | URL Shortener',
        data: response
    }) 
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/:shortenedUrl', async (req, res) => {
    try {
        const shortenedUrl = req.params.shortenedUrl;
        const url = await db.get('SELECT full, clicks FROM url WHERE short = ?', shortenedUrl);
        if(url !== undefined) {
            const click = url.clicks + 1;
            db.run('UPDATE url SET clicks = ?', click);
            res.redirect(url.full);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.sendStatus(500);
    }
})

app.post('/shortUrl', async (req, res) => {
  try {
    const fullUrl = req.body.fullUrl;
    const shortUrl = shortid.generate();
    await db.run(`INSERT INTO url(full, short, clicks) VALUES (?, ?, ?);`, 
        [fullUrl, shortUrl, 0]
    )
    res.redirect('/');
  } catch (error) {
    res.sendStatus(500);
  }
})

app.listen(process.env.PORT || 5000, () => {
  console.log('Listening on http://localhost:5000')
});

export default app;