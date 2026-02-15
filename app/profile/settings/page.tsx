"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, Eye, EyeOff, Globe } from 'lucide-react';
import { BackendUser } from '@/lib/backend/users';
import GlowBackground from '@/app/components/layout/GlowBackground';
import SurfaceCard from '@/app/components/layout/SurfaceCard';
import { InstagramIcon, TelegramIcon, TikTokIcon } from '@/app/components/profile/SocialIcons';

const UserIconLarge = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M57.7317 53C53.9242 46.4175 48.0567 41.6975 41.2092 39.46C44.5962 37.4437 47.2278 34.3712 48.6997 30.7145C50.1716 27.0578 50.4024 23.019 49.3568 19.2184C48.3112 15.4178 46.0469 12.0655 42.9116 9.67634C39.7763 7.28717 35.9435 5.99323 32.0017 5.99323C28.0598 5.99323 24.227 7.28717 21.0917 9.67634C17.9565 12.0655 15.6921 15.4178 14.6465 19.2184C13.6009 23.019 13.8317 27.0578 15.3036 30.7145C16.7755 34.3712 19.4071 37.4437 22.7942 39.46C15.9467 41.695 10.0792 46.415 6.27165 53C6.13203 53.2277 6.03941 53.481 5.99928 53.7451C5.95914 54.0091 5.97229 54.2785 6.03796 54.5374C6.10363 54.7963 6.22049 55.0394 6.38163 55.2524C6.54278 55.4653 6.74495 55.6439 6.97622 55.7775C7.20748 55.9111 7.46316 55.997 7.72817 56.0301C7.99318 56.0633 8.26215 56.0431 8.51921 55.9706C8.77626 55.8981 9.01621 55.7749 9.22487 55.6082C9.43354 55.4415 9.60671 55.2347 9.73415 55C14.4442 46.86 22.7692 42 32.0017 42C41.2342 42 49.5592 46.86 54.2692 55C54.3966 55.2347 54.5698 55.4415 54.7784 55.6082C54.9871 55.7749 55.227 55.8981 55.4841 55.9706C55.7412 56.0431 56.0101 56.0633 56.2751 56.0301C56.5401 55.997 56.7958 55.9111 57.0271 55.7775C57.2584 55.6439 57.4605 55.4653 57.6217 55.2524C57.7828 55.0394 57.8997 54.7963 57.9653 54.5374C58.031 54.2785 58.0442 54.0091 58.004 53.7451C57.9639 53.481 57.8713 53.2277 57.7317 53ZM18.0017 24C18.0017 21.2311 18.8227 18.5243 20.3611 16.222C21.8994 13.9198 24.0859 12.1253 26.6441 11.0657C29.2023 10.0061 32.0172 9.72884 34.7329 10.269C37.4487 10.8092 39.9432 12.1426 41.9011 14.1005C43.8591 16.0585 45.1925 18.553 45.7326 21.2688C46.2728 23.9845 45.9956 26.7994 44.936 29.3576C43.8763 31.9158 42.0819 34.1023 39.7796 35.6406C37.4773 37.1789 34.7706 38 32.0017 38C28.2898 37.9961 24.7312 36.5198 22.1065 33.8951C19.4819 31.2705 18.0056 27.7118 18.0017 24Z" fill="#BDBDBD" />
    </svg>
);

type AvatarShape = {
    id?: string | number;
    url?: string;
};

type UploadAvatarResponse = {
    id?: string | number;
    doc?: { id?: string | number };
    message?: string;
    error?: string;
    errors?: Array<{ message?: string }>;
};

