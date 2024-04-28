const Footer = () => {
  return (
    <footer className="w-full justify-center border-t border-t-foreground/10 p-4 text-center text-xs">
      <p>
        Powered by{' '}
        <a
          href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Supabase
        </a>
      </p>
    </footer>
  )
}

export default Footer