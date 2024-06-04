export const Portfolio = ({ portfolio }: any) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center">{portfolio.name}</h1>
    </div>
  )
}
