"use client";

import React from 'react';

const Vacancies: React.FC = () => {
    const vacancies = [
        {
            date: '14 Jun, 2025',
            label: 'TOP',
            labelColor: '#F29F04',
            title: 'Mediabuyer Gambling/Sweepstakes',
            location: 'Kyiv, UA',
            type: 'Remotely',
            experience: 'Junior',
            salary: 'from 1000 USD',
            salaryInfo: 'Kyiv, Ukraine, Remote'
        },
        {
            date: '24 Jun, 2025',
            label: 'Urgent',
            labelColor: '#F72D25',
            title: 'Traffic analyst в Star Crown Partners',
            location: 'Kyiv, UA',
            type: 'Remotely',
            experience: 'Middle',
            salary: 'after the interview',
            salaryInfo: 'Remotely, Remotely'
        },
        {
            date: '06 Jul, 2025',
            label: null,
            title: 'MEDIA BUYER (Gambling/Sweepstakes) at PLUS TEAM',
            location: 'Kyiv, UA',
            type: 'Remotely',
            experience: 'Senior',
            salary: 'after the interview',
            salaryInfo: 'Remotely, Remotely'
        }
    ];

    return (
        <section className="w-full px-5 flex flex-col items-center max-w-[1280px] mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center w-full mb-16">
                <h2 className="font-poppins text-[56px] font-medium leading-[72px] tracking-[-2.24px] bg-clip-text text-transparent bg-[linear-gradient(180deg,#FFF_25.5%,#999_118.5%)]">
                    Vacancies
                </h2>
                <button className="flex py-[12px] px-[24px] justify-center items-center gap-[16px] rounded-[80px] border border-[#FCC660] text-[#FCC660] font-poppins text-[16px] font-medium leading-[26px] transition-all hover:bg-[#FCC660]/10 active:scale-95">
                    See More
                </button>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full">
                {vacancies.map((vacancy, index) => (
                    <div key={index} className="flex p-[32px] flex-col justify-center items-start gap-[31px] rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] group transition-all duration-300 hover:border-[#FCC660]">

                        {/* Title & Date */}
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex justify-between items-center w-full">
                                <span className="text-[#BDBDBD] font-poppins text-[14px] leading-[16px] font-normal">{vacancy.date}</span>
                                {vacancy.label && (
                                    <div
                                        className="flex px-[12px] py-[6px] items-center rounded-[80px] border text-[14px] font-normal leading-[16px] text-white"
                                        style={{ backgroundColor: `${vacancy.labelColor}40`, borderColor: vacancy.labelColor }}
                                    >
                                        {vacancy.label}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-white font-poppins text-[20px] font-medium leading-[32px] h-[64px] line-clamp-2 overflow-hidden">
                                {vacancy.title}
                            </h3>
                        </div>

                        {/* Details */}
                        <div className="flex flex-col gap-[10px] w-full">
                            {/* Location */}
                            <div className="flex items-center gap-[10px] h-8">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M8.99997 3.85718C8.36423 3.85718 7.74278 4.0457 7.21419 4.39889C6.6856 4.75209 6.27361 5.25409 6.03032 5.84143C5.78704 6.42877 5.72339 7.07507 5.84741 7.69858C5.97144 8.3221 6.27757 8.89483 6.7271 9.34437C7.17663 9.7939 7.74937 10.1 8.37288 10.2241C8.9964 10.3481 9.64269 10.2844 10.23 10.0411C10.8174 9.79786 11.3194 9.38587 11.6726 8.85728C12.0258 8.32869 12.2143 7.70723 12.2143 7.0715C12.2143 6.21901 11.8756 5.40143 11.2728 4.79863C10.67 4.19583 9.85246 3.85718 8.99997 3.85718ZM8.99997 9.00009C8.61853 9.00009 8.24565 8.88698 7.9285 8.67506C7.61134 8.46315 7.36415 8.16194 7.21818 7.80954C7.07221 7.45714 7.03402 7.06936 7.10843 6.69525C7.18285 6.32114 7.36653 5.9775 7.63625 5.70778C7.90596 5.43806 8.24961 5.25438 8.62372 5.17997C8.99783 5.10555 9.3856 5.14374 9.73801 5.28971C10.0904 5.43568 10.3916 5.68288 10.6035 6.00003C10.8154 6.31719 10.9286 6.69006 10.9286 7.0715C10.9286 7.58299 10.7254 8.07354 10.3637 8.43522C10.002 8.7969 9.51146 9.00009 8.99997 9.00009ZM8.99997 0C7.12514 0.00212686 5.32771 0.747841 4.00201 2.07354C2.67631 3.39925 1.93059 5.19667 1.92847 7.0715C1.92847 9.59474 3.09446 12.2691 5.3035 14.806C6.2961 15.9523 7.41326 16.9846 8.63434 17.8837C8.74243 17.9594 8.87121 18 9.00318 18C9.13515 18 9.26393 17.9594 9.37202 17.8837C10.5909 16.9842 11.7058 15.9519 12.6964 14.806C14.9023 12.2691 16.0715 9.59474 16.0715 7.0715C16.0693 5.19667 15.3236 3.39925 13.9979 2.07354C12.6722 0.747841 10.8748 0.00212686 8.99997 0ZM8.99997 16.5537C7.67165 15.5091 3.21419 11.672 3.21419 7.0715C3.21419 5.53702 3.82376 4.06538 4.90881 2.98034C5.99385 1.8953 7.46548 1.28573 8.99997 1.28573C10.5344 1.28573 12.0061 1.8953 13.0911 2.98034C14.1762 4.06538 14.7857 5.53702 14.7857 7.0715C14.7857 11.6704 10.3283 15.5091 8.99997 16.5537Z" fill="white" />
                                </svg>
                                <span className="text-[#B3B3B3] text-[14px] font-normal leading-[16px]">{vacancy.location}</span>
                            </div>

                            {/* Type */}
                            <div className="flex items-center gap-[10px] h-8">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M16.6154 3.65629H13.1538C13.1538 2.55462 12.7162 1.49807 11.9372 0.719075C11.1582 -0.0599225 10.1017 -0.497559 9 -0.497559C7.89833 -0.497559 6.84178 -0.0599225 6.06279 0.719075C5.28379 1.49807 4.84615 2.55462 4.84615 3.65629H1.38462C1.01739 3.65629 0.66521 3.80217 0.405544 4.06183C0.145879 4.3215 0 4.67368 0 5.0409V15.4255C0 15.7927 0.145879 16.1449 0.405544 16.4046C0.66521 16.6643 1.01739 16.8101 1.38462 16.8101H16.6154C16.9826 16.8101 17.3348 16.6643 17.5945 16.4046C17.8541 16.1449 18 15.7927 18 15.4255V5.0409C18 4.67368 17.8541 4.3215 17.5945 4.06183C17.3348 3.80217 16.9826 3.65629 16.6154 3.65629ZM9 0.887057C9.73445 0.887057 10.4388 1.17881 10.9581 1.69815C11.4775 2.21748 11.7692 2.92184 11.7692 3.65629H6.23077C6.23077 2.92184 6.52253 2.21748 7.04186 1.69815C7.56119 1.17881 8.26555 0.887057 9 0.887057ZM16.6154 15.4255H1.38462V5.0409H4.84615V6.42552C4.84615 6.60913 4.91909 6.78522 5.04893 6.91505C5.17876 7.04489 5.35485 7.11783 5.53846 7.11783C5.72207 7.11783 5.89816 7.04489 6.028 6.91505C6.15783 6.78522 6.23077 6.60913 6.23077 6.42552V5.0409H11.7692V6.42552C11.7692 6.60913 11.8422 6.78522 11.972 6.91505C12.1018 7.04489 12.2779 7.11783 12.4615 7.11783C12.6452 7.11783 12.8212 7.04489 12.9511 6.91505C13.0809 6.78522 13.1538 6.60913 13.1538 6.42552V5.0409H16.6154V15.4255Z" fill="white" />
                                </svg>
                                <span className="text-[#B3B3B3] text-[14px] font-normal leading-[16px]">{vacancy.type}</span>
                            </div>

                            {/* Experience */}
                            <div className="flex items-center gap-[10px] h-8">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M17.8982 16.3257C16.5815 14.0494 14.5524 12.4171 12.1844 11.6433C13.3557 10.946 14.2657 9.88351 14.7748 8.61894C15.2838 7.35438 15.3636 5.95769 15.002 4.64336C14.6404 3.32903 13.8574 2.16974 12.7731 1.34352C11.6889 0.517295 10.3634 0.0698242 9.00024 0.0698242C7.63708 0.0698242 6.31161 0.517295 5.22737 1.34352C4.14313 2.16974 3.36009 3.32903 2.99848 4.64336C2.63688 5.95769 2.71672 7.35438 3.22573 8.61894C3.73474 9.88351 4.64478 10.946 5.81611 11.6433C3.4481 12.4162 1.419 14.0485 0.102293 16.3257C0.0540064 16.4045 0.0219786 16.4921 0.00809874 16.5834C-0.00578113 16.6747 -0.00123188 16.7679 0.0214781 16.8574C0.044188 16.9469 0.0845987 17.031 0.140326 17.1046C0.196053 17.1783 0.265967 17.24 0.345944 17.2862C0.425921 17.3324 0.514341 17.3621 0.605986 17.3736C0.697632 17.3851 0.790646 17.3781 0.879542 17.353C0.968437 17.3279 1.05141 17.2853 1.12358 17.2277C1.19574 17.17 1.25562 17.0985 1.29969 17.0174C2.92851 14.2024 5.80746 12.5217 9.00024 12.5217C12.193 12.5217 15.072 14.2024 16.7008 17.0174C16.7449 17.0985 16.8048 17.17 16.8769 17.2277C16.9491 17.2853 17.0321 17.3279 17.1209 17.353C17.2098 17.3781 17.3029 17.3851 17.3945 17.3736C17.4861 17.3621 17.5746 17.3324 17.6545 17.2862C17.7345 17.24 17.8044 17.1783 17.8602 17.1046C17.9159 17.031 17.9563 16.9469 17.979 16.8574C18.0017 16.7679 18.0063 16.6747 17.9924 16.5834C17.9785 16.4921 17.9465 16.4045 17.8982 16.3257ZM4.15876 6.29694C4.15876 5.33938 4.44271 4.40333 4.9747 3.60716C5.50669 2.81098 6.26282 2.19043 7.14749 1.82399C8.03215 1.45755 9.00562 1.36167 9.94477 1.54848C10.8839 1.73529 11.7466 2.1964 12.4237 2.87349C13.1008 3.55059 13.5619 4.41326 13.7487 5.35241C13.9355 6.29157 13.8396 7.26503 13.4732 8.14969C13.1067 9.03436 12.4862 9.79049 11.69 10.3225C10.8939 10.8545 9.9578 11.1384 9.00024 11.1384C7.71663 11.137 6.48597 10.6265 5.57832 9.71887C4.67066 8.81121 4.16014 7.58056 4.15876 6.29694Z" fill="white" />
                                </svg>
                                <span className="text-[#B3B3B3] text-[14px] font-normal leading-[16px]">{vacancy.experience}</span>
                            </div>
                        </div>

                        {/* Salary & Info */}
                        <div className="flex flex-col gap-[16px] w-full">
                            <div className="flex flex-col gap-[5px]">
                                <span className="text-white font-poppins text-[20px] font-semibold leading-[32px]">{vacancy.salary}</span>
                                <span className="text-[#B3B3B3] font-poppins text-[14px] font-normal leading-[16px]">{vacancy.salaryInfo}</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="w-full">
                            <button className="flex h-[50px] py-[12px] px-[24px] justify-center items-center gap-[12px] self-stretch rounded-[80px] bg-[#F29F04] text-[#0D0D0D] font-poppins text-[16px] font-medium leading-[26px] w-full transition-all hover:brightness-110 active:scale-95">
                                More details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Vacancies;
