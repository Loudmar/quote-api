const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

app.get('/api/quotes/random', (req, res, next) => {
    res.send({
        quote: getRandomElement(quotes)
    });
});

app.get('/api/quotes', (req, res, next) => {
    const authorQuotes = quotes.filter(author => {
        return author.person === req.query.person;
    });
    if (req.query.person) {
        res.send({
            quotes: authorQuotes
        });
    } else {
        res.send({
            quotes: quotes
        });
    }
});

app.post('/api/quotes', (req, res, next) => {
    const addQuote = {
        quote: req.query.quote,
        person: req.query.person
    };
    if (addQuote.quote && addQuote.person) {
        quotes.push(addQuote);
        res.send({
            quote: addQuote
        });
    } else {
        res.status(400).send();
    }
});

app.put('/api/quotes/:id', (req, res, next) => {
    const quote = quotes.find(quote => quote.id === req.params.id);
    if (quote) {
      const index = quotes.indexOf(quote);
      quote.quote = req.query.quote;
      quote.person = req.query.person;
      quotes.splice(index, 1, quote);
      res.send({"quote": quote});
    } else {
      res.status(404).send();
    }
  });

app.delete('/api/quotes/:id', (req, res) => {
    const quoteIndex = getIndexById(req.params.id, quotes);
    if (quoteIndex !== -1) {
      quotes.splice(quoteIndex, 1);
      res.send({ 
        quote: quotes[quoteIndex] 
    });
    } else {
      res.status(404).send('Quote not found!')
    }
  });

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
  });