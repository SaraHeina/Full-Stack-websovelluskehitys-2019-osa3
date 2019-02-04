if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const errorHandler = require('./errorHandler')
const Person = require('./models/person')

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
    Person.find({}).then(persons => {
        res.send(
            `<p> Puhelinluettelossa ${persons.length} henkilön tiedot </p>
          <p>${new Date()}</p>`
        )
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON())
            } else {
                response.status(204).end()
            }
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
    console.log(req.params.id)
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number,
        id: Math.floor(1 + Math.random() * 100000)
    })

    person.save().then(savePerson => {
        res.json(savePerson.toJSON())
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(upPerson => {
            res.json(upPerson.toJSON())
        }).catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
app.use(errorHandler)