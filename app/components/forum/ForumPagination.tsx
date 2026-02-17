import React from 'react';

interface ForumPaginationProps {
    showingFrom: number;
    showingTo: number;
    total: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const ForumPagination: React.FC<ForumPaginationProps> = ({
    showingFrom,
    showingTo,
    total,
    currentPage,
    totalPages,
    onPageChange,
}) => {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-center w-full p-8 lg:px-10 lg:py-8 self-stretch rounded-[40px] border-[2px] border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] gap-4">
            <div className="text-[#A5A5A5] font-poppins text-lg lg:text-2xl font-normal leading-[32px]">
                Showing {showingFrom}-{showingTo} of {total} threads
            </div>

            <div className="flex items-center gap-2.5">
                {/* Previous Button */}
                <button
                    className="flex w-12 h-[58px] p-2.5 flex-col justify-center items-center gap-2.5 rounded-[20px] border-[2px] border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] rotate-90 disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-[-90deg]">
                        <path d="M3.63598 8.00003C3.63588 7.90452 3.65465 7.80992 3.69122 7.72168C3.72779 7.63344 3.78143 7.5533 3.84907 7.48585L11.1218 0.213137C11.406 -0.0710446 11.8661 -0.0710446 12.1501 0.213137C12.4341 0.497318 12.4343 0.957499 12.1501 1.2415L5.39161 8.00003L12.1501 14.7586C12.4343 15.0428 12.4343 15.5029 12.1501 15.7869C11.866 16.0709 11.4058 16.0711 11.1218 15.7869L3.84907 8.51422C3.78143 8.44677 3.72779 8.36662 3.69122 8.27838C3.65465 8.19014 3.63588 8.09555 3.63598 8.00003Z" fill="#A5A5A5" />
                    </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-[5px]">
                    {[1, 2, 3].map((page) => (
                        <button
                            key={page}
                            className={`flex w-12 h-12 flex-col justify-center items-center gap-2.5 rounded-[40px] border-[2px] transition-colors ${page === currentPage
                                ? 'bg-[#F29F04] border-[#F29F04] text-[#070707]'
                                : 'bg-[#1A1A1A] border-[rgba(74,74,74,0.70)] text-[#A5A5A5]'
                                }`}
                            onClick={() => onPageChange(page)}
                        >
                            <span className="font-poppins text-2xl font-medium leading-[32px]">{page}</span>
                        </button>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    className="flex w-12 h-[58px] p-2.5 flex-col justify-center items-center gap-2.5 rounded-[20px] border-[2px] border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] rotate-90 disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-[-90deg]">
                        <path d="M12.364 8.00003C12.3641 7.90452 12.3453 7.80992 12.3088 7.72168C12.2722 7.63344 12.2186 7.5533 12.1509 7.48585L4.87822 0.213137C4.59404 -0.0710448 4.13385 -0.0710448 3.84985 0.213137C3.56586 0.497318 3.56567 0.957499 3.84985 1.2415L10.6084 8.00003L3.84986 14.7586C3.56567 15.0428 3.56567 15.5029 3.84986 15.7869C4.13404 16.0709 4.59422 16.0711 4.87822 15.7869L12.1509 8.51422C12.2186 8.44677 12.2722 8.36662 12.3088 8.27838C12.3453 8.19014 12.3641 8.09555 12.364 8.00003Z" fill="#A5A5A5" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ForumPagination;
