import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ForumThreadOriginalPostProps {
    threadTitle: string;
    authorName: string;
    authorRole: string;
    authorAvatar: string;
    authorProfileHref?: string | null;
    date: string;
    content: string;
}

const ForumThreadOriginalPost: React.FC<ForumThreadOriginalPostProps> = ({
    threadTitle,
    authorName,
    authorRole,
    authorAvatar,
    authorProfileHref,
    date,
    content,
}) => {
    return (
        <div className="flex flex-col items-start self-stretch">
            <div className="relative flex flex-col items-start gap-6 self-stretch rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 overflow-hidden">
                <div className="pointer-events-none absolute left-[-382.5px] top-[-732.835px] w-[1818px] h-[1818px] opacity-40">
                    <svg width="1818" height="1818" viewBox="0 0 1818 1818" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#op-filter0)">
                            <circle cx="908.835" cy="888.311" r="624.773" fill="url(#op-paint0)" fillOpacity="0.4" />
                        </g>
                        <g filter="url(#op-filter1)">
                            <circle cx="908.833" cy="925.256" r="783.224" fill="url(#op-paint1)" fillOpacity="0.5" />
                        </g>
                        <g filter="url(#op-filter2)">
                            <circle cx="908.835" cy="908.835" r="908.835" fill="url(#op-paint2)" fillOpacity="0.2" />
                        </g>
                        <defs>
                            <filter id="op-filter0" x="214.062" y="193.538" width="1389.55" height="1389.55" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feGaussianBlur stdDeviation="35" result="effect1_foregroundBlur" />
                            </filter>
                            <filter id="op-filter1" x="85.6094" y="102.032" width="1646.45" height="1646.45" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feGaussianBlur stdDeviation="20" result="effect1_foregroundBlur" />
                            </filter>
                            <filter id="op-filter2" x="-60" y="-60" width="1937.67" height="1937.67" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feGaussianBlur stdDeviation="30" result="effect1_foregroundBlur" />
                            </filter>
                            <radialGradient id="op-paint0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(908.835 575.924) rotate(90) scale(312.386 501.385)">
                                <stop stopColor="#F29F04" stopOpacity="0.26" />
                                <stop offset="1" stopColor="#F29F04" stopOpacity="0.5" />
                            </radialGradient>
                            <linearGradient id="op-paint1" x1="908.833" y1="142.032" x2="908.833" y2="664.868" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FFD8D4" stopOpacity="0.16" />
                                <stop offset="1" stopColor="#FF9C94" stopOpacity="0.19" />
                            </linearGradient>
                            <linearGradient id="op-paint2" x1="908.835" y1="0" x2="908.835" y2="606.686" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FFD8D4" stopOpacity="0.16" />
                                <stop offset="1" stopColor="#FF9C94" stopOpacity="0.19" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col justify-end items-end gap-8 self-stretch">
                    <div className="h-16 self-stretch">
                        <div className="h-full w-full rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#F29F04] px-6 flex items-center">
                            <h2 className="text-[#0D0D0D] font-poppins text-[20px] font-medium leading-[32px]">
                                {threadTitle}
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-6 self-stretch">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between self-stretch">
                            <div className="flex h-12 items-center gap-6">
                                <div className="flex justify-center items-center gap-4">
                                    {authorProfileHref ? (
                                        <Link
                                            href={authorProfileHref}
                                            aria-label={`${authorName} profile`}
                                            className="inline-flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F29F04] rounded-[48px]"
                                        >
                                            <div className="relative w-12 h-12 rounded-[48px] border-[0.48px] border-white/50 overflow-hidden shrink-0">
                                                <Image
                                                    src={authorAvatar}
                                                    alt="Author"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="text-[#F29F04] font-poppins text-[20px] font-medium leading-[32px]">
                                                {authorName}
                                            </div>
                                        </Link>
                                    ) : (
                                        <>
                                            <div className="relative w-12 h-12 rounded-[48px] border-[0.48px] border-white/50 overflow-hidden shrink-0">
                                                <Image
                                                    src={authorAvatar}
                                                    alt="Author"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="text-[#F29F04] font-poppins text-[20px] font-medium leading-[32px]">
                                                {authorName}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="flex p-[2px] flex-col justify-center items-center rounded-[40px] bg-[rgba(242,159,4,0.25)]">
                                    <div className="flex py-[6px] px-3 justify-center items-center rounded-[24px] border border-[#F29F04]">
                                        <span className="text-white text-center font-poppins text-[14px] font-normal leading-[16px]">
                                            {authorRole}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-[#6C6C6C] text-right font-poppins text-[16px] font-normal leading-[16px]">
                                {date}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-end gap-4 self-stretch">
                            <div className="flex p-6 items-center gap-2.5 self-stretch rounded-[30px] bg-[#262626]">
                                <p className="text-white font-poppins text-[20px] font-medium leading-[32px] whitespace-pre-line">
                                    {content}
                                </p>
                            </div>
                        </div>
                    </div>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5 3C13.1859 3.00364 10.0086 4.32177 7.66518 6.66518C5.32177 9.0086 4.00364 12.1859 4 15.5V26C4 26.5304 4.21071 27.0391 4.58579 27.4142C4.96086 27.7893 5.46957 28 6 28H16.5C19.8152 28 22.9946 26.683 25.3388 24.3388C27.683 21.9946 29 18.8152 29 15.5C29 12.1848 27.683 9.00537 25.3388 6.66117C22.9946 4.31696 19.8152 3 16.5 3ZM16.5 26H6V15.5C6 13.4233 6.61581 11.3932 7.76957 9.66651C8.92332 7.9398 10.5632 6.59399 12.4818 5.79926C14.4004 5.00454 16.5116 4.79661 18.5484 5.20175C20.5852 5.6069 22.4562 6.60693 23.9246 8.07538C25.3931 9.54383 26.3931 11.4148 26.7982 13.4516C27.2034 15.4884 26.9955 17.5996 26.2007 19.5182C25.406 21.4368 24.0602 23.0767 22.3335 24.2304C20.6068 25.3842 18.5767 26 16.5 26Z" fill="#6C6C6C" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default ForumThreadOriginalPost;
