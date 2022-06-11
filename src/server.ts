import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import fetchData from './controller/fetchData'
import cleanArray from './util/cleanArray'

const app = express()

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

app.use(cors())
app.use(limiter)

const url = 'https://www.nuerburgring-langstrecken-serie.de/de/nls-teilnehmer-2022/'

app.get('/', async (req, res) => {
	try {
		const data = await fetchData(url)
		res.send(data)
	} catch (err) {
		res.status(500).send({ error: (err as any).message })
	}
})

app.get('/classes', async (req, res) => {
	try {
		const data = await fetchData(url)
		const classes = data.map(entry => entry.class)
		res.send(cleanArray(classes).sort())
	} catch (err) {
		res.status(500).send({ error: (err as any).message })
	}
})

app.get('/classes/count', async (req, res) => {
	try {
		const data = await fetchData(url)
		const classes = data.map(row => row.class)

		const counts = classes.reduce((acc, car) => {
			acc[car] = (acc[car] || 0) + 1
			return acc
		}, {} as { [key: string]: number })

		res.send(counts)
	} catch (err) {
		res.status(500).send({ error: (err as any).message })
	}
})

app.get('/cars', async (req, res) => {
	try {
		const data = await fetchData(url)
		const cars = data.map(row => row.car.combined)
		res.send(cleanArray(cars).sort())
	} catch (err) {
		res.status(500).send({ error: (err as any).message })
	}
})

app.get('/cars/count', async (req, res) => {
	try {
		const data = await fetchData(url)
		const cars = data.map(row => row.car)

		const counts = cars.reduce((acc, car) => {
			acc[car.combined] = (acc[car.combined] || 0) + 1
			return acc
		}, {} as { [key: string]: number })

		res.send(counts)
	} catch (err) {
		res.status(500).send({ error: (err as any).message })
	}
})

app.get('/drivers', async (req, res) => {
	try {
		const data = await fetchData(url)
		const drivers = data.flatMap(row => row.contenders.map(contender => contender.name))

		res.send(drivers)
	} catch (err) {
		res.status(500).send({ error: (err as any).message })
	}
})

app.get('/drivers/count', async (req, res) => {
	try {
		const data = await fetchData(url)
		const drivers = data.flatMap(row => row.contenders.map(contender => contender.name))

		res.send({ count: drivers.length })
	} catch (err) {
		res.status(500).send({ error: (err as any).message })
	}
})

// A team name is not always avaialble
app.get('/teams', async (req, res) => {
	try {
		const data = await fetchData(url)
		const teams = data.flatMap(row => row.team)

		res.send(cleanArray(teams))
	} catch (err) {
		res.status(500).send({ error: (err as any).message })
	}
})

// A team name is not always avaialble
app.get('/teams/count', async (req, res) => {
	try {
		const data = await fetchData(url)
		const teams = data.flatMap(row => row.team)

		res.send({ count: teams.length })
	} catch (err) {
		res.status(500).send({ error: (err as any).message })
	}
})

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`Server started on port ${port}`)
})
