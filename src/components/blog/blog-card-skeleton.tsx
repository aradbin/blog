import { Skeleton } from '@/components/ui/skeleton'

export default function BlogCardSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-[350px] w-full rounded-xl" />
      ))}
    </>
  )
}
