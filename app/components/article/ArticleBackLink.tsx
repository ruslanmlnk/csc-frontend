import Link from 'next/link'
import React from 'react'

type ArticleBackLinkProps = {
  href?: string
  label?: string
}

const ArticleBackLink: React.FC<ArticleBackLinkProps> = ({ href = '/blog', label = 'Back to News' }) => {
  return (
    <Link href={href} className="flex w-fit items-center gap-4 text-white hover:text-[#F29F04] transition-colors group">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 shrink-0"
      >
        <path
          d="M28.0008 16C28.0008 16.2652 27.8954 16.5196 27.7079 16.7071C27.5204 16.8947 27.266 17 27.0008 17H7.41454L14.7083 24.2925C14.8012 24.3854 14.8749 24.4957 14.9252 24.6171C14.9755 24.7385 15.0013 24.8686 15.0013 25C15.0013 25.1314 14.9755 25.2615 14.9252 25.3829C14.8749 25.5043 14.8012 25.6146 14.7083 25.7075C14.6154 25.8004 14.5051 25.8741 14.3837 25.9244C14.2623 25.9747 14.1322 26.0006 14.0008 26.0006C13.8694 26.0006 13.7393 25.9747 13.6179 25.9244C13.4965 25.8741 13.3862 25.8004 13.2933 25.7075L4.29329 16.7075C4.20031 16.6146 4.12655 16.5043 4.07623 16.3829C4.0259 16.2615 4 16.1314 4 16C4 15.8686 4.0259 15.7385 4.07623 15.6171C4.12655 15.4957 4.20031 15.3854 4.29329 15.2925L13.2933 6.29251C13.4809 6.10487 13.7354 5.99945 14.0008 5.99945C14.2662 5.99945 14.5206 6.10487 14.7083 6.29251C14.8959 6.48015 15.0013 6.73464 15.0013 7.00001C15.0013 7.26537 14.8959 7.51987 14.7083 7.70751L7.41454 15H27.0008C27.266 15 27.5204 15.1054 27.7079 15.2929C27.8954 15.4804 28.0008 15.7348 28.0008 16Z"
          fill="currentColor"
        />
      </svg>
      <span className="text-[24px] font-normal font-poppins leading-8">{label}</span>
    </Link>
  )
}

export default ArticleBackLink
