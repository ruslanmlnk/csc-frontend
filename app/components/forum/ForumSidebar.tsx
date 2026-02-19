import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface ForumSidebarThread {
    title: string;
    authorName: string;
    date: string;
    href?: string;
}

interface ForumSidebarProps {
    title: string;
    popularThreads: ForumSidebarThread[];
    bannerImage: string;
    bannerAlt?: string;
    bannerHref?: string;
}

const ForumSidebar: React.FC<ForumSidebarProps> = ({
    title,
    popularThreads,
    bannerImage,
    bannerAlt = 'Advertisement',
    bannerHref,
}) => {
    const normalizedHref = bannerHref?.trim();
    const isExternalLink = Boolean(normalizedHref && /^https?:\/\//i.test(normalizedHref));
    const bannerImageContent = (
        <Image
            src={bannerImage}
            alt={bannerAlt}
            fill
            className="object-cover"
        />
    );
    const bannerContainerClassName = "relative w-full lg:w-[397px] h-[196.01px] lg:h-[631px] rounded-[40px] lg:rounded-[20px] overflow-hidden";

    return (
        <div className="flex flex-col gap-[24px] w-full lg:w-[397px] shrink-0">
            <div className="w-full bg-[#1A1A1A] border border-[rgba(74,74,74,0.70)] rounded-[40px] py-[31.2px] px-[15.2px] flex flex-col gap-[24px]">
                <div className="w-full px-[16px] flex flex-col gap-[16px]">
                    <div className="w-full flex flex-col gap-[24px]">
                        <div className="w-full flex items-center gap-[16px]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 5.14277V11.9998C24 12.2271 23.9097 12.4451 23.749 12.6059C23.5882 12.7666 23.3702 12.8569 23.1429 12.8569C22.9156 12.8569 22.6975 12.7666 22.5368 12.6059C22.3761 12.4451 22.2857 12.2271 22.2857 11.9998V7.21166L13.4638 16.0347C13.3842 16.1144 13.2896 16.1776 13.1856 16.2207C13.0815 16.2639 12.97 16.2861 12.8574 16.2861C12.7447 16.2861 12.6332 16.2639 12.5291 16.2207C12.4251 16.1776 12.3306 16.1144 12.2509 16.0347L8.57173 12.3544L1.46402 19.4632C1.30319 19.624 1.08505 19.7144 0.857602 19.7144C0.630152 19.7144 0.412018 19.624 0.251186 19.4632C0.0903543 19.3024 0 19.0842 0 18.8568C0 18.6293 0.0903543 18.4112 0.251186 18.2504L7.96532 10.5362C8.04492 10.4565 8.13945 10.3933 8.24351 10.3502C8.34756 10.3071 8.4591 10.2849 8.57173 10.2849C8.68437 10.2849 8.79591 10.3071 8.89996 10.3502C9.00402 10.3933 9.09855 10.4565 9.17815 10.5362L12.8574 14.2165L21.074 5.9999H16.2859C16.0585 5.9999 15.8405 5.90959 15.6798 5.74885C15.519 5.58811 15.4287 5.37009 15.4287 5.14277C15.4287 4.91545 15.519 4.69743 15.6798 4.53669C15.8405 4.37595 16.0585 4.28564 16.2859 4.28564H23.1429C23.3702 4.28564 23.5882 4.37595 23.749 4.53669C23.9097 4.69743 24 4.91545 24 5.14277Z" fill="#F29F04" />
                            </svg>
                            <span className="text-[20px] font-medium leading-[32px]">{title}</span>
                        </div>

                        <div className="w-full flex flex-col gap-[16px]">
                            {popularThreads.map((thread, index) => (
                                <div key={`${thread.title}-${thread.authorName}-${index}`} className="w-full">
                                    <div className="w-full flex flex-col gap-[12px]">
                                        {thread.href ? (
                                            <Link href={thread.href} className="text-[16px] font-medium leading-[32px] line-clamp-1 hover:text-[#F29F04] transition-colors">
                                                {thread.title}
                                            </Link>
                                        ) : (
                                            <h4 className="text-[16px] font-medium leading-[32px] line-clamp-1">{thread.title}</h4>
                                        )}
                                        <div className="flex items-center gap-[10px] text-[#6C6C6C] text-[16px] font-normal leading-[16px]">
                                            <span>{thread.authorName}</span>
                                            <div className="w-[4px] h-[4px] rounded-full bg-[#6C6C6C]" />
                                            <span>{thread.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {normalizedHref ? (
                <a
                    href={normalizedHref}
                    target={isExternalLink ? "_blank" : undefined}
                    rel={isExternalLink ? "noopener noreferrer" : undefined}
                    aria-label={bannerAlt}
                    className={bannerContainerClassName}
                >
                    {bannerImageContent}
                </a>
            ) : (
                <div className={bannerContainerClassName}>
                    {bannerImageContent}
                </div>
            )}
        </div>
    );
};

export default ForumSidebar;
