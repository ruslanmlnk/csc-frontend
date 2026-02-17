import React from 'react';

const ForumThreadCard: React.FC = () => {
    return (
        <div className="bg-[#1A1A1A] border border-[rgba(74,74,74,0.70)] rounded-[40px] p-[24px] flex flex-col gap-[24px]">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-[16px]">
                    <div className="w-[64px] h-[64px] rounded-[18px] bg-[#F29F04] flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 3C9.27125 3 4 6.075 4 10V22C4 25.925 9.27125 29 16 29C22.7288 29 28 25.925 28 22V10C28 6.075 22.7288 3 16 3ZM26 16C26 17.2025 25.015 18.4288 23.2987 19.365C21.3662 20.4188 18.7738 21 16 21C13.2262 21 10.6337 20.4188 8.70125 19.365C6.985 18.4288 6 17.2025 6 16V13.92C8.1325 15.795 11.7787 17 16 17C20.2213 17 23.8675 15.79 26 13.92V16ZM8.70125 6.635C10.6337 5.58125 13.2262 5 16 5C18.7738 5 21.3662 5.58125 23.2987 6.635C25.015 7.57125 26 8.7975 26 10C26 11.2025 25.015 12.4288 23.2987 13.365C21.3662 14.4187 18.7738 15 16 15C13.2262 15 10.6337 14.4187 8.70125 13.365C6.985 12.4288 6 11.2025 6 10C6 8.7975 6.985 7.57125 8.70125 6.635ZM23.2987 25.365C21.3662 26.4188 18.7738 27 16 27C13.2262 27 10.6337 26.4188 8.70125 25.365C6.985 24.4287 6 23.2025 6 22V19.92C8.1325 21.795 11.7787 23 16 23C20.2213 23 23.8675 21.79 26 19.92V22C26 23.2025 25.015 24.4287 23.2987 25.365Z" fill="#212121" />
                        </svg>
                    </div>

                    <div className="flex flex-col gap-[10px]">
                        <h3 className="text-[20px] font-medium leading-[32px]">News and announcements</h3>
                        <span className="text-[#6C6C6C] text-[16px]">We read, delve into, discuss</span>
                    </div>
                </div>

                <div className="flex flex-col gap-[10px] pl-[20px] border-l border-white/20 items-start">
                    <h4 className="text-[16px] text-white line-clamp-1 w-[140px] text-ellipsis text-left">News and announcements</h4>
                    <div className="flex items-center gap-[10px] text-[#6C6C6C] text-[16px]">
                        <span>ClickStorm</span>
                        <div className="w-[4px] h-[4px] bg-[#6C6C6C] rounded-full" />
                        <span>Mar 10, 2025</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForumThreadCard;
