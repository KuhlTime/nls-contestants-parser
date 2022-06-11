import cheerio from 'cheerio'
import '../@types/ArrayExtensions'
import '../@types/StringExtensions'

export interface Entry {
	car: Car
	class: string
	contenders?: Contender[]
	number: string
	imageUrl?: string
}

export interface Contender {
	name?: string
	city?: string
	isTeam?: boolean
}

export interface Car {
	brand: string
	model: string
}

function parse(body: string): Entry[] {
	const $ = cheerio.load(body)
	const $tables = $('table')

	const $table = $tables.first()
	const $rows = $($table).find('tr')

	const entries: Entry[] = []

	$rows.each((ri, row) => {
		if (ri === 0) return
		const $row = $(row)

		const $cells = $row.find('td')

		var entry: Record<string, any> = {}

		$cells.each((i, cell) => {
			const $cell = $(cell)

			// 💩
			switch (i) {
				case 0:
					entry.number = $cell.text().clean()
					break
				case 2:
					entry.class = $cell.text().clean()
					break
				case 3:
					const contenders: Contender[] = []

					const raceHouse = $cell.find('b').first().text().clean()
					raceHouse !== '' ? contenders.push({ name: raceHouse, isTeam: true }) : null

					// Driver names
					if ($cell.html()) {
						$cell
							.html()!
							.split('<br>')
							.forEach((contender: string) => {
								if (contender.clean().length === 0) return

								// replace all occurences the <b></b> tag and everything inside it with an empty string
								contender = contender.replace(/<b.*<\/b>/, '')
								if (contender.clean().length === 0) return

								// store the content the text that is between the "<span" and "</span>" tags
								const city: string | undefined = contender.split('<span class="mobhide">(')[1]?.split(')</span>')[0]

								// replace all occurences the <span></span> tag and everything inside it with an empty string
								let contenderWithoutSpan = contender.replace(/<span.*<\/span>/, '').clean()

								if (contenderWithoutSpan.length === 0) return

								if (contenderWithoutSpan.endsWith(',')) {
									contenderWithoutSpan = contenderWithoutSpan.substring(0, contenderWithoutSpan.length - 1)
								}

								// replace all ' with " inside the contenderWithoutSpan string
								contenderWithoutSpan = contenderWithoutSpan.replace(/"/g, '"')

								contenders.push({ name: contenderWithoutSpan.clean(), isTeam: false, city })
							})
					}

					entry.contenders = contenders
					break

				case 4:
					const lines = $cell.html()?.split('<br>')
					if (lines) {
						entry.car = {
							brand: lines[0].clean(),
							model: lines[1].clean()
						}
					}
					break
				case 5:
					const src = $cell.find('img').attr('src')
					if (src !== '/wp-content/uploads/teilnehmerbilder/small/keinbild.jpg') {
						entry.imageUrl = 'https://www.nuerburgring-langstrecken-serie.de' + $cell.find('img').attr('src')
					}
			}
		})

		entries.push(entry as Entry)
	})

	return entries
}

export default parse
