"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Send } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackgroundEffects from "../components/BackgroundEffects";

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        login: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
            }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            alert(data?.error || 'Registration failed');
            return;
        }

        window.location.href = '/';
    };

    return (
        <main className="relative min-h-screen bg-[#0D0D0D] overflow-hidden">
            {/* Winbet Glow Background Logic */}
            <div className="absolute inset-x-0 top-0 z-0 w-full h-[1000px] pointer-events-none select-none overflow-hidden">
                <div
                    className="absolute inset-0 z-[-2] w-full h-full bg-repeat opacity-40"
                    style={{ backgroundImage: "url('/images/noise.webp')", backgroundSize: "200px 200px" }}
                />
                <div
                    className="absolute inset-0 z-[-1] w-full h-full"
                    style={{
                        background: "linear-gradient(82.71deg, rgba(242, 159, 4, 0.7) 0.75%, #0d0d0d 30.5%, #0d0d0d 69.72%, rgba(242, 159, 4, 0.7) 99.19%)"
                    }}
                />
                {/* Mobile Glow */}
                <div className="md:hidden absolute inset-0 w-full h-full">
                    <Image
                        src="/images/glow-mobile.webp"
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                {/* Desktop Glow */}
                <div className="hidden md:block absolute inset-0 w-full h-full">
                    <Image
                        src="/images/glow-desktop.webp"
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            <Header />

            {/* Main Content */}
            <section className="relative pt-[162.49px] pb-[80px] flex flex-col items-center px-5 min-h-screen z-10">
                <div className="w-full max-w-[1320px] flex flex-col items-center">

                    <div className="flex flex-col xl:flex-row w-full items-center xl:items-start justify-center gap-[34px]">
                        {/* Sidebar Image Left - Desktop Only */}
                        <div className="hidden xl:block w-[386px] h-[732px] relative rounded-[20px] overflow-hidden border border-white/10 group">
                            <Image
                                src="/images/service-sidebar.webp"
                                alt="Sidebar Decoration"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* Registration Card - Precise Figma Implementation */}
                        <div className="w-full max-w-[440px] p-8 md:p-[34px_32px] rounded-2xl border border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] animate-fadeIn">
                            <div className="flex flex-col gap-2 mb-8">
                                <h1 className="text-[24px] font-medium text-white font-poppins leading-[32px]">
                                    Create an account
                                </h1>
                                <p className="text-[14px] text-white/60 font-poppins leading-[16px]">
                                    Enter details to create an account
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {/* Login Input */}
                                <div className="flex flex-col gap-4">
                                    <label className="text-[16px] text-[#9E9E9E] font-poppins leading-[26px]">Login</label>
                                    <div className="relative h-[50px] w-full bg-[#262626] border border-[rgba(74,74,74,0.7)] rounded-xl overflow-hidden px-4 flex items-center">
                                        <input
                                            type="text"
                                            name="login"
                                            value={formData.login}
                                            onChange={handleChange}
                                            placeholder="Mellaile"
                                            className="w-full bg-transparent text-white font-poppins text-base focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className="flex flex-col gap-4">
                                    <label className="text-[16px] text-[#9E9E9E] font-poppins leading-[26px]">Email</label>
                                    <div className="relative h-[50px] w-full bg-[#262626] border border-[rgba(74,74,74,0.7)] rounded-xl overflow-hidden px-4 flex items-center">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="mellaile@outlook.com"
                                            className="w-full bg-transparent text-white font-poppins text-base focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="flex flex-col gap-4">
                                    <label className="text-[16px] text-[#9E9E9E] font-poppins leading-[26px]">Password</label>
                                    <div className="relative h-[50px] w-full bg-[#262626] border border-[rgba(74,74,74,0.7)] rounded-xl overflow-hidden px-4 flex items-center justify-between">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-transparent text-white font-poppins text-base focus:outline-none pr-4"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-[#757575] hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Input */}
                                <div className="flex flex-col gap-4">
                                    <label className="text-[16px] text-[#9E9E9E] font-poppins leading-[26px]">Confirm Password</label>
                                    <div className="relative h-[50px] w-full bg-[#262626] border border-[rgba(74,74,74,0.7)] rounded-xl overflow-hidden px-4 flex items-center justify-between">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full bg-transparent text-white font-poppins text-base focus:outline-none pr-4"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-[#757575] hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="w-full h-[50px] rounded-[80px] bg-[#F29F04] text-[#0D0D0D] font-medium font-poppins text-base hover:opacity-90 transition-opacity">
                                    Create Account
                                </button>
                            </form>

                            <div className="mt-8 text-center text-sm">
                                <span className="text-white/80 font-poppins">Already have an account? </span>
                                <Link href="/login" className="text-[#F29F04] font-medium hover:underline font-poppins">
                                    Log In
                                </Link>
                            </div>

                            {/* Precise Figma OR Divider */}
                            <div className="flex items-center gap-5 my-8 leading-[20px]">
                                <div className="flex-1 h-[1px]" style={{ background: "linear-gradient(90deg, #0D0D0D -14.69%, #FCC660 100%)" }} />
                                <span className="text-sm text-white/60 font-poppins uppercase leading-[20px]">OR</span>
                                <div className="flex-1 h-[1px]" style={{ background: "linear-gradient(270deg, #0D0D0D -14.69%, #FCC660 100%)" }} />
                            </div>

                            {/* Telegram Button with Precise Gradient */}
                            <button className="w-full h-[50px] rounded-[80px] flex items-center justify-center gap-[10px] text-white font-poppins text-sm hover:opacity-90 transition-opacity border border-[rgba(74,74,74,0.7)]"
                                style={{ background: "linear-gradient(90deg, #4B8AFF 0%, #0F1F3E 100%)" }}>
                                <Send size={20} className="fill-white" />
                                Sign up via Telegram
                            </button>
                        </div>

                        {/* Sidebar Image Right - Desktop Only */}
                        <div className="hidden xl:block w-[386px] h-[732px] relative rounded-[20px] overflow-hidden border border-white/10 group">
                            <Image
                                src="/images/service-sidebar.webp"
                                alt="Sidebar Decoration"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* Mobile Stacked Images */}
                        <div className="xl:hidden flex flex-col gap-6 w-full px-4">
                            <div className="w-full aspect-[159/103] relative rounded-[40px] overflow-hidden">
                                <Image src="/images/service-sidebar.webp" alt="Sidebar Decoration" fill className="object-cover" />
                            </div>
                            <div className="w-full aspect-[159/103] relative rounded-[40px] overflow-hidden">
                                <Image src="/images/service-sidebar.webp" alt="Sidebar Decoration" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default RegisterPage;
