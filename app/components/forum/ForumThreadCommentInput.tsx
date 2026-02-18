import React from 'react';

interface ForumThreadCommentInputProps {
    title: string;
    placeholder: string;
    cancelLabel: string;
    publishLabel: string;
    value: string;
    onChange: (value: string) => void;
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
    onChange,
    onCancel,
    onPublish,
    isPublishing = false,
    error,
}) => {
    const isPublishDisabled = isPublishing || !value.trim();

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

                <div className="flex h-[150px] p-6 items-start gap-2.5 self-stretch rounded-[30px] bg-[#262626]">
                    <textarea
                        className="w-full h-full bg-transparent border-none outline-none text-[#6C6C6C] text-left font-poppins text-[18px] font-normal leading-[16px] resize-none placeholder-[#6C6C6C]"
                        placeholder={placeholder}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
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
                        className="flex w-[200px] py-3 px-6 justify-center items-center gap-3 self-stretch rounded-[80px] bg-[#F29F04] text-[#0D0D0D] text-center font-poppins text-[16px] font-medium leading-[26px] hover:bg-[#F29F04]/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