const SettingsPage: React.FC = () => {
    const [user, setUser] = useState<BackendUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        company: '',
        position: '',
        directions: '',
        instagram: '',
        telegram: '',
        tiktok: '',
        website: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await fetch('/api/auth/me');
                const data = await response.json();
                if (data?.user) {
                    setUser(data.user);
                    setFormData((prev) => ({
                        ...prev,
                        name: data.user.name || '',
                        email: data.user.email || '',
                        bio: data.user.bio || '',
                        company: data.user.company || '',
                        position: data.user.position || '',
                        directions: data.user.directions || '',
                        instagram: data.user.instagram || '',
                        telegram: data.user.telegram || '',
                        tiktok: data.user.tiktok || '',
                        website: data.user.website || '',
                    }));
                } else {
                    window.location.href = '/login';
                }
            } catch (err) {
                console.error('Failed to load user', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setShowSuccess(false);
        try {
            // If password change is requested, verify current password first
            if (formData.newPassword) {
                if (!formData.currentPassword) {
                    alert('Please enter your current password to change it');
                    setIsSaving(false);
                    return;
                }

                if (formData.newPassword !== formData.confirmPassword) {
                    alert('New passwords do not match');
                    setIsSaving(false);
                    return;
                }

                const verifyRes = await fetch('/api/profile/verify-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: formData.currentPassword }),
                });

                if (!verifyRes.ok) {
                    const errData = await verifyRes.json();
                    alert(errData.message || 'Incorrect current password');
                    setIsSaving(false);
                    return;
                }
            }

            const updateData: Record<string, string> = {
                name: formData.name,
                bio: formData.bio,
                company: formData.company,
                position: formData.position,
                directions: formData.directions,
                instagram: formData.instagram,
                telegram: formData.telegram,
                tiktok: formData.tiktok,
                website: formData.website,
            };

            if (formData.newPassword) {
                updateData.password = formData.newPassword;
            }

            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                setShowSuccess(true);
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }))
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Failed to save', err);
            alert('Internal error');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadFormData = new FormData();
        const altText = user?.name || user?.email || 'User avatar';
        uploadFormData.append('altText', altText);
        uploadFormData.append('file', file);

        setIsSaving(true);
        try {
            const uploadRes = await fetch('/api/profile/avatar', {
                method: 'POST',
                body: uploadFormData,
            });

            if (!uploadRes.ok) {
                const err = (await uploadRes.json().catch(() => ({}))) as UploadAvatarResponse;
                alert(err.message || err.error || 'Failed to upload image. Please check file size and format.');
                return;
            }

            const uploadData = (await uploadRes.json().catch(() => null)) as UploadAvatarResponse | null;
            const newAvatarId = uploadData?.id ?? uploadData?.doc?.id;
            if (newAvatarId) {
                // Delete old avatar if it exists to clean up backend
                const oldAvatarId = user?.avatar && typeof user.avatar === 'object' ? (user.avatar as AvatarShape).id : null;

                // Now update the user doc with the new avatar ID
                const updateRes = await fetch('/api/profile', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ avatar: newAvatarId }),
                });

                if (updateRes.ok) {
                    // Try to delete old media after successful update
                    if (oldAvatarId) {
                        try {
                            await fetch(`/api/profile/avatar?id=${oldAvatarId}`, { method: 'DELETE' });
                        } catch (e) {
                            console.error('Failed to delete old avatar', e);
                        }
                    }
                    setShowSuccess(true);
                    // Hide after a short delay and then reload
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    const err = (await updateRes.json().catch(() => ({}))) as UploadAvatarResponse;
                    alert(err.message || err.error || err.errors?.[0]?.message || 'Failed to update user profile with new photo.');
                }
            } else {
                alert('Server returned invalid data after upload.');
            }
        } catch (err) {
            console.error('Photo upload failed', err);
            alert('An error occurred during photo upload.');
        } finally {
            e.target.value = '';
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#F29F04] w-10 h-10" />
            </div>
        );
    }

    const avatarUrl = user?.avatar && typeof user.avatar === 'object' ? (user.avatar as AvatarShape).url : null;

    const ActionButtons = () => (
        <div className="flex flex-col gap-10 w-full mb-10 last:mb-0">
            {showSuccess && (
                <div className="flex flex-col items-center justify-center w-full py-12 rounded-[40px] border border-[#F29F04] bg-[#1A1A1A] animate-in fade-in zoom-in-95 out-fade-out out-zoom-out-95 duration-500 fill-mode-forwards transition-all">
                    <div className="w-[100px] h-[100px] relative mb-4">
                        <Image
                            src="/images/success-icon.svg"
                            alt=""
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px]">
                        Changes saved
                    </span>
                </div>
            )}
            <div className="flex items-center gap-[10px] w-full h-[58px]">
                <Link href="/profile" className="flex flex-1 h-full items-center justify-center rounded-[80px] border border-[#FCC660] text-[#FCC660] font-poppins text-[16px] font-medium leading-[26px] transition-all hover:bg-[#FCC660]/10">
                    Cancel changes
                </Link>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex flex-1 h-full items-center justify-center rounded-[80px] bg-[#F29F04] text-[#0D0D0D] font-poppins text-[16px] font-medium leading-[26px] transition-all hover:brightness-110 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin" /> : 'Save changes'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen bg-[#0D0D0D] overflow-hidden selection:bg-[#F29F04] selection:text-black">
            <GlowBackground
                heightClassName="h-[1200px]"
                gradient="linear-gradient(83deg, rgba(242, 159, 4, 0.70) 0.75%, #0D0D0D 30.5%, #0D0D0D 69.72%, rgba(242, 159, 4, 0.70) 99.19%)"
                gradientBlendMode="soft-light, normal"
            />

            <main className="relative z-10 w-full max-w-[1280px] px-5 pb-[120px] pt-[80px] md:pt-[120px] flex flex-col items-center gap-16 mx-auto">
                <div className="flex flex-col items-center gap-8 w-full">
                    <h1 className="text-center font-poppins text-[40px] md:text-[80px] font-medium leading-[1.1] tracking-[-3.2px] bg-gradient-to-b from-white to-[#999] bg-clip-text text-transparent [text-shadow:0_4px_4px_rgba(0,0,0,0.4)]">
                        Personal profile settings
                    </h1>
                    <Link href="/profile" className="flex items-center gap-4 text-[#FCFCFC] font-poppins text-[24px] transition-opacity hover:opacity-80">
                        <ArrowLeft size={32} /> Back to profile
                    </Link>
                </div>

                <div className="flex flex-col gap-16 w-full">
                    {/* Profile Photo */}
                    <SurfaceCard className="flex flex-col p-8 md:p-10 gap-10 overflow-hidden">
                        <h2 className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px]">Profile Photo</h2>
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="w-[160px] h-[160px] rounded-full bg-[#262626] border border-white/50 flex items-center justify-center shrink-0 overflow-hidden relative">
                                {avatarUrl ? (
                                    <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}${avatarUrl}`} alt="Avatar" fill className="object-cover" />
                                ) : (
                                    <UserIconLarge />
                                )}
                            </div>
                            <div className="flex flex-col items-start gap-6">
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-white font-poppins text-[24px] font-medium leading-[32px]">Update your photo</h3>
                                    <p className="text-[#6C6C6C] font-poppins text-[16px] leading-[26px]">Choose a clear photo that represents you well. Maximum file size: 5MB</p>
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                                <button onClick={() => fileInputRef.current?.click()} className="flex px-6 py-3 justify-center items-center rounded-[80px] bg-[#F29F04] text-[#0D0D0D] font-poppins text-[16px] font-medium leading-[26px] transition-all hover:brightness-110">
                                    Upload new photo
                                </button>
                            </div>
                        </div>
                    </SurfaceCard>

                    {/* Personal information */}
                    <SurfaceCard className="flex flex-col p-8 md:p-10 gap-10">
                        <h2 className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px]">Personal information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="flex flex-col gap-4">
                                <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">Name</label>
                                <div className="flex p-[16px_24px] items-center rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626]">
                                    <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Your name" className="bg-transparent border-none outline-none text-white font-poppins text-[16px] leading-[32px] w-full placeholder-[#A5A5A5]" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">Email</label>
                                <div className="flex p-[16px_24px] items-center rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626]">
                                    <input name="email" value={formData.email} disabled type="email" placeholder="Your mail" className="bg-transparent border-none outline-none text-white/50 font-poppins text-[16px] leading-[32px] w-full placeholder-[#A5A5A5] cursor-not-allowed" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 col-span-1 md:col-span-2">
                                <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">About me</label>
                                <div className="flex h-[150px] p-[16px_24px] items-start rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626]">
                                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Description of your activities..." className="bg-transparent border-none outline-none text-white font-poppins text-[16px] leading-[32px] w-full h-full resize-none placeholder-[#A5A5A5]" />
                                </div>
                            </div>
                        </div>
                    </SurfaceCard>

                    {/* Team details */}
                    <SurfaceCard className="flex flex-col p-8 md:p-10 gap-10">
                        <h2 className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px]">Team details</h2>
                        <div className="flex flex-col gap-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="flex flex-col gap-4">
                                    <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">Team name</label>
                                    <div className="flex p-[16px_24px] items-center rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626]">
                                        <input name="company" value={formData.company} onChange={handleInputChange} type="text" placeholder="Company" className="bg-transparent border-none outline-none text-white font-poppins text-[16px] leading-[32px] w-full placeholder-[#A5A5A5]" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">Position</label>
                                    <div className="flex p-[16px_24px] items-center rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626]">
                                        <input name="position" value={formData.position} onChange={handleInputChange} type="text" placeholder="Teamlead" className="bg-transparent border-none outline-none text-white font-poppins text-[16px] leading-[32px] w-full placeholder-[#A5A5A5]" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">Directions (separated by commas)</label>
                                <div className="flex p-[16px_24px] items-center rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626]">
                                    <input name="directions" value={formData.directions} onChange={handleInputChange} type="text" placeholder="Investing, Crypto, Trading" className="bg-transparent border-none outline-none text-white font-poppins text-[16px] leading-[32px] w-full placeholder-[#A5A5A5]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="flex flex-col gap-4">
                                    <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">Instagram</label>
                                    <div className="flex p-[16px_24px] items-center gap-4 rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626]">
                                        <InstagramIcon size={28} />
                                        <input name="instagram" value={formData.instagram} onChange={handleInputChange} type="text" placeholder="@example" className="bg-transparent border-none outline-none text-white font-poppins text-[16px] leading-[32px] w-full placeholder-[#A5A5A5]" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">Telegram</label>
                                    <div className="flex p-[16px_24px] items-center gap-4 rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626]">
                                        <TelegramIcon size={28} />
                                        <input name="telegram" value={formData.telegram} onChange={handleInputChange} type="text" placeholder="@example" className="bg-transparent border-none outline-none text-white font-poppins text-[16px] leading-[32px] w-full placeholder-[#A5A5A5]" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">TikTok</label>
                                    <div className="flex p-[16px_24px] items-center gap-4 rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626]">
                                        <TikTokIcon size={28} />
                                        <input name="tiktok" value={formData.tiktok} onChange={handleInputChange} type="text" placeholder="@example" className="bg-transparent border-none outline-none text-white font-poppins text-[16px] leading-[32px] w-full placeholder-[#A5A5A5]" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">Website</label>
                                <div className="flex p-[16px_24px] items-center gap-4 rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626]">
                                    <Globe size={28} className="text-[#F29F04]" />
                                    <input name="website" value={formData.website} onChange={handleInputChange} type="text" placeholder="example.com" className="bg-transparent border-none outline-none text-white font-poppins text-[16px] leading-[32px] w-full placeholder-[#A5A5A5]" />
                                </div>
                            </div>
                        </div>
                    </SurfaceCard>

                    <ActionButtons />

                    {/* Change password */}
                    <SurfaceCard className="flex flex-col p-8 md:p-10 gap-10">
                        <h2 className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px]">Change password</h2>
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-col gap-4">
                                <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">Current password</label>
                                <div className="flex h-16 p-[16px_24px] items-center rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626] relative">
                                    <input
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        type={showPassword.current ? "text" : "password"}
                                        placeholder="Enter current password"
                                        className="bg-transparent border-none outline-none text-white w-full pr-12 font-poppins text-[16px]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                        className="absolute right-6 text-[#9E9E9E] hover:text-[#F29F04] transition-colors"
                                    >
                                        {showPassword.current ? <EyeOff size={24} /> : <Eye size={24} />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="flex flex-col gap-4">
                                    <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">New password</label>
                                    <div className="flex h-16 p-[16px_24px] items-center rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626] relative">
                                        <input
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            type={showPassword.new ? "text" : "password"}
                                            placeholder="Enter new password"
                                            className="bg-transparent border-none outline-none text-white w-full pr-12 font-poppins text-[16px]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                            className="absolute right-6 text-[#9E9E9E] hover:text-[#F29F04] transition-colors"
                                        >
                                            {showPassword.new ? <EyeOff size={24} /> : <Eye size={24} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">Confirm your new password</label>
                                    <div className="flex h-16 p-[16px_24px] items-center rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626] relative">
                                        <input
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            type={showPassword.confirm ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            className="bg-transparent border-none outline-none text-white w-full pr-12 font-poppins text-[16px]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                            className="absolute right-6 text-[#9E9E9E] hover:text-[#F29F04] transition-colors"
                                        >
                                            {showPassword.confirm ? <EyeOff size={24} /> : <Eye size={24} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SurfaceCard>

                    <ActionButtons />

                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
