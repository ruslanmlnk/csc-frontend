"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthPageLayout from "@/app/components/auth/AuthPageLayout";
import { AuthOrDivider, TelegramAuthButton } from "@/app/components/auth/AuthShared";

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
        <AuthPageLayout topPaddingClassName="pt-[162.49px]" contentGapClassName="gap-[34px]">
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

                <AuthOrDivider />
                <TelegramAuthButton label="Sign up via Telegram" />
            </div>
        </AuthPageLayout>
    );
};

export default RegisterPage;
