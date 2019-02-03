const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', (req) => { 
    return JSON.stringify(req.body)
})



let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '045-1236543',
    },
    {
        id: 2,
        name: 'Arto Järvinen',
        number: '041-21423123',
    },
    {
        id: 3,
        name: 'Lea Kutvonen',
        number: '040-4323234',
    },
    {
        id: 4,
        name: 'Martti Tienari',
        number: '09-784232',
    },
]

app.get('/info', (req, res) => {
    res.send(
        `<p> Puhelinluettelossa ${persons.length} henkilön tiedot </p>
          <p>${new Date()}</p>`
    )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === "" || body.number === "") {
        return res.status(400).json({error: 'content missing'})
    }
    else if (persons.some(p => p.name === body.name)) {
        return res.status(400).json({error: 'name must be unique'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(1 + Math.random() * 100000)
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})