import React from 'react';

interface ForumPaginationProps {
    showingFrom: number;
    showingTo: number;
    total: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemLabel?: string;
}

const ForumPagination: React.FC<ForumPaginationProps> = ({
    showingFrom,
    showingTo,
    total,
    currentPage,
    totalPages,
    onPageChange,
    itemLabel = 'threads',
}) => {
    const getVisiblePages = (): number[] => {
        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        if (currentPage <= 2) {
            return [1, 2, 3];
        }

        if (currentPage >= totalPages - 1) {
            return [totalPages - 2, totalPages - 1, totalPages];
        }

        return [currentPage - 1, currentPage, currentPage + 1];
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="w-full self-stretch rounded-[40px] border-2 border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-[23.2px] py-[19.2px] flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:px-[38.4px] md:py-[30.4px]">
            <div className="text-[#A5A5A5] font-poppins text-[18px] font-normal leading-[28px] md:text-[24px] md:leading-[32px]">
                Showing {showingFrom}-{showingTo} of {total} {itemLabel}
            </div>

            <div className="flex items-center gap-[10px]">
                <button
                    className="flex h-10 w-[52px] items-center justify-center rounded-[20px] border-2 border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed md:h-12 md:w-[58px]"
                    disabled={currentPage === 1}
                    onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.63598 8.00003C3.63588 7.90452 3.65465 7.80992 3.69122 7.72168C3.72779 7.63344 3.78143 7.5533 3.84907 7.48585L11.1218 0.213137C11.406 -0.0710446 11.8661 -0.0710446 12.1501 0.213137C12.4341 0.497318 12.4343 0.957499 12.1501 1.2415L5.39161 8.00003L12.1501 14.7586C12.4343 15.0428 12.4343 15.5029 12.1501 15.7869C11.866 16.0709 11.4058 16.0711 11.1218 15.7869L3.84907 8.51422C3.78143 8.44677 3.72779 8.36662 3.69122 8.27838C3.65465 8.19014 3.63588 8.09555 3.63598 8.00003Z" fill="#A5A5A5" />
                    </svg>
                </button>

                <div className="flex items-center gap-[5px]">
                    {visiblePages.map((page) => (
                        <button
                            key={page}
                            className={`flex h-10 w-10 items-center justify-center rounded-[40px] transition-colors md:h-12 md:w-12 ${
                                page === currentPage
                                    ? 'text-[#070707] [background:radial-gradient(100%_100%_at_50%_0%,rgba(255,255,255,0.30)_0%,rgba(255,255,255,0.00)_100%),#F29F04]'
                                    : 'border-2 border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] text-[#A5A5A5]'
                            }`}
                            onClick={() => onPageChange(page)}
                        >
                            <span
                                className={`font-poppins text-[18px] font-medium leading-[28px] md:text-[24px] md:leading-[32px] ${
                                    page === currentPage ? 'text-[#070707]' : 'text-[#A5A5A5]'
                                }`}
                            >
                                {page}
                            </span>
                        </button>
                    ))}
                </div>

                <button
                    className="flex h-10 w-[52px] items-center justify-center rounded-[20px] border-2 border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed md:h-12 md:w-[58px]"
                    disabled={currentPage === totalPages}
                    onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.364 8.00003C12.3641 7.90452 12.3453 7.80992 12.3088 7.72168C12.2722 7.63344 12.2186 7.5533 12.1509 7.48585L4.87822 0.213137C4.59404 -0.0710448 4.13385 -0.0710448 3.84985 0.213137C3.56586 0.497318 3.56567 0.957499 3.84985 1.2415L10.6084 8.00003L3.84986 14.7586C3.56567 15.0428 3.56567 15.5029 3.84986 15.7869C4.13404 16.0709 4.59422 16.0711 4.87822 15.7869L12.1509 8.51422C12.2186 8.44677 12.2722 8.36662 12.3088 8.27838C12.3453 8.19014 12.3641 8.09555 12.364 8.00003Z" fill="#A5A5A5" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ForumPagination;
