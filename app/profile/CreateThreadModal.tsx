"use client";

import React, { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import ForumRichTextEditor from '@/app/components/forum/ForumRichTextEditor';
import { createEmptyForumRichText, hasVisibleForumRichTextContent, type ForumRichTextDocument } from '@/lib/forumRichText';
import { useLanguage } from '@/app/components/i18n/LanguageProvider';

interface CreateThreadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void | Promise<void>;
    initialSubCategoryId?: string;
    initialSubCategorySlug?: string;
}

type CategoryOption = {
    id: string;
    name: string;
    categoryName?: string;
    slug?: string;
};

const CreateThreadModal: React.FC<CreateThreadModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialSubCategoryId,
    initialSubCategorySlug,
}) => {
    const { language, messages: t } = useLanguage();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState<ForumRichTextDocument>(createEmptyForumRichText());
    const [editorKey, setEditorKey] = useState(0);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [subCategories, setSubCategories] = useState<CategoryOption[]>([]);
    const [isSubCategoriesLoading, setIsSubCategoriesLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialCategoryAppliedRef = useRef(false);
    const tagsLabel = language === 'uk' ? 'Теги' : 'Tags';
    const tagsPlaceholder = language === 'uk'
        ? 'Введіть тег і натисніть Enter'
        : 'Type a tag and press Enter';
    const tagsHint = language === 'uk'
        ? 'Додавайте власні теги через Enter або кому.'
        : 'Add your own tags with Enter or comma.';

    const resetForm = () => {
        setTitle('');
        setCategory('');
        setContent(createEmptyForumRichText());
        setEditorKey((value) => value + 1);
        setTags([]);
        setTagInput('');
        setSubmitError('');
    };

    const handleClose = (force = false) => {
        if (isSubmitting && !force) return;
        resetForm();
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        let cancelled = false;

        const loadSubCategories = async () => {
            setIsSubCategoriesLoading(true);

            try {
                const response = await fetch('/api/forum-sub-categories', { cache: 'no-store' });
                const data = await response.json().catch(() => null) as { subCategories?: CategoryOption[] } | null;

                if (!response.ok) {
                    throw new Error();
                }

                if (!cancelled) {
                    setSubCategories(data?.subCategories || []);
                }
            } catch {
                if (!cancelled) {
                    setSubCategories([]);
                }
            } finally {
                if (!cancelled) {
                    setIsSubCategoriesLoading(false);
                }
            }
        };

        loadSubCategories();

        return () => {
            cancelled = true;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            initialCategoryAppliedRef.current = false;
            return;
        }

        if (initialCategoryAppliedRef.current) {
            return;
        }

        const normalizedId = typeof initialSubCategoryId === 'string' ? initialSubCategoryId.trim() : '';
        if (normalizedId) {
            setCategory(normalizedId);
            initialCategoryAppliedRef.current = true;
            return;
        }

        const normalizedSlug = typeof initialSubCategorySlug === 'string'
            ? initialSubCategorySlug.trim().toLowerCase()
            : '';
        if (normalizedSlug) {
            const matchedBySlug = subCategories.find(
                (item) => typeof item.slug === 'string' && item.slug.toLowerCase() === normalizedSlug,
            );

            if (matchedBySlug?.id) {
                setCategory(matchedBySlug.id);
                initialCategoryAppliedRef.current = true;
                return;
            }

            if (!isSubCategoriesLoading) {
                setCategory('');
                initialCategoryAppliedRef.current = true;
            }

            return;
        }

        setCategory('');
        initialCategoryAppliedRef.current = true;
    }, [isOpen, initialSubCategoryId, initialSubCategorySlug, subCategories, isSubCategoriesLoading]);

    const normalizeTag = (value: string) => value.trim().replace(/\s+/g, ' ').replace(/,+$/g, '');

    const appendTag = (value: string) => {
        const normalizedTag = normalizeTag(value);
        if (!normalizedTag) {
            return false;
        }

        let wasAdded = false;

        setTags((current) => {
            const alreadyExists = current.some((item) => item.toLowerCase() === normalizedTag.toLowerCase());
            if (alreadyExists) {
                return current;
            }

            wasAdded = true;
            return [...current, normalizedTag];
        });

        return wasAdded;
    };

    const resolveSubmitTags = () => {
        const normalizedInputTag = normalizeTag(tagInput);
        if (!normalizedInputTag) {
            return tags;
        }

        const alreadyExists = tags.some((item) => item.toLowerCase() === normalizedInputTag.toLowerCase());
        if (alreadyExists) {
            return tags;
        }

        return [...tags, normalizedInputTag];
    };

    const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter' && event.key !== ',') {
            return;
        }

        event.preventDefault();

        if (appendTag(tagInput)) {
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags((current) => current.filter((item) => item !== tagToRemove));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError('');

        if (!title.trim() || !category || !hasVisibleForumRichTextContent(content)) {
            setSubmitError(t.forum.fillRequiredFields);
            return;
        }

        setIsSubmitting(true);

        try {
            const nextTags = resolveSubmitTags();

            if (nextTags !== tags) {
                setTags(nextTags);
            }

            setTagInput('');

            const response = await fetch('/api/threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    category,
                    content,
                    tags: nextTags,
                }),
            });

            const data = await response.json().catch(() => null) as { error?: string } | null;

            if (!response.ok) {
                throw new Error(data?.error || t.common.create);
            }

            if (onSuccess) {
                await onSuccess();
            }

            handleClose(true);
        } catch (error) {
            const message = error instanceof Error ? error.message : t.common.create;
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-5 md:p-10 animate-fadeIn backdrop-blur-[5px]"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div
                className="w-full max-w-[900px] flex flex-col gap-10 p-10 md:p-10 rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] relative shadow-2xl overflow-y-auto no-scrollbar max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px]">
                        {t.forum.createNewThreadTitle}
                    </h2>
                    <button onClick={() => handleClose()} className="p-2 transition-all hover:rotate-90 active:scale-95 text-[#D9D9D9]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M20.4853 20.4852C20.2977 20.6727 20.0434 20.7781 19.7782 20.7781C19.513 20.7781 19.2586 20.6727 19.0711 20.4852L12 13.4141L4.92893 20.4852C4.7414 20.6727 4.48704 20.7781 4.22183 20.7781C3.95661 20.7781 3.70226 20.6727 3.51472 20.4852C3.32718 20.2976 3.22183 20.0433 3.22183 19.7781C3.22183 19.5128 3.32718 19.2585 3.51472 19.071L10.5858 11.9999L3.51472 4.92882C3.32718 4.74129 3.22182 4.48693 3.22183 4.22172C3.22183 3.9565 3.32718 3.70215 3.51472 3.51461C3.70225 3.32707 3.95661 3.22172 4.22182 3.22172C4.48704 3.22172 4.7414 3.32707 4.92893 3.51461L12 10.5857L19.0711 3.51461C19.2586 3.32707 19.513 3.22172 19.7782 3.22172C20.0434 3.22172 20.2977 3.32707 20.4853 3.51461C20.6728 3.70215 20.7782 3.9565 20.7782 4.22172C20.7782 4.48693 20.6728 4.74129 20.4853 4.92882L13.4142 11.9999L20.4853 19.071C20.6728 19.2585 20.7782 19.5128 20.7782 19.7781C20.7782 20.0433 20.6728 20.2976 20.4853 20.4852Z" fill="currentColor" />
                        </svg>
                    </button>
                </div>

                <form className="flex flex-col gap-10 w-full" onSubmit={handleSubmit}>
                    {/* Thread Title */}
                    <div className="flex flex-col gap-4">
                        <label className="font-poppins text-[16px] leading-[26px]">
                            <span className="text-[#9E9E9E]">{t.forum.threadTitleLabel} </span>
                            <span className="text-[#F29F04]">*</span>
                        </label>
                        <div className="flex p-[16px_24px] items-center gap-[10px] rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626]">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t.forum.threadTitlePlaceholder}
                                className="bg-transparent border-none outline-none text-white font-poppins text-[16px] leading-[32px] w-full placeholder-[#A5A5A5]"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* SubCategory Dropdown */}
                    <div className="flex flex-col gap-4">
                        <label className="font-poppins text-[16px] leading-[26px]">
                            <span className="text-[#9E9E9E]">{t.forum.subCategoryLabel} </span>
                            <span className="text-[#F29F04]">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={isSubCategoriesLoading || isSubmitting}
                                className="w-full appearance-none rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626] p-[16px_24px] text-[16px] leading-[32px] font-poppins text-white outline-none disabled:cursor-not-allowed disabled:text-[#A5A5A5]"
                            >
                                <option value="" disabled>
                                    {isSubCategoriesLoading ? t.forum.loadingSubcategories : t.forum.selectSubcategory}
                                </option>
                                {subCategories.map((item) => (
                                    <option key={item.id} value={item.id} className="bg-[#262626] text-white">
                                        {item.categoryName ? `${item.categoryName} / ${item.name}` : item.name}
                                    </option>
                                ))}
                            </select>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2"
                            >
                                <path d="M14.049 3.85762C14.4953 3.41131 15.2188 3.41131 15.6651 3.85762C16.1114 4.30394 16.1114 5.02738 15.6651 5.47369L9.12937 12.0094C8.50573 12.6331 7.49408 12.6331 6.87044 12.0094L0.334729 5.47369C-0.111573 5.02738 -0.111579 4.30393 0.334729 3.85762C0.781045 3.41132 1.50449 3.41132 1.9508 3.85762L7.99991 9.90673L14.049 3.85762Z" fill="#F29F04" />
                            </svg>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-4">
                        <label className="text-[#9E9E9E] font-poppins text-[16px] leading-[26px]">
                            {tagsLabel}
                        </label>
                        <div className="flex min-h-[64px] w-full flex-wrap items-center gap-3 rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#262626] px-4 py-3">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-2 rounded-[80px] bg-[#F29F04] px-4 py-2 font-poppins text-[16px] font-medium leading-[26px] text-[#070707]"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        disabled={isSubmitting}
                                        aria-label={`${language === 'uk' ? 'Видалити тег' : 'Remove tag'} ${tag}`}
                                        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#070707]/10 text-[#070707] transition hover:bg-[#070707]/20 disabled:cursor-not-allowed"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(event) => setTagInput(event.target.value)}
                                onKeyDown={handleTagKeyDown}
                                onBlur={() => {
                                    if (appendTag(tagInput)) {
                                        setTagInput('');
                                    }
                                }}
                                placeholder={tagsPlaceholder}
                                disabled={isSubmitting}
                                className="min-w-[220px] flex-1 bg-transparent font-poppins text-[16px] leading-[26px] text-white outline-none placeholder-[#A5A5A5]"
                            />
                        </div>
                        <p className="text-[14px] leading-[20px] text-[#757575] font-poppins">
                            {tagsHint}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-4">
                        <label className="font-poppins text-[16px] leading-[26px]">
                            <span className="text-[#9E9E9E]">{t.forum.contentLabel} </span>
                            <span className="text-[#F29F04]">*</span>
                        </label>
                        <div className="rounded-[16px] border border-[rgba(74,74,74,0.70)] bg-[#262626] p-4">
                            <ForumRichTextEditor
                                key={editorKey}
                                placeholder={t.forum.contentPlaceholder}
                                disabled={isSubmitting}
                                onChange={(value) => {
                                    setContent(value);
                                }}
                            />
                        </div>
                    </div>
                {submitError && (
                    <p className="text-[14px] leading-[20px] text-[#FF8080] font-poppins">
                        {submitError}
                    </p>
                )}

                <div className="flex items-center gap-[10px] w-full h-[58px]">
                    <button
                        type="button"
                        onClick={() => handleClose()}
                        disabled={isSubmitting}
                        className="flex flex-1 py-[12px] px-[24px] justify-center items-center rounded-[80px] border border-[#FCC660] text-[#FCC660] font-poppins text-[16px] font-medium leading-[26px] transition-all hover:bg-[#FCC660]/10"
                    >
                        {t.common.cancel}
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex flex-1 py-[12px] px-[24px] justify-center items-center rounded-[80px] bg-[#F29F04] text-[#0D0D0D] font-poppins text-[16px] font-medium leading-[26px] transition-all hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? t.common.creating : t.forum.createThreadButton}
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
};

export default CreateThreadModal;
