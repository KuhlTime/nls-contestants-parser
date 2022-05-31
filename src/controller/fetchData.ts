import axios from 'axios'
import { TableParser } from '../util/TableParser'

/**
 * Converts the string of the contender to a contender object
 * which may include the city of the contender
 */
function contenderCity(contender: string) {
	const city = contender.match(/\((.*)\)/)
	const name = contender.replace(/\(.*\)/, '').clean()

	return {
		name,
		city: city ? city[1].clean() : undefined
	}
}

/**
 * Fetches the data from the website
 */
async function fetchData(url: string) {
	const response = await axios.get(url)

	const body = response.data
	const table = TableParser.parse(body)[0]
	const rows = table.rows

	const data = rows.map(row => {
		return {
			number: row['Nr.'].value,
			class: row['Bewerber / Fahrer'].value,
			contenders: row['Fahrzeug'].value
				.split(',')
				.map(s => s.clean())
				.map(contenderCity),
			car: row['undefined'].value
		}
	})

	return data
}

export default fetchData
