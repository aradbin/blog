interface Blog {
  id: string
  title: string
  description: string | null
  banner: string | null
  published: boolean
  created_at: Date
  created_by: string | null
}
