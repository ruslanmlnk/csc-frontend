import Image from 'next/image'
import { Facebook, Globe, Instagram, Linkedin, Music2, Send } from 'lucide-react'
import React from 'react'

type AuthorSocialLinks = {
  facebook?: string
  instagram?: string
  linkedin?: string
  telegram?: string
  tiktok?: string
  website?: string
}

type ArticleAuthorCardProps = {
  authorName: string
  authorBio: string
  authorPosition: string
  authorAvatar: string
  authorSocials?: AuthorSocialLinks
}

const toExternalUrl = (url?: string): string | null => {
  if (!url) return null
  const value = url.trim()
  if (!value) return null
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  return `https://${value}`
}

const ArticleAuthorCard: React.FC<ArticleAuthorCardProps> = ({
  authorName,
  authorBio,
  authorPosition,
  authorAvatar,
  authorSocials,
}) => {
  const socialLinks = [
    {
      key: 'facebook',
      label: 'Facebook',
      href: toExternalUrl(authorSocials?.facebook),
      icon: <Facebook className="w-4 h-4" />,
    },
    {
      key: 'instagram',
      label: 'Instagram',
      href: toExternalUrl(authorSocials?.instagram),
      icon: <Instagram className="w-4 h-4" />,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      href: toExternalUrl(authorSocials?.linkedin),
      icon: <Linkedin className="w-4 h-4" />,
    },
    {
      key: 'telegram',
      label: 'Telegram',
      href: toExternalUrl(authorSocials?.telegram),
      icon: <Send className="w-4 h-4" />,
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      href: toExternalUrl(authorSocials?.tiktok),
      icon: <Music2 className="w-4 h-4" />,
    },
    {
      key: 'website',
      label: 'Website',
      href: toExternalUrl(authorSocials?.website),
      icon: <Globe className="w-4 h-4" />,
    },
  ].filter((item) => Boolean(item.href))

  return (
    <div className="self-stretch relative overflow-hidden rounded-[20px] border border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] p-10 mt-8 flex flex-col justify-center items-start gap-10">
      <div className="self-stretch flex flex-col md:flex-row items-start md:items-end gap-6">
        <div className="relative w-[84px] h-[84px] rounded-full overflow-hidden shrink-0">
          <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
        </div>
        <div className="flex-1 flex flex-col justify-center items-start gap-3">
          <h3 className="text-white text-[32px] font-medium leading-[40px] tracking-[-0.64px]">{authorName}</h3>
          <p className="text-[#BDBDBD] text-[20px] leading-[32px]">{authorPosition}</p>
        </div>
        {socialLinks.length > 0 ? (
          <div className="flex items-center gap-6">
            {socialLinks.map(({ key, href, label, icon }) => (
              <a
                key={key}
                href={href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-[120px] bg-[#FCFCFC] flex items-center justify-center text-[#F29F04] hover:opacity-80 transition-opacity"
              >
                {icon}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <p className="self-stretch text-[#9E9E9E] text-[16px] leading-[26px]">{authorBio}</p>
    </div>
  )
}

export default ArticleAuthorCard
