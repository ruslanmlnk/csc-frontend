import React from 'react';
import { ArrowLeft, Calendar, Star, CreditCard, Landmark, Bitcoin, DollarSign, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
const PartnershipDetail: React.FC = () => {
   return (
      <div className="flex flex-col w-full min-h-screen bg-[#0D0D0D] text-white font-sans animate-fade-in-up">
         <main className="flex-1 w-full max-w-[1440px] mx-auto px-5 py-8 md:px-24 md:py-12">

            {/* Back Navigation */}
            <Link to="/" className="inline-flex items-center gap-4 mb-10 group hover:opacity-80 transition-opacity">
               <ArrowLeft className="w-8 h-8 text-[#FCFCFC]" strokeWidth={1.5} />
               <span className="text-2xl font-normal text-[#FCFCFC]">Back to Partnerships</span>
            </Link>

            {/* Content Grid */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

               {/* Main Column */}
               <div className="flex-1 flex flex-col gap-10 md:gap-16">

                  {/* Header Section: Mobile (Button Top) -> Desktop (Button Right) */}
                  <div className="flex flex-col gap-6">

                     {/* Button & Title Group */}
                     <div className="flex flex-col md:flex-row-reverse md:items-center md:justify-between gap-6">
                        {/* CTA Button */}
                        <div className="flex justify-start md:justify-end">
                           <button className="flex items-center justify-center px-6 py-3 rounded-full bg-[#F29F04] hover:bg-[#e09204] transition-colors text-[#0D0D0D] font-medium text-base leading-[26px]">
                              Go to the website
                           </button>
                        </div>

                        {/* Logo & Title */}
                        <div className="flex items-center gap-6">
                           <img
                              src="/images/cpagetti-logo-detail.png"
                              alt="CPAgetti Logo"
                              className="w-[244px] h-[56px] object-contain object-left"
                           />
                           <h1 className="text-[56px] font-medium leading-[72px] tracking-tight hidden md:block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#999999]">
                              CPAgetti
                           </h1>
                        </div>
                     </div>

                     {/* Mobile Title (if not using image text) - The image seems to contain the logo mark, the text CPAgetti is separate in the design html */}
                     <div className="md:hidden">
                        <span className="text-[56px] font-medium leading-[72px] tracking-[-2.24px] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] via-[#FFF] to-[#999]">
                           CPAgetti
                        </span>
                     </div>

                     {/* Tags Row */}
                     <div className="flex flex-wrap items-start content-start gap-2.5">
                        {/* Calendar Tag */}
                        <div className="flex items-center gap-2.5 px-3 py-3 rounded-full bg-white text-[#070707]">
                           <Calendar className="w-3.5 h-3.5 stroke-[2px]" />
                           <span className="font-normal text-sm leading-4">2014</span>
                        </div>

                        {/* Category Tag 1 */}
                        <div className="flex items-center gap-2.5 px-3 py-3 rounded-full bg-white text-[#070707]">
                           <span className="font-normal text-sm leading-4">Gambling / Betting / Nutra</span>
                        </div>

                        {/* Category Tag 2 */}
                        <div className="flex items-center gap-2.5 px-3 py-3 rounded-full bg-white text-[#070707]">
                           <span className="font-normal text-sm leading-4">CPA</span>
                        </div>

                        {/* Rating Tag */}
                        <div className="flex items-center gap-3 px-3 py-3 rounded-full border border-[#B3B3B3] bg-transparent">
                           <Star className="w-4 h-4 text-[#F29F04] fill-[#F29F04]" />
                           <span className="font-normal text-sm leading-4 text-[#B3B3B3]">4.8</span>
                        </div>
                     </div>
                  </div>

                  {/* Summary Article */}
                  <div className="flex flex-col gap-8">
                     <div className="flex flex-col gap-8">
                        <h2 className="text-[32px] font-medium leading-10 tracking-[-0.64px] text-[#FCFCFC]">
                           Affiliate program summary
                        </h2>
                        <div className="text-xl font-normal leading-8 text-[#9E9E9E] tracking-[-0.64px] space-y-8">
                           <p>
                              CPAgetti is a multi-vertical affiliate program offering a wide range of offers across Nutra (COD, SS, Trial) and Gambling/Betting verticals.
                              The platform provides access to over 1,200 offers, allowing every webmaster to find a suitable option for almost any traffic source.
                           </p>
                           <p>
                              Key advantages of CPAgetti: fast launch of required offers, free landing page translations, access to free prelanders, and much more!
                              Partners can also take advantage of the network’s Telegram bot, which regularly updates top-performing offers. It also allows you to monitor your personal account (statistics, payouts, flows, etc.) directly via Telegram.
                           </p>
                        </div>
                     </div>

                     {/* Banner Image */}
                     <div className="w-full rounded-[40px] overflow-hidden">
                        <img
                           src="/images/affiliate-dashboard.png"
                           alt="Affiliate Dashboard"
                           className="w-full h-auto object-cover aspect-[350/196]"
                        />
                     </div>

                     {/* Payouts Section */}
                     <div className="flex flex-col gap-8">
                        <h2 className="text-[32px] font-medium leading-10 tracking-[-0.64px] text-[#FCFCFC]">
                           Payouts
                        </h2>
                        <div className="flex flex-col gap-6">
                           <div className="text-xl leading-8">
                              <span className="font-medium text-white">Frequency:</span>
                              <span className="font-normal text-[#9E9E9E]"> Once a day</span>
                           </div>
                           <div className="text-xl leading-8">
                              <span className="font-medium text-white">Currency:</span>
                              <span className="font-normal text-[#9E9E9E]"> USD</span>
                           </div>
                           <div className="text-xl leading-8">
                              <span className="font-medium text-white">Minimum amount:</span>
                              <span className="font-normal text-[#9E9E9E]"> $100</span>
                           </div>
                        </div>
                     </div>

                     {/* Withdrawal Methods */}
                     <div className="flex flex-col gap-8">
                        <h2 className="text-[32px] font-medium leading-10 tracking-[-0.64px] text-[#FCFCFC]">
                           Withdrawal methods
                        </h2>
                        <div className="flex flex-wrap items-start gap-6">
                           {/* Visa */}
                           <div className="flex items-center gap-4">
                              <CreditCard className="w-6 h-6 text-white" />
                              <span className="text-xl font-normal leading-8 text-[#9E9E9E]">Visa</span>
                           </div>
                           {/* Capitalist (Using dollar sign icon as approximation for Money icon in design) */}
                           <div className="flex items-center gap-4">
                              <div className="w-6 h-6 flex items-center justify-center">
                                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 8.25C11.2583 8.25 10.5333 8.46993 9.91661 8.88199C9.29993 9.29404 8.81928 9.87971 8.53545 10.5649C8.25162 11.2502 8.17736 12.0042 8.32205 12.7316C8.46675 13.459 8.8239 14.1272 9.34835 14.6517C9.8728 15.1761 10.541 15.5333 11.2684 15.6779C11.9958 15.8226 12.7498 15.7484 13.4351 15.4645C14.1203 15.1807 14.706 14.7001 15.118 14.0834C15.5301 13.4667 15.75 12.7417 15.75 12C15.75 11.0054 15.3549 10.0516 14.6517 9.34835C13.9484 8.64509 12.9946 8.25 12 8.25ZM22.5 5.25H1.5C1.30109 5.25 1.11032 5.32902 0.96967 5.46967C0.829018 5.61032 0.75 5.80109 0.75 6V18C0.75 18.1989 0.829018 18.3897 0.96967 18.5303C1.11032 18.671 1.30109 18.75 1.5 18.75H22.5C22.6989 18.75 22.8897 18.671 23.0303 18.5303C23.171 18.3897 23.25 18.1989 23.25 18V6C23.25 5.80109 23.171 5.61032 23.0303 5.46967C22.8897 5.32902 22.6989 5.25 22.5 5.25Z" fill="white" />
                                 </svg>
                              </div>
                              <span className="text-xl font-normal leading-8 text-[#9E9E9E]">Capitalist</span>
                           </div>
                           {/* Wire transfer */}
                           <div className="flex items-center gap-4">
                              <Landmark className="w-6 h-6 text-white" />
                              <span className="text-xl font-normal leading-8 text-[#9E9E9E]">Wire transfer</span>
                           </div>
                           {/* Bitcoin */}
                           <div className="flex items-center gap-4">
                              <Bitcoin className="w-6 h-6 text-white" />
                              <span className="text-xl font-normal leading-8 text-[#9E9E9E]">Bitcoin</span>
                           </div>
                           {/* USDT */}
                           <div className="flex items-center gap-4">
                              <DollarSign className="w-6 h-6 text-white" />
                              <span className="text-xl font-normal leading-8 text-[#9E9E9E]">USDT</span>
                           </div>
                        </div>
                     </div>

                     {/* Features */}
                     <div className="flex flex-col gap-8">
                        <h2 className="text-[32px] font-medium leading-10 tracking-[-0.64px] text-[#FCFCFC]">
                           Features
                        </h2>
                        <div className="flex flex-col gap-2">
                           <p className="text-xl font-normal leading-8 text-[#9E9E9E]">Personal manager</p>
                           <p className="text-xl font-normal leading-8 text-[#9E9E9E]">Payouts on request</p>
                           <p className="text-xl font-normal leading-8 text-[#9E9E9E]">Free landing page translation</p>
                           <p className="text-xl font-normal leading-8 text-[#9E9E9E]">Telegram bot</p>
                        </div>
                     </div>

                     {/* Footer Meta: Views & Date */}
                     <div className="flex items-center gap-6 mt-2">
                        <div className="flex items-center gap-2.5">
                           <Eye className="w-6 h-6 text-white" strokeWidth={1.5} />
                           <span className="text-base font-normal leading-4 text-[#EEEEEE]">11 views</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                           <Calendar className="w-6 h-6 text-white" strokeWidth={1.5} />
                           <span className="text-base font-normal leading-4 text-[#EEEEEE]">July 24, 2025</span>
                        </div>
                     </div>

                  </div>
               </div>

               {/* Sidebar */}
               <div className="w-full lg:w-[350px] flex-shrink-0 flex flex-col gap-10">
                  <div className="w-full rounded-[40px] overflow-hidden bg-[#1A1A1A] sticky top-8">
                     <img
                        src="/images/partnership-sidebar-promo.png"
                        alt="Sidebar Promotion"
                        className="w-full h-auto object-cover"
                     />
                  </div>
               </div>

            </div>

         </main>
      </div>
   );
};

export default PartnershipDetail;