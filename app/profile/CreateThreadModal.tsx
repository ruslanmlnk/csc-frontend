"use client";

import React, { useEffect, useState } from 'react';

interface CreateThreadModalProps {
    isOpen: boolean;
    onClose: () => void;
    // In a real app, we'd have an onSubmit prop here
}

const CreateThreadModal: React.FC<CreateThreadModalProps> = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('Facebook');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const platforms = ['Facebook', 'Keitaro', 'TikTok'];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-5 md:p-10 animate-fadeIn backdrop-blur-[5px]"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="w-full max-w-[900px] flex flex-col gap-10 p-10 md:p-10 rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] relative shadow-2xl overflow-y-auto no-scrollbar max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px]">
                        Create a new thread
                    </h2>
                    <button onClick={onClose} className="p-2 transition-all hover:rotate-90 active:scale-95 text-[#D9D9D9]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M20.4853 20.4852C20.2977 20.6727 20.0434 20.7781 19.7782 20.7781C19.513 20.7781 19.2586 20.6727 19.0711 20.4852L12 13.4141L4.92893 20.4852C4.7414 20.6727 4.48704 20.7781 4.22183 20.7781C3.95661 20.7781 3.70226 20.6727 3.51472 20.4852C3.32718 20.2976 3.22183 20.0433 3.22183 19.7781C3.22183 19.5128 3.32718 19.2585 3.51472 19.071L10.5858 11.9999L3.51472 4.92882C3.32718 4.74129 3.22182 4.48693 3.22183 4.22172C3.22183 3.9565 3.32718 3.70215 3.51472 3.51461C3.70225 3.32707 3.95661 3.22172 4.22182 3.22172C4.48704 3.22172 4.7414 3.32707 4.92893 3.51461L12 10.5857L19.0711 3.51461C19.2586 3.32707 19.513 3.22172 19.7782 3.22172C20.0434 3.22172 20.2977 3.32707 20.4853 3.51461C20.6728 3.70215 20.7782 3.9565 20.7782 4.22172C20.7782 4.48693 20.6728 4.74129 20.4853 4.92882L13.4142 11.9999L20.4853 19.071C20.6728 19.2585 20.7782 19.5128 20.7782 19.7781C20.7782 20.0433 20.6728 20.2976 20.4853 20.4852Z" fill="currentColor" />
                        </svg>
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex flex-col gap-10 w-full">
                    {/* Thread Title */}
                    <div className="flex flex-col gap-4">
                        <label className="font-poppins text-[16px] leading-[26px]">
                            <span className="text-[#9E9E9E]">Thread title </span>
                            <span className="text-[#F29F04]">*</span>
                        </label>
                        <div className="flex p-[16px_24px] items-center gap-[10px] rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626]">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter the name of the thread..."
                                className="bg-transparent border-none outline-none text-white font-poppins text-[16px] leading-[32px] w-full placeholder-[#A5A5A5]"
                            />
                        </div>
                    </div>

                    {/* Category Dropdown */}
                    <div className="flex flex-col gap-4">
                        <label className="font-poppins text-[16px] leading-[26px]">
                            <span className="text-[#9E9E9E]">Category </span>
                            <span className="text-[#F29F04]">*</span>
                        </label>
                        <div className="flex p-[16px_24px] justify-between items-center rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626] cursor-pointer group">
                            <span className="text-[#A5A5A5] font-poppins text-[16px] leading-[32px]">
                                {category || "Select a category"}
                            </span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-y-0.5">
                                <path d="M14.049 3.85762C14.4953 3.41131 15.2188 3.41131 15.6651 3.85762C16.1114 4.30394 16.1114 5.02738 15.6651 5.47369L9.12937 12.0094C8.50573 12.6331 7.49408 12.6331 6.87044 12.0094L0.334729 5.47369C-0.111573 5.02738 -0.111579 4.30393 0.334729 3.85762C0.781045 3.41132 1.50449 3.41132 1.9508 3.85762L7.99991 9.90673L14.049 3.85762Z" fill="#F29F04" />
                            </svg>
                        </div>
                    </div>

                    {/* Tag Platform */}
                    <div className="flex flex-col gap-4">
                        <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">
                            Tag platform
                        </label>
                        <div className="flex p-[8px_16px_8px_8px] items-center gap-[16px] rounded-[80px] border border-[rgba(74,74,74,0.70)] bg-[#262626] w-fit">
                            {platforms.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setSelectedPlatform(p)}
                                    className={`flex px-4 py-2 justify-center items-center rounded-[80px] transition-all font-poppins text-[16px] leading-[26px] ${selectedPlatform === p
                                            ? 'bg-[#F29F04] text-[#070707] font-medium'
                                            : 'text-[#FCFCFC] font-normal hover:bg-white/5'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-4">
                        <label className="font-poppins text-[16px] leading-[26px]">
                            <span className="text-[#9E9E9E]">Content </span>
                            <span className="text-[#F29F04]">*</span>
                        </label>
                        <div className="flex h-[250px] p-[16px_24px] items-start gap-[10px] rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626]">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write the content of your thread..."
                                className="bg-transparent border-none outline-none text-white font-poppins text-[16px] leading-[32px] w-full h-full resize-none placeholder-[#A5A5A5]"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-[10px] w-full h-[58px]">
                    <button
                        onClick={onClose}
                        className="flex flex-1 py-[12px] px-[24px] justify-center items-center rounded-[80px] border border-[#FCC660] text-[#FCC660] font-poppins text-[16px] font-medium leading-[26px] transition-all hover:bg-[#FCC660]/10"
                    >
                        Cancel
                    </button>
                    <button
                        className="flex flex-1 py-[12px] px-[24px] justify-center items-center rounded-[80px] bg-[#F29F04] text-[#0D0D0D] font-poppins text-[16px] font-medium leading-[26px] transition-all hover:brightness-110"
                    >
                        Create a thread
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateThreadModal;
