import { Skeleton } from '@/components/ui/skeleton'

export default function CompanyCardSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-[115px] w-full rounded-xl" />
      ))}
    </>
  )
}
