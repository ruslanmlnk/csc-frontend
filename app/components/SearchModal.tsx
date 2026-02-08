"use client";

import React, { useEffect, useRef } from 'react';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const categories = ['Blog', 'Conferences', 'Services', 'Partnership', 'Jobs'];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-5 md:p-10 animate-fadeIn"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="w-full max-w-[1240px] h-[90vh] flex flex-col items-center gap-[64px] p-8 md:p-[32px] rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] relative shadow-2xl overflow-y-auto no-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Bar & Close */}
                <div className="flex flex-col items-start gap-[2px] self-stretch">
                    <div className="flex flex-col items-center gap-[32px] self-stretch">

                        {/* Input Row */}
                        <div className="flex items-center gap-[16px] self-stretch">
                            <div className="flex flex-col items-start gap-[10px] flex-1">
                                <div className="flex py-[8px] pl-[24px] pr-[24px] items-center gap-[16px] self-stretch rounded-[80px] border-[0.5px] border-[rgba(74,74,74,0.70)] bg-[#262626]">
                                    <div className="flex py-[8px] items-center gap-[16px] flex-1">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M21.5308 20.4694L16.8368 15.7763C18.1973 14.1429 18.8757 12.0478 18.7309 9.92694C18.5861 7.80607 17.6293 5.82268 16.0593 4.38935C14.4894 2.95602 12.4274 2.18311 10.3021 2.23141C8.17663 2.27971 6.15181 3.1455 4.64888 4.64867C3.14571 6.15184 2.27993 8.17666 2.23163 10.3019C2.18333 12.4272 2.95623 14.4892 4.38956 16.0591C5.82289 17.629 7.80629 18.5859 9.92715 18.7307C12.048 18.8755 14.1431 18.1971 15.7765 16.8366L20.4696 21.5306C20.5393 21.6003 20.622 21.6556 20.713 21.6933C20.8041 21.731 20.9017 21.7504 21.0002 21.7504C21.0988 21.7504 21.1963 21.731 21.2874 21.6933C21.3784 21.6556 21.4612 21.6003 21.5308 21.5306C21.6005 21.4609 21.6558 21.3782 21.6935 21.2872C21.7312 21.1961 21.7506 21.0985 21.7506 21C21.7506 20.9015 21.7312 20.8039 21.6935 20.7128C21.6558 20.6218 21.6005 20.5391 21.5308 20.4694ZM3.75021 10.5C3.75021 9.16498 4.14609 7.85993 4.88779 6.7499C5.62949 5.63987 6.6837 4.77471 7.9171 4.26381C9.1505 3.75292 10.5075 3.61925 11.8171 3.8797C13.1264 4.14015 14.3292 4.78303 15.2732 5.72703C16.2172 6.67103 16.8601 7.87377 17.1205 9.18314C17.381 10.4925 17.2473 11.8497 16.7364 13.0831C16.2255 14.3165 15.3603 15.3707 14.2503 16.1124C13.1403 16.8541 11.8352 17.25 10.5002 17.25C8.71061 17.248 6.99488 16.5362 5.72944 15.2708C4.464 14.0053 3.7522 12.2896 3.75021 10.5Z" fill="#9E9E9E" />
                                        </svg>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            placeholder="Search"
                                            className="bg-transparent border-none outline-none text-white font-poppins text-[16px] font-medium leading-[26px] w-full placeholder-[#9E9E9E]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Close Icon (Plus rotated) */}
                            <button onClick={onClose} className="p-2 transition-all hover:rotate-90 active:scale-95">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M20.4853 20.4852C20.2977 20.6727 20.0434 20.7781 19.7782 20.7781C19.513 20.7781 19.2586 20.6727 19.0711 20.4852L12 13.4141L4.92893 20.4852C4.7414 20.6727 4.48704 20.7781 4.22183 20.7781C3.95661 20.7781 3.70226 20.6727 3.51472 20.4852C3.32718 20.2976 3.22183 20.0433 3.22183 19.7781C3.22183 19.5128 3.32718 19.2585 3.51472 19.071L10.5858 11.9999L3.51472 4.92882C3.32718 4.74129 3.22182 4.48693 3.22183 4.22172C3.22183 3.9565 3.32718 3.70215 3.51472 3.51461C3.70225 3.32707 3.95661 3.22172 4.22182 3.22172C4.48704 3.22172 4.7414 3.32707 4.92893 3.51461L12 10.5857L19.0711 3.51461C19.2586 3.32707 19.513 3.22172 19.7782 3.22172C20.0434 3.22172 20.2977 3.32707 20.4853 3.51461C20.6728 3.70215 20.7782 3.9565 20.7782 4.22172C20.7782 4.48693 20.6728 4.74129 20.4853 4.92882L13.4142 11.9999L20.4853 19.071C20.6728 19.2585 20.7782 19.5128 20.7782 19.7781C20.7782 20.0433 20.6728 20.2976 20.4853 20.4852Z" fill="#D9D9D9" />
                                </svg>
                            </button>
                        </div>

                        {/* Menu Categories */}
                        <div className="flex justify-center items-center gap-[40px]">
                            {categories.map(cat => (
                                <button key={cat} className="text-[#BDBDBD] font-poppins text-[16px] font-normal leading-[26px] hover:text-white transition-colors">
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                <div className="flex flex-col justify-center items-center gap-[32px] flex-1 self-stretch">
                    <div className="flex flex-col items-center gap-[24px]">
                        {/* Icon Container */}
                        <div className="flex w-[64px] h-[64px] p-[15px] justify-center items-center rounded-full bg-[#262626]">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M28.943 27.0574L21.7483 19.8627C23.2075 17.9991 24.0004 15.7004 24.0003 13.3334C24.0003 7.45208 19.215 2.66675 13.3337 2.66675C7.45233 2.66675 2.66699 7.45208 2.66699 13.3334C2.66699 19.2147 7.45233 24.0001 13.3337 24.0001C15.7004 24 17.9989 23.2077 19.863 21.7494L27.0577 28.9441C27.3078 29.1941 27.6471 29.3345 28.0008 29.3343C28.3545 29.3342 28.6936 29.1936 28.9437 28.9434C29.1937 28.6932 29.3341 28.354 29.3339 28.0003C29.3338 27.6466 29.1932 27.3074 28.943 27.0574ZM5.33366 13.3334C5.33366 8.92141 8.92166 5.33341 13.3337 5.33341C17.7457 5.33341 21.3337 8.92141 21.3337 13.3334C21.3337 17.7454 17.7457 21.3334 13.3337 21.3334C8.92166 21.3334 5.33366 17.7454 5.33366 13.3334Z" fill="#BDBDBD" />
                            </svg>
                        </div>

                        {/* Text Container */}
                        <div className="flex flex-col items-center gap-[16px]">
                            <h2 className="text-white text-center font-poppins text-[24px] font-medium leading-[32px]">Start Your Search</h2>
                            <p className="text-[#BDBDBD] text-center font-poppins text-[16px] font-normal leading-[26px]">
                                Enter at least 3 characters to search through our content
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
