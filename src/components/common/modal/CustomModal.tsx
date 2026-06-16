"use client";

import { ReactNode } from "react";

interface CustomModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}

export function CustomModal({
  open,
  title,
  children,
  onClose,
  footer,
}: CustomModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between bg-pwhite border-b rounded-t-xl border-gray-200 px-5 py-4">
          <h2 className="text-lg text-black/80 uppercase">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 cursor-pointer rounded-sm text-xl text-gray-500 hover:border hover:border-pborder hover:bg-white hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
