'use client';

import React, { useState } from 'react';
import { Search, MapPin, Briefcase, User, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';
import BackgroundEffects from '../components/BackgroundEffects';
import Image from 'next/image';
import Link from 'next/link';

// Mock data
const jobs = [
  {
    id: 1,
    date: '14 Jun, 2025',
    isTop: true,
    isUrgent: false,
    title: 'Mediabuyer Gambling/Sweepstakes',
    location: 'Kyiv, UA',
    type: 'Remotely',
    level: 'Junior',
    salary: 'from 1000 USD',
    salaryDetail: 'Kyiv, Ukraine, Remote',
  },
  {
    id: 2,
    date: '24 Jun, 2025',
    isTop: false,
    isUrgent: true,
    title: 'Traffic analyst in Star Crown Partners',
    location: 'Remotely',
    type: 'Remotely',
    level: 'Middle',
    salary: 'after the interview',
    salaryDetail: 'Remotely, Remotely',
  },
  {
    id: 3,
    date: '06 Jul, 2025',
    isTop: false,
    isUrgent: false,
    title: 'MEDIA BUYER (Gambling/Sweepstakes) at PLUS TEAM',
    location: 'Kyiv, UA',
    type: 'Remotely',
    level: 'Senior',
    salary: 'after the interview',
    salaryDetail: 'Remotely, Remotely',
  },
  {
    id: 4,
    date: '14 Jun, 2025',
    isTop: true,
    isUrgent: false,
    title: 'Affiliate Manager',
    location: 'Kyiv, UA',
    type: 'Remotely',
    level: 'Middle',
    salary: 'from 1500 USD',
    salaryDetail: 'Kyiv, Ukraine, Remote',
  },
  {
    id: 5,
    date: '24 Jun, 2025',
    isTop: false,
    isUrgent: false,
    title: 'React Native Developer',
    location: 'Remotely',
    type: 'Remotely',
    level: 'Senior',
    salary: 'from 4000 USD',
    salaryDetail: 'Remotely, Remotely',
  },
  {
    id: 6,
    date: '06 Jul, 2025',
    isTop: false,
    isUrgent: true,
    title: 'UI/UX Designer',
    location: 'Warsaw, PL',
    type: 'Office',
    level: 'Middle',
    salary: 'from 2500 USD',
    salaryDetail: 'Warsaw, Poland, Office',
  },
];

type JobItem = typeof jobs[0];

const JobCard: React.FC<{ job: JobItem }> = ({ job }) => (
  <div className="flex flex-col p-8 rounded-[40px] border border-[#4A4A4A]/70 bg-[#1A1A1A] gap-8 hover:border-[#F29F04]/50 transition-colors group">
    {/* Header */}
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[#BDBDBD] text-sm font-normal">{job.date}</span>
        <div className="flex gap-2">
          {job.isTop && (
            <span className="px-3 py-1 rounded-full border border-[#F29F04] text-[#F29F04] bg-[#F29F04]/10 text-xs font-medium uppercase">TOP</span>
          )}
          {job.isUrgent && (
            <span className="px-3 py-1 rounded-full border border-[#F72D25] text-[#F72D25] bg-[#F72D25]/10 text-xs font-medium uppercase">Urgent</span>
          )}
        </div>
      </div>
      <h3 className="text-xl font-medium text-white group-hover:text-[#F29F04] transition-colors leading-[32px]">{job.title}</h3>
    </div>

    {/* Metadata */}
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-[#B3B3B3]">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">{job.location}</span>
      </div>
      <div className="flex items-center gap-3 text-[#B3B3B3]">
        <Briefcase className="w-4 h-4" />
        <span className="text-sm">{job.type}</span>
      </div>
      <div className="flex items-center gap-3 text-[#B3B3B3]">
        <User className="w-4 h-4" />
        <span className="text-sm">{job.level}</span>
      </div>
    </div>

    {/* Footer */}
    <div className="mt-auto flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="text-white text-xl font-semibold">{job.salary}</div>
        <div className="text-[#B3B3B3] text-sm opacity-70">{job.salaryDetail}</div>
      </div>
      <button className="w-full py-3 rounded-full bg-[#F29F04] text-[#0D0D0D] font-medium text-base hover:bg-[#e09204] transition-colors">
        More details
      </button>
    </div>
  </div>
);

const Jobs: React.FC = () => {
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [levelFilter, setLevelFilter] = useState('Any experience');
  const [typeFilter, setTypeFilter] = useState('Any format');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Фільтрація вакансій
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = locationFilter === 'All Locations' || job.location.includes(locationFilter);
    const matchesLevel = levelFilter === 'Any experience' || job.level.includes(levelFilter);
    const matchesType = typeFilter === 'Any format' || job.type.includes(typeFilter);

    return matchesSearch && matchesLocation && matchesLevel && matchesType;
  });

  // Пагінація
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0D0D0D] text-white font-sans animate-fade-in-up">
      <BackgroundEffects />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-5 pt-16 pb-12 text-center w-full max-w-[1440px] mx-auto">
        <h1 className="text-5xl md:text-[80px] font-medium text-gradient-hero tracking-tight leading-[1.1] max-w-[1020px] drop-shadow-2xl">
          Build your career in performance marketing
        </h1>
        <p className="text-[#BDBDBD] text-base md:text-lg max-w-[720px] font-light leading-[26px]">
          Join a team working with real traffic, real budgets, and real impact. 
          We’re looking for media buyers, analysts, creatives, and tech specialists ready to grow fast.
        </p>
      </div>

      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-5 md:px-24 flex flex-col gap-16 pb-20">
        {/* Banner Image */}
        <div className="w-full rounded-[40px] overflow-hidden border border-[#4A4A4A]/50">
          <img
            src="https://picsum.photos/2480/316?grayscale"
            alt="Jobs Banner"
            width={2480}
            height={316}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col xl:flex-row gap-6 items-center">
          {/* Search Input */}
          <div className="flex-1 w-full relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9E9E9E]">
              <Search className="w-6 h-6" />
            </div>
            <input 
              type="text" 
              placeholder="Search by job vacancy"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[60px] pl-16 pr-6 rounded-[80px] bg-[#1A1A1A] border border-[#4A4A4A]/70 text-white placeholder-[#9E9E9E] focus:outline-none focus:border-[#F29F04] transition-colors text-base"
            />
          </div>

          {/* Dropdowns */}
          <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
            <button onClick={() => setLocationFilter('Kyiv, UA')} className="flex items-center justify-between px-6 h-[60px] rounded-[80px] bg-[#1A1A1A] border border-[#4A4A4A]/70 text-[#FCFCFC] w-full md:w-auto md:min-w-[180px] hover:border-[#F29F04] transition-colors">
              <span className="text-base">{locationFilter}</span>
              <ChevronDown className="w-3 h-3 ml-4" />
            </button>
            <button onClick={() => setLevelFilter('Middle')} className="flex items-center justify-between px-6 h-[60px] rounded-[80px] bg-[#1A1A1A] border border-[#4A4A4A]/70 text-[#FCFCFC] w-full md:w-auto md:min-w-[180px] hover:border-[#F29F04] transition-colors">
              <span className="text-base">{levelFilter}</span>
              <ChevronDown className="w-3 h-3 ml-4" />
            </button>
            <button onClick={() => setTypeFilter('Remotely')} className="flex items-center justify-between px-6 h-[60px] rounded-[80px] bg-[#1A1A1A] border border-[#4A4A4A]/70 text-[#FCFCFC] w-full md:w-auto md:min-w-[180px] hover:border-[#F29F04] transition-colors">
              <span className="text-base">{typeFilter}</span>
              <ChevronDown className="w-3 h-3 ml-4" />
            </button>
            <button className="h-[60px] px-8 rounded-[80px] bg-[#F29F04] text-[#0D0D0D] font-medium text-base hover:bg-[#e09204] transition-colors min-w-[140px]">
              Search
            </button>
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedJobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-8 rounded-[40px] border-2 border-[#4A4A4A]/70 bg-[#1A1A1A] mt-4 gap-6">
          <span className="text-[#A5A5A5] text-xl font-normal">Showing {paginatedJobs.length} of {filteredJobs.length} vacancies</span>
          <div className="flex items-center gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="w-12 h-12 rounded-[20px] border-2 border-[#4A4A4A]/70 flex items-center justify-center text-[#A5A5A5] hover:border-[#F29F04] hover:text-[#F29F04] transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-xl transition-colors ${
                    currentPage === i + 1 ? 'bg-[#F29F04] text-[#070707]' : 'border-2 border-[#4A4A4A]/70 text-[#A5A5A5] hover:border-[#F29F04] hover:text-[#F29F04]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="w-12 h-12 rounded-[20px] border-2 border-[#4A4A4A]/70 flex items-center justify-center text-[#A5A5A5] hover:border-[#F29F04] hover:text-[#F29F04] transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Jobs;
