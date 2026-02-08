"use client";

import React from 'react';

const ContactForm: React.FC = () => {
    return (
        <section className="w-full pt-[120px] pb-[80px] px-5 flex flex-col items-start max-w-[1280px] mx-auto overflow-hidden">
            {/* Label Pill */}
            <div className="flex p-[4px] flex-col justify-center items-center gap-[10px] rounded-[40px] bg-[rgba(242,159,4,0.25)] mb-6">
                <div className="flex py-[6px] px-[16px] justify-center items-center gap-[10px] rounded-[24px] border border-[#F29F04]">
                    <span className="text-white text-center font-poppins text-[16px] font-normal leading-[26px]">
                        Contact Information
                    </span>
                </div>
            </div>

            {/* Main Content Split */}
            <div className="flex flex-col lg:flex-row justify-center items-start gap-[64px] self-stretch">

                {/* Left Side: Heading & Contact Info */}
                <div className="flex flex-col items-start gap-[40px] flex-1 self-stretch">
                    <div className="flex flex-col justify-center items-start gap-[24px] self-stretch">
                        <h2 className="self-stretch font-poppins text-[40px] md:text-[56px] font-medium leading-[72px] tracking-[-2.24px] bg-clip-text text-transparent bg-[linear-gradient(180deg,#FFF_25.5%,#999_118.5%)]">
                            Connect with Us Today
                        </h2>
                        <p className="self-stretch text-[#BDBDBD] font-poppins text-[16px] font-normal leading-[26px]">
                            Our team is here to help you with any inquiries about our services and features.
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="flex flex-col items-start gap-[16px] self-stretch">

                        {/* Top row: Phone + E-mail */}
                        <div className="flex flex-col md:flex-row items-center gap-[16px] self-stretch">
                            {/* Phone */}
                            <div className="flex p-[16px] flex-col items-start gap-[16px] flex-1 self-stretch rounded-[20px] bg-transparent border border-transparent">
                                <div className="flex items-center gap-[16px] self-stretch">
                                    <div className="flex p-[8px] items-center gap-[10px] rounded-[80px] bg-white h-[40px] w-[40px] justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M20.8472 14.8554L16.4306 12.8764L16.4184 12.8707C16.1892 12.7727 15.939 12.7333 15.6907 12.7562C15.4424 12.7792 15.2037 12.8636 14.9963 13.002C14.9718 13.0181 14.9484 13.0357 14.9259 13.0545L12.6441 14.9998C11.1984 14.2976 9.70595 12.8164 9.00376 11.3895L10.9519 9.07294C10.9706 9.0495 10.9884 9.02606 11.0053 9.00075C11.1407 8.79384 11.2229 8.55667 11.2445 8.31035C11.2661 8.06402 11.2264 7.81618 11.1291 7.58887V7.57762L9.14438 3.15356C9.0157 2.85662 8.79444 2.60926 8.51362 2.44841C8.2328 2.28756 7.9075 2.22184 7.58626 2.26106C6.31592 2.42822 5.14986 3.05209 4.30588 4.01615C3.4619 4.98021 2.99771 6.21852 3.00001 7.49981C3.00001 14.9436 9.05626 20.9998 16.5 20.9998C17.7813 21.0021 19.0196 20.5379 19.9837 19.6939C20.9477 18.85 21.5716 17.6839 21.7388 16.4136C21.7781 16.0924 21.7125 15.7672 21.5518 15.4864C21.3911 15.2056 21.144 14.9843 20.8472 14.8554Z" fill="#F29F04" />
                                        </svg>
                                    </div>
                                    <span className="text-[#EEE] font-poppins text-[16px] font-normal leading-[26px]">Phone</span>
                                </div>
                                <span className="self-stretch text-[#FCFCFC] font-poppins text-[20px] font-medium leading-[32px]">+1 (800) 555-0199</span>
                            </div>

                            {/* E-mail */}
                            <div className="flex p-[16px] flex-col items-start gap-[16px] flex-1 self-stretch rounded-[20px] bg-transparent border border-transparent">
                                <div className="flex items-center gap-[16px] self-stretch">
                                    <div className="flex p-[8px] items-center gap-[10px] rounded-[80px] bg-white h-[40px] w-[40px] justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M21.4163 8.37562L12.4163 2.37562C12.293 2.29339 12.1482 2.24951 12 2.24951C11.8518 2.24951 11.707 2.29339 11.5837 2.37562L2.58375 8.37562C2.48101 8.44417 2.39679 8.53703 2.33857 8.64595C2.28034 8.75488 2.24992 8.87649 2.25 9V18.75C2.25 19.1478 2.40804 19.5294 2.68934 19.8107C2.97064 20.092 3.35218 20.25 3.75 20.25H20.25C20.6478 20.25 21.0294 20.092 21.3107 19.8107C21.592 19.5294 21.75 19.1478 21.75 18.75V9C21.7501 8.87649 21.7197 8.75488 21.6614 8.64595C21.6032 8.53703 21.519 8.44417 21.4163 8.37562ZM9.0675 14.25L3.75 18V10.4559L9.0675 14.25ZM10.6022 15H13.3978L18.7069 18.75H5.29312L10.6022 15ZM14.9325 14.25L20.25 10.4559V18L14.9325 14.25ZM12 3.90094L19.6791 9.02062L13.3978 13.5H10.6041L4.32281 9.02062L12 3.90094Z" fill="#F29F04" />
                                        </svg>
                                    </div>
                                    <span className="text-[#EEE] font-poppins text-[16px] font-normal leading-[26px]">E-mail</span>
                                </div>
                                <span className="self-stretch text-[#FCFCFC] font-poppins text-[20px] font-medium leading-[32px]">support@coinzy.com</span>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex p-[16px] flex-col items-start gap-[16px] self-stretch rounded-[20px] bg-transparent border border-transparent">
                            <div className="flex items-center gap-[16px] self-stretch">
                                <div className="flex p-[8px] items-center gap-[10px] rounded-[80px] bg-white h-[40px] w-[40px] justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 6C11.2583 6 10.5333 6.21993 9.91661 6.63199C9.29993 7.04404 8.81928 7.62971 8.53545 8.31494C8.25162 9.00016 8.17736 9.75416 8.32205 10.4816C8.46675 11.209 8.8239 11.8772 9.34835 12.4017C9.8728 12.9261 10.541 13.2833 11.2684 13.4279C11.9958 13.5726 12.7498 13.4984 13.4351 13.2145C14.1203 12.9307 14.706 12.4501 15.118 11.8334C15.5301 11.2167 15.75 10.4917 15.75 9.75C15.75 8.75544 15.3549 7.80161 14.6517 7.09835C13.9484 6.39509 12.9946 6 12 6ZM12 12C11.555 12 11.12 11.868 10.75 11.6208C10.38 11.3736 10.0916 11.0222 9.92127 10.611C9.75097 10.1999 9.70642 9.7475 9.79323 9.31105C9.88005 8.87459 10.0943 8.47368 10.409 8.15901C10.7237 7.84434 11.1246 7.63005 11.561 7.54323C11.9975 7.45642 12.4499 7.50097 12.861 7.67127C13.2722 7.84157 13.6236 8.12996 13.8708 8.49997C14.118 8.86998 14.25 9.30499 14.25 9.75C14.25 10.3467 14.0129 10.919 13.591 11.341C13.169 11.7629 12.5967 12 12 12ZM12 1.5C9.81273 1.50248 7.71575 2.37247 6.16911 3.91911C4.62247 5.46575 3.75248 7.56273 3.75 9.75C3.75 12.6938 5.11031 15.8138 7.6875 18.7734C8.84552 20.1108 10.1489 21.3151 11.5734 22.3641C11.6995 22.4524 11.8498 22.4998 12.0037 22.4998C12.1577 22.4998 12.308 22.4524 12.4341 22.3641C13.856 21.3147 15.1568 20.1104 16.3125 18.7734C18.8859 15.8138 20.25 12.6938 20.25 9.75C20.2475 7.56273 19.3775 5.46575 17.8309 3.91911C16.2843 2.37247 14.1873 1.50248 12 1.5ZM12 20.8125C10.4503 19.5938 5.25 15.1172 5.25 9.75C5.25 7.95979 5.96116 6.2429 7.22703 4.97703C8.4929 3.71116 10.2098 3 12 3C13.7902 3 15.5071 3.71116 16.773 4.97703C18.0388 6.2429 18.75 7.95979 18.75 9.75C18.75 15.1153 13.5497 19.5938 12 20.8125Z" fill="#F29F04" />
                                    </svg>
                                </div>
                                <span className="text-[#EEE] font-poppins text-[16px] font-normal leading-[26px]">Address</span>
                            </div>
                            <span className="self-stretch text-[#FCFCFC] font-poppins text-[20px] font-medium leading-[32px]">123 Blockchain Ave, Crypto City, CC 10101</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Contact Form Container */}
                <div className="flex-1 lg:flex-none lg:w-[556px] flex flex-col p-8  py-10 items-center gap-[56px] self-stretch rounded-[20px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A]">
                    <p className="self-stretch text-[#FCFCFC] font-poppins text-[20px] font-normal leading-[32px]">
                        If you have questions or need assistance, feel free to reach out through our contact form below.
                    </p>

                    <div className="flex flex-col items-start gap-[24px] self-stretch">

                        {/* Row 1: First & Last Name */}
                        <div className="flex flex-col md:flex-row items-start gap-[24px] self-stretch">
                            <div className="flex flex-col items-start gap-2 flex-1 self-stretch">
                                <label className="text-[#EEE] font-poppins text-[16px] font-medium leading-[26px]">First Name*</label>
                                <input
                                    type="text"
                                    placeholder="Enter your first name"
                                    className="flex h-[52px] p-[18px] items-center gap-2 self-stretch rounded-[6px] border border-[rgba(74,74,74,0.70)] bg-[#0D0D0D] text-white font-poppins text-[14px] outline-none focus:border-[#F29F04] transition-all"
                                />
                            </div>
                            <div className="flex flex-col items-start gap-2 flex-1 self-stretch">
                                <label className="text-[#EEE] font-poppins text-[16px] font-medium leading-[26px]">Last Name*</label>
                                <input
                                    type="text"
                                    placeholder="Enter your last name"
                                    className="flex h-[52px] p-[18px] items-center gap-2 self-stretch rounded-[6px] border border-[rgba(74,74,74,0.70)] bg-[#0D0D0D] text-white font-poppins text-[14px] outline-none focus:border-[#F29F04] transition-all"
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="flex flex-col items-start gap-2 self-stretch">
                            <label className="text-[#EEE] font-poppins text-[16px] font-medium leading-[26px]">Email Address*</label>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex h-[52px] p-[18px] items-center gap-2 self-stretch rounded-[6px] border border-[rgba(74,74,74,0.70)] bg-[#0D0D0D] text-white font-poppins text-[14px] outline-none focus:border-[#F29F04] transition-all"
                            />
                        </div>

                        {/* Subject */}
                        <div className="flex flex-col items-start gap-2 self-stretch">
                            <label className="text-[#EEE] font-poppins text-[16px] font-medium leading-[26px]">Subject</label>
                            <div className="relative self-stretch">
                                <select className="appearance-none flex p-[18px] justify-between items-center self-stretch rounded-[6px] border border-[rgba(74,74,74,0.70)] bg-[#0D0D0D] text-[#616161] font-poppins text-[14px] outline-none focus:border-[#F29F04] transition-all w-full cursor-pointer">
                                    <option value="" disabled selected>Select a message subject</option>
                                    <option value="inquiry">General Inquiry</option>
                                    <option value="support">Support</option>
                                    <option value="partnership">Partnership</option>
                                </select>
                                <div className="pointer-events-none absolute right-[18px] top-1/2 -translate-y-1/2">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M19 9L12 16L5 9" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="flex flex-col items-start gap-2 self-stretch">
                            <label className="text-[#EEE] font-poppins text-[16px] font-medium leading-[26px]">Message*</label>
                            <textarea
                                placeholder="Enter your message here"
                                className="flex min-h-[140px] p-[18px] items-start gap-2 self-stretch rounded-[6px] border border-[rgba(74,74,74,0.70)] bg-[#0D0D0D] text-white font-poppins text-[14px] outline-none focus:border-[#F29F04] transition-all resize-none"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="flex w-[180px] mt-8 py-[12px] px-[24px] mx-auto justify-center items-center gap-[12px] rounded-[80px] bg-[#F29F04] text-[#0D0D0D] font-poppins text-[16px] font-medium leading-[26px] transition-all hover:brightness-110 active:scale-95">
                            Send Message
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
