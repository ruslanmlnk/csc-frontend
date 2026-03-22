import React from 'react';
import ForumRichTextEditor from './ForumRichTextEditor';
import { hasVisibleForumRichTextContent, type ForumRichTextDocument } from '@/lib/forumRichText';

interface ForumThreadCommentInputProps {
    title: string;
    placeholder: string;
    cancelLabel: string;
    publishLabel: string;
    value: ForumRichTextDocument | null;
    editorKey: number;
    onChange: (value: ForumRichTextDocument, plainText: string) => void;
    onCancel: () => void;
    onPublish: () => void;
    isPublishing?: boolean;
    error?: string;
}

const ForumThreadCommentInput: React.FC<ForumThreadCommentInputProps> = ({
    title,
    placeholder,
    cancelLabel,
    publishLabel,
    value,
    editorKey,
    onChange,
    onCancel,
    onPublish,
    isPublishing = false,
    error,
}) => {
    const isPublishDisabled = isPublishing || !hasVisibleForumRichTextContent(value);

    return (
        <div className="flex flex-col items-start gap-6 self-stretch rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6">
            <div className="flex flex-col justify-end items-end gap-6 self-stretch">
                <div className="flex px-4 items-center gap-6 self-stretch">
                    <div className="flex justify-center items-center gap-4">
                        <div className="text-white font-poppins text-[20px] font-medium leading-[32px]">
                            {title}
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <ForumRichTextEditor
                        key={editorKey}
                        placeholder={placeholder}
                        disabled={isPublishing}
                        onChange={onChange}
                    />
                </div>

                {error && (
                    <div className="w-full text-[#FF9C9C] text-[16px] leading-[20px]">
                        {error}
                    </div>
                )}

                <div className="flex h-[58px] items-center gap-2.5">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex w-[200px] py-3 px-6 justify-center items-center gap-[5px] self-stretch rounded-[80px] border border-[#FCC660] text-[#FCC660] text-center font-poppins text-[16px] font-medium leading-[26px] hover:bg-[#FCC660]/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isPublishing}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onPublish}
                        className="flex w-[200px] py-3 px-6 justify-center items-center gap-3 self-stretch rounded-[80px] bg-[#F29F04] text-[#0D0D0D] text-center font-poppins text-[16px] font-medium leading-[26px] transition-colors hover:bg-[#F29F04]/80 disabled:cursor-not-allowed disabled:bg-[#7A5510] disabled:text-[#151515] disabled:hover:bg-[#7A5510]"
                        disabled={isPublishDisabled}
                    >
                        {isPublishing ? 'Publishing...' : publishLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForumThreadCommentInput;
