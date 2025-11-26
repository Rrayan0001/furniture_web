import React, { useState, useEffect } from 'react';

interface EditableTextProps {
    initialValue: string;
    onSave: (value: string) => Promise<void>;
    isEditing: boolean;
    className?: string;
    tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
    multiline?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({
    initialValue,
    onSave,
    isEditing,
    className = '',
    tag: Tag = 'div',
    multiline = false,
}) => {
    const [value, setValue] = useState(initialValue);
    const [isEditingActive, setIsEditingActive] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleSave = async () => {
        if (value !== initialValue) {
            setLoading(true);
            try {
                await onSave(value);
            } catch (error) {
                console.error('Failed to save:', error);
                setValue(initialValue); // Revert on error
            } finally {
                setLoading(false);
            }
        }
        setIsEditingActive(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            handleSave();
        } else if (e.key === 'Escape') {
            setValue(initialValue);
            setIsEditingActive(false);
        }
    };

    if (isEditing && isEditingActive) {
        return multiline ? (
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={`w-full bg-white text-black border border-blue-500 p-1 rounded ${className}`}
                autoFocus
            />
        ) : (
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={`w-full bg-white text-black border border-blue-500 p-1 rounded ${className}`}
                autoFocus
            />
        );
    }

    return (
        <Tag
            className={`${className} ${isEditing ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-blue-500 hover:bg-blue-50/50 rounded px-1 -mx-1 transition-all' : ''} ${loading ? 'opacity-50' : ''}`}
            onClick={() => isEditing && setIsEditingActive(true)}
            title={isEditing ? 'Click to edit' : undefined}
        >
            {value}
        </Tag>
    );
};

export default EditableText;
