import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET(req: NextRequest, { params }: { params: { category: string } }) {
  console.log(params)
  try {
    const response = await fetch(
      `https://www.dsebd.org/latest_share_price_scroll_group.php?group=${params.category}`,
    ).then((response) => response.text())

    const $ = cheerio.load(response)

    const companies = $('.shares-table')
      .find('tbody tr')
      .map((_, tr) => {
        return {
          name: $(tr).find('td:nth-child(2) a').text().trim(),
          price: $(tr).find('td:nth-child(3)').text(),
        }
      })
      .get()

    return NextResponse.json({ companies })
  } catch (error) {
    console.error(error)
  }
}
