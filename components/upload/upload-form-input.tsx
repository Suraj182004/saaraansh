'use client';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormEvent } from "react";

interface UploadFormInputProps {
    isUploading?: boolean;
    onChange?: (file: File | null) => void;
}

export default function UploadFormInput({ isUploading = false, onChange }: UploadFormInputProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange && e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-end items-center gap-1.5">
                <Input 
                    id="file" 
                    type="file" 
                    name="file" 
                    accept="application/pdf"
                    required 
                    className=""
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
            </div>
        </div>
    );
}