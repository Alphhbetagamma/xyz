import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const port = 4000;

app.use(bodyParser.json());

app.get('/ping', (req: Request, res: Response) => {
  res.send('true');
});

app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  const submission = { name, email, phone, github_link, stopwatch_time };
  
  let data = [];
  if (fs.existsSync('src/db.json')) {
    data = JSON.parse(fs.readFileSync('src/db.json', 'utf-8'));
  }
  data.push(submission);
  fs.writeFileSync('src/db.json', JSON.stringify(data, null, 2));

  res.send('Submission received');
});

app.get('/read', (req: Request, res: Response) => {
  const index = parseInt(req.query.index as string, 10);
  if (isNaN(index)) {
    res.status(400).send('Invalid index');
    return;
  }

  if (!fs.existsSync('src/db.json')) {
    res.status(404).send('No data found');
    return;
  }

  const data = JSON.parse(fs.readFileSync('src/db.json', 'utf-8'));
  if (index < 0 || index >= data.length) {
    res.status(404).send('Index out of range');
    return;
  }

  res.json(data[index]);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
