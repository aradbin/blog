import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET() {
  try {
    const companiesByCategory = await getByCategories()
    const sectors = await getSectors()
    const companiesBySector = await getBySectors(sectors)

    const companies = companiesByCategory.map((item1) => {
      const matchingItem = companiesBySector.find((item2) => item1.code === item2.code)
      return matchingItem ? { ...item1, ...matchingItem } : item1
    })

    return NextResponse.json({ companies })
  } catch (error) {
    console.error(error)
  }
}

const getByCategories = async () => {
  const companies = []
  const categories = ['A', 'B', 'G', 'N', 'Z']
  for (const category of categories) {
    const responseByCategory = await fetch(
      `https://www.dsebd.org/latest_share_price_scroll_group.php?group=${category}`,
    ).then((response) => response.text())

    const $ = cheerio.load(responseByCategory)

    const companiesByCategory = $('.shares-table')
      .find('tbody tr')
      .map((_, tr) => ({
        code: $(tr).find('td:nth-child(2) a').text().trim(),
        price: $(tr).find('td:nth-child(3)').text().trim(),
        category: category,
      }))
      .get()

    companies.push(...companiesByCategory)
  }

  return companies
}

const getSectors = async () => {
  const response = await fetch(`https://dsebd.org/by_industrylisting.php`).then((response) => response.text())

  const $ = cheerio.load(response)

  const sectorsUnformatted = $('.table.table-bordered.background-white')
    .find('tbody tr')
    .map((_, tr) => ({
      name: $(tr).find('td:nth-child(2) a').text().trim(),
      url: $(tr).find('td:nth-child(4) a').attr('href'),
    }))
    .get()

  const sectors = sectorsUnformatted.slice(1, -1)

  return sectors
}

const getBySectors = async (sectors: any) => {
  const companies = []
  for (const sector of sectors) {
    const responseBySector = await fetch(`https://dsebd.org/${sector?.url}`).then((response) => response.text())

    const $ = cheerio.load(responseBySector)

    const companiesBySectorUnformatted = $('.shares-table')
      .find('tbody tr')
      .map((_, tr) => ({
        code: $(tr).find('td:nth-child(2) a').text().trim(),
        sector: sector?.name,
      }))
      .get()

    const companiesBySector = companiesBySectorUnformatted.slice(1)

    companies.push(...companiesBySector)
  }

  return companies
}
