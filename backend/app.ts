import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import expensesRouter from './routes/expenses.ts';
import usersRouter from './routes/users.ts';
import categoriesRouter from './routes/categories.ts';


const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', /\.onrender\.com$/],
  })
);

app.get('/ping', (req, res) => {
  res.sendStatus(204);
});

app.use('/api', expensesRouter);
app.use('/api', usersRouter);
app.use('/api', categoriesRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



export default app;
