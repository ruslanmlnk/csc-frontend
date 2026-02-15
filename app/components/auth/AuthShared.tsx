import { Send } from 'lucide-react'
import React from 'react'

export const AuthOrDivider: React.FC = () => (
  <div className="flex items-center gap-5 my-8 leading-[20px]">
    <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, #0D0D0D -14.69%, #FCC660 100%)' }} />
    <span className="text-sm text-white/60 font-poppins uppercase leading-[20px]">OR</span>
    <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(270deg, #0D0D0D -14.69%, #FCC660 100%)' }} />
  </div>
)

type TelegramAuthButtonProps = {
  label: string
}

export const TelegramAuthButton: React.FC<TelegramAuthButtonProps> = ({ label }) => (
  <button
    className="w-full h-[50px] rounded-[80px] flex items-center justify-center gap-[10px] text-white font-poppins text-sm hover:opacity-90 transition-opacity border border-[rgba(74,74,74,0.7)]"
    style={{ background: 'linear-gradient(90deg, #4B8AFF 0%, #0F1F3E 100%)' }}
    type="button"
  >
    <Send size={20} className="fill-white" />
    {label}
  </button>
)
