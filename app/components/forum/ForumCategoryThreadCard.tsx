import React from 'react';
import Image from 'next/image';

interface ForumCategoryThreadCardProps {
    title: string;
    description: string;
    authorName: string;
    date: string;
    replyCount: number;
    authorAvatar: string;
}

const ForumCategoryThreadCard: React.FC<ForumCategoryThreadCardProps> = ({
    title,
    description,
    authorName,
    date,
    replyCount,
    authorAvatar,
}) => {
    return (
        <div className="w-full rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 flex flex-col gap-6 lg:p-[23.2px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
            <div className="flex flex-col gap-4 min-w-0">
                <div className="flex items-center gap-2.5 self-end lg:hidden">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.8428 4.62479L15.3749 0.155966C15.2264 0.00735903 15.05 -0.110524 14.8558 -0.190952C14.6617 -0.271379 14.4536 -0.312775 14.2435 -0.312775C14.0333 -0.312775 13.8253 -0.271379 13.6311 -0.190952C13.437 -0.110524 13.2606 0.00735903 13.112 0.155966L0.78149 12.4875C0.632275 12.6355 0.513974 12.8117 0.433463 13.0059C0.352951 13.2 0.311837 13.4083 0.312508 13.6185V18.0873C0.312508 18.5116 0.481073 18.9186 0.781119 19.2186C1.08117 19.5187 1.48812 19.6872 1.91245 19.6872H6.38128C6.59146 19.6879 6.79968 19.6468 6.99384 19.5663C7.18799 19.4858 7.3642 19.3675 7.51223 19.2182L19.8428 6.88771C19.9914 6.73914 20.1093 6.56274 20.1897 6.36861C20.2701 6.17447 20.3115 5.96639 20.3115 5.75625C20.3115 5.54611 20.2701 5.33803 20.1897 5.1439C20.1093 4.94976 19.9914 4.77337 19.8428 4.62479ZM2.24343 13.2875L10.7121 4.81879L12.381 6.48772L3.91237 14.9554L2.24343 13.2875ZM1.91245 15.2184L4.78134 18.0873H1.91245V15.2184ZM6.71226 17.7563L5.04333 16.0874L13.512 7.61868L15.1809 9.28762L6.71226 17.7563ZM16.3119 8.15666L11.8431 3.68783L14.243 1.28792L18.7118 5.75575L16.3119 8.15666Z" fill="#F29F04" />
                    </svg>
                    <div className="text-[#F29F04] font-poppins text-[20px] font-medium leading-[32px]">
                        {replyCount}
                    </div>
                </div>

                <div className="flex items-center gap-4 min-w-0">
                    <div className="flex w-[50px] h-[50px] p-[12.5px] items-center justify-center rounded-[14.286px] bg-[#F29F04] shrink-0 lg:w-16 lg:h-16 lg:p-4 lg:rounded-[18.286px]">
                        <svg className="w-[25px] h-[25px] lg:w-8 lg:h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 3C9.27125 3 4 6.075 4 10V22C4 25.925 9.27125 29 16 29C22.7288 29 28 25.925 28 22V10C28 6.075 22.7288 3 16 3ZM26 16C26 17.2025 25.015 18.4288 23.2987 19.365C21.3662 20.4188 18.7738 21 16 21C13.2262 21 10.6337 20.4188 8.70125 19.365C6.985 18.4288 6 17.2025 6 16V13.92C8.1325 15.795 11.7787 17 16 17C20.2213 17 23.8675 15.79 26 13.92V16ZM8.70125 6.635C10.6337 5.58125 13.2262 5 16 5C18.7738 5 21.3662 5.58125 23.2987 6.635C25.015 7.57125 26 8.7975 26 10C26 11.2025 25.015 12.4288 23.2987 13.365C21.3662 14.4187 18.7738 15 16 15C13.2262 15 10.6337 14.4187 8.70125 13.365C6.985 12.4288 6 11.2025 6 10C6 8.7975 6.985 7.57125 8.70125 6.635ZM23.2987 25.365C21.3662 26.4188 18.7738 27 16 27C13.2262 27 10.6337 26.4188 8.70125 25.365C6.985 24.4287 6 23.2025 6 22V19.92C8.1325 21.795 11.7787 23 16 23C20.2213 23 23.8675 21.79 26 19.92V22C26 23.2025 25.015 24.4287 23.2987 25.365Z" fill="#212121" />
                        </svg>
                    </div>

                    <div className="flex flex-col items-start gap-[5px] min-w-0 lg:flex-row lg:gap-6 lg:items-start">
                        <div className="text-white font-poppins text-[16px] lg:text-[20px] font-medium leading-[26px] lg:leading-[32px] truncate">
                            {title}
                        </div>
                        <div className="text-[#6C6C6C] font-poppins text-[14px] font-normal leading-[16px] lg:hidden">
                            {description}
                        </div>

                        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.8428 4.62479L15.3749 0.155966C15.2264 0.00735903 15.05 -0.110524 14.8558 -0.190952C14.6617 -0.271379 14.4536 -0.312775 14.2435 -0.312775C14.0333 -0.312775 13.8253 -0.271379 13.6311 -0.190952C13.437 -0.110524 13.2606 0.00735903 13.112 0.155966L0.78149 12.4875C0.632275 12.6355 0.513974 12.8117 0.433463 13.0059C0.352951 13.2 0.311837 13.4083 0.312508 13.6185V18.0873C0.312508 18.5116 0.481073 18.9186 0.781119 19.2186C1.08117 19.5187 1.48812 19.6872 1.91245 19.6872H6.38128C6.59146 19.6879 6.79968 19.6468 6.99384 19.5663C7.18799 19.4858 7.3642 19.3675 7.51223 19.2182L19.8428 6.88771C19.9914 6.73914 20.1093 6.56274 20.1897 6.36861C20.2701 6.17447 20.3115 5.96639 20.3115 5.75625C20.3115 5.54611 20.2701 5.33803 20.1897 5.1439C20.1093 4.94976 19.9914 4.77337 19.8428 4.62479ZM2.24343 13.2875L10.7121 4.81879L12.381 6.48772L3.91237 14.9554L2.24343 13.2875ZM1.91245 15.2184L4.78134 18.0873H1.91245V15.2184ZM6.71226 17.7563L5.04333 16.0874L13.512 7.61868L15.1809 9.28762L6.71226 17.7563ZM16.3119 8.15666L11.8431 3.68783L14.243 1.28792L18.7118 5.75575L16.3119 8.15666Z" fill="#F29F04" />
                            </svg>
                            <div className="text-[#F29F04] font-poppins text-[20px] font-medium leading-[32px]">
                                {replyCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex items-center justify-between border-t border-white/20 pt-5 lg:w-auto lg:pt-0 lg:pl-5 lg:border-t-0 lg:border-l lg:gap-2.5">
                <div className="flex flex-col items-start gap-[5px]">
                    <div className="overflow-hidden text-[#FFF] text-ellipsis whitespace-nowrap font-poppins text-[16px] font-normal leading-[26px] lg:leading-[32px] w-[140px]">
                        {authorName}
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="text-[#6C6C6C] font-poppins text-[16px] font-normal leading-[26px] lg:leading-[16px]">
                            {date}
                        </div>
                    </div>
                </div>

                <div className="relative w-14 h-14 lg:w-[68px] lg:h-[68px] rounded-full border border-white/50 overflow-hidden shrink-0 bg-[#333]">
                    <Image
                        src={authorAvatar}
                        alt="Author"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default ForumCategoryThreadCard;
