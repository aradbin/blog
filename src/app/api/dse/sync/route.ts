import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET() {
  try {
    const companiesByCategories = await getByCategories()
    const companiesByIndex = await getByIndex()
    const companiesInfo = await getAmarstock()

    const companies = companiesByCategories.map((company: any) => {
      const matchingItemByIndex = companiesByIndex.find((item) => item.code === company.code)
      const matchingItemByInfo = companiesInfo.find((item: any) => item.Scrip === company.code)

      return {
        ...company,
        indexes: matchingItemByIndex?.indexes || null,
        ...matchingItemByInfo,
      }
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

const getBySectors = async () => {
  const sectors = await getSectors()
  const companies = []
  for (const sector of sectors) {
    const responseBySector = await fetch(`https://dsebd.org/${sector?.url}`).then((response) => response.text())

    const $ = cheerio.load(responseBySector)

    const companiesBySector = $('.shares-table')
      .find('tbody tr')
      .find('td:nth-child(2) a')
      .map((_, element) => ({
        code: $(element).text().trim(),
        sector: sector?.name,
      }))
      .get()

    companies.push(...companiesBySector)
  }

  return companies
}

const getByIndex = async () => {
  const companies: { code: string; indexes: string[] }[] = []
  const indexes = [
    { name: 'DS30', url: 'dse30_share.php' },
    { name: 'DSEX', url: 'dseX_share.php' },
  ]

  for (const index of indexes) {
    const responseByIndex = await fetch(`https://www.dsebd.org/${index.url}`).then((response) => response.text())

    const $ = cheerio.load(responseByIndex)

    const companyElements = $('.shares-table tbody tr').find('td:nth-child(2) a')

    companyElements.each((_, element) => {
      const code = $(element).text().trim()
      const existingCompany = companies.find((company) => company.code === code)

      if (existingCompany) {
        existingCompany.indexes.push(index.name)
      } else {
        companies.push({ code, indexes: [index.name] })
      }
    })
  }

  return companies
}

const getAmarstock = async () => {
  const info = await fetch(`https://www.amarstock.com/LatestPrice/34267d8d73dd`).then((response) => response.json())

  return info
}
