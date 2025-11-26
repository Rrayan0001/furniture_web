import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface EditableImageProps {
    src: string;
    alt: string;
    onSave: (url: string) => Promise<void>;
    isEditing: boolean;
    className?: string;
}

const EditableImage: React.FC<EditableImageProps> = ({
    src,
    alt,
    onSave,
    isEditing,
    className = '',
}) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);

            await onSave(data.publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image!');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`relative group ${className} ${!src ? 'bg-gray-100 min-h-[100px] flex items-center justify-center' : ''}`}>
            {src ? (
                <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />
            ) : (
                <div className="text-gray-400 text-sm">
                    {/* Placeholder content if needed, but the label will cover it or sit on top */}
                </div>
            )}

            {isEditing && (
                <div className={`absolute inset-0 flex items-center justify-center ${src ? 'bg-black bg-opacity-0 group-hover:bg-opacity-30' : ''}`}>
                    <label className={`cursor-pointer bg-white text-black px-4 py-2 rounded shadow-lg transition-opacity transform hover:scale-105 ${src ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                        {uploading ? 'Uploading...' : (src ? 'Change Image' : 'Upload Image')}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>
                </div>
            )}
        </div>
    );
};

export default EditableImage;
