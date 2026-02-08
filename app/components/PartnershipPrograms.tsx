"use client";

import React from 'react';

const PartnershipPrograms: React.FC = () => {
    const programs = [
        {
            name: 'CPAgetti',
            description: 'Direct advertiser in the Nutra vertical. We provide exclusive offers and stable payouts.',
            category: 'CPA Network'
        },
        {
            name: 'LeadRock',
            description: 'Global CPA network focused on health & beauty, home & kitchen niches.',
            category: 'CPA Network'
        },
        {
            name: 'Trafee',
            description: 'Smartlink CPA network for adult, dating and other mainstream verticals.',
            category: 'Smartlink Network'
        }
    ];

    return (
        <section className="w-full py-32 px-20 flex flex-col gap-16">
            <div className="flex justify-between items-center w-full">
                <h2 className="text-gradient text-[56px] font-medium leading-[1.2] tracking-tight">
                    Partnership Programs
                </h2>
                <button className="btn-outline">
                    See More
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {programs.map((program, index) => (
                    <div key={index} className="glass-card p-8 flex flex-col gap-8 hover:border-primary transition-all group">
                        <div className="flex justify-between items-center w-full">
                            <h3 className="text-white text-2xl font-bold tracking-tight">{program.name}</h3>
                            <div className="px-3 py-1 rounded-full border border-white/20 text-white/50 text-xs uppercase">
                                {program.category}
                            </div>
                        </div>

                        <p className="text-grey-muted text-base leading-relaxed h-[80px] overflow-hidden">
                            {program.description}
                        </p>

                        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                            <span className="text-primary-light font-medium">Join Program</span>
                            <div className="w-8 h-8 rounded-full border border-primary-light flex items-center justify-center group-hover:bg-primary-light group-hover:text-black transition-all">
                                →
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PartnershipPrograms;
