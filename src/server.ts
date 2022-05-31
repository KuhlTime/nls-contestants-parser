import express from 'express'
import cors from 'cors'

import fetchData from './controller/fetchData'
import cleanArray from './util/cleanArray'

const app = express()
app.use(cors())

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
		const classes = data.map(row => row.class)
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
		const cars = data.map(row => row.car)
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
			acc[car] = (acc[car] || 0) + 1
			return acc
		}, {} as { [key: string]: number })

		res.send(counts)
	} catch (err) {
		res.status(500).send({ error: (err as any).message })
	}
})

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`Server started on port ${port}`)
})
