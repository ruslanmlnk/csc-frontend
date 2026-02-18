"use client";

import React from 'react';
import Link from 'next/link';
import JobVacancyCard from '@/app/components/jobs/JobVacancyCard';

const Vacancies: React.FC = () => {
    const vacancies = [
        {
            date: '14 Jun, 2025',
            badge: 'top' as const,
            title: 'Mediabuyer Gambling/Sweepstakes',
            location: 'Kyiv, UA',
            workFormat: 'Remotely',
            experience: 'Junior',
            salary: 'from 1000 USD',
            salaryInfo: 'Kyiv, Ukraine, Remote'
        },
        {
            date: '24 Jun, 2025',
            badge: 'urgent' as const,
            title: 'Traffic analyst in Star Crown Partners',
            location: 'Kyiv, UA',
            workFormat: 'Remotely',
            experience: 'Middle',
            salary: 'after the interview',
            salaryInfo: 'Remotely, Remotely'
        },
        {
            date: '06 Jul, 2025',
            badge: 'none' as const,
            title: 'MEDIA BUYER (Gambling/Sweepstakes) at PLUS TEAM',
            location: 'Kyiv, UA',
            workFormat: 'Remotely',
            experience: 'Senior',
            salary: 'after the interview',
            salaryInfo: 'Remotely, Remotely'
        }
    ];

    return (
        <section className="w-full px-5 flex flex-col items-center max-w-[1280px] mx-auto overflow-hidden">
            <div className="flex justify-between items-center w-full mb-16">
                <h2 className="font-poppins text-[56px] font-medium leading-[72px] tracking-[-2.24px] bg-clip-text text-transparent bg-[linear-gradient(180deg,#FFF_25.5%,#999_118.5%)]">
                    Vacancies
                </h2>
                <Link href="/jobs" className="flex py-[12px] px-[24px] justify-center items-center gap-[16px] rounded-[80px] border border-[#FCC660] text-[#FCC660] font-poppins text-[16px] font-medium leading-[26px] transition-all hover:bg-[#FCC660]/10 active:scale-95">
                    See More
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full">
                {vacancies.map((vacancy, index) => (
                    <JobVacancyCard
                        key={index}
                        dateLabel={vacancy.date}
                        badge={vacancy.badge}
                        title={vacancy.title}
                        location={vacancy.location}
                        workFormat={vacancy.workFormat}
                        experience={vacancy.experience}
                        salary={vacancy.salary}
                        salaryInfo={vacancy.salaryInfo}
                        detailsHref="/jobs"
                    />
                ))}
            </div>
        </section>
    );
};

export default Vacancies;
