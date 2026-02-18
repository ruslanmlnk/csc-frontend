import React from 'react';

interface UsefulServiceCardProps {
    logo: React.ReactNode;
    category: string;
    name: string;
    description: string;
    pricing: string;
    offer?: string;
    offerBrand?: string;
}

const UsefulServiceCard: React.FC<UsefulServiceCardProps> = ({
    logo,
    category,
    name,
    description,
    pricing,
    offer,
    offerBrand,
}) => {
    return (
        <div className="flex p-[32px] flex-col gap-[32px] rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] group hover:border-[#F29F04] transition-all">
            <div className="flex items-center w-full justify-between h-[56px]">
                <div className="flex items-center">
                    {logo}
                </div>
                <div className="flex px-[12px] py-[6px] justify-center items-center gap-[10px] rounded-[80px] border border-[rgba(179,179,179,0.5)] text-[#B3B3B3] text-[14px] font-normal leading-[16px]">
                    {category}
                </div>
            </div>

            <div className="flex flex-col gap-[12px] self-stretch">
                <h3 className="text-white text-[20px] font-medium leading-[32px]">{name}</h3>
                <p className="text-[#BDBDBD] text-[16px] font-normal leading-[26px]">
                    {description}
                </p>
            </div>

            <div className="flex flex-col gap-[30px] self-stretch">
                <div className="flex items-center gap-1 flex-wrap ml-[3px]">
                    {pricing.split(', ').map((part, i) => {
                        const [amount, period] = part.split('/');
                        return (
                            <React.Fragment key={i}>
                                {i > 0 && <span className="text-white text-[20px] font-semibold leading-[32px]">, </span>}
                                <span className="text-white text-[20px] font-semibold leading-[32px]">{amount}</span>
                                {period && (
                                    <span className="text-[#666] text-[20px] font-semibold leading-[32px]">/{period}</span>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {offerBrand && (
                    <div className="flex justify-between items-center gap-4 w-full">
                        <div className="flex h-[32px] px-[12px] justify-center items-center gap-[10px] rounded-[80px] border border-[#06DF73] text-[#06DF73] text-[14px] font-normal leading-[16px] uppercase shrink-0">
                            {offerBrand}
                        </div>
                        <span className="text-[#BDBDBD] text-[14px] font-normal leading-[16px] text-right">
                            {offer || ''}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsefulServiceCard;
