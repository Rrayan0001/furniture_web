import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import EditableImage from '@/components/admin/EditableImage';

const CategoryForm = () => {
    const router = useRouter();
    const { id } = router.query;
    const isNew = id === 'new' || !id;

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isNew && id) {
            fetchCategory(id as string);
        }
    }, [id, isNew]);

    const fetchCategory = async (categoryId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', categoryId)
            .single() as any;

        if (error) {
            console.error(error);
            router.push('/admin/categories');
        } else if (data) {
            setName(data.name);
            setSlug(data.slug);
            setDescription(data.description || '');
            setThumbnailUrl(data.thumbnail_url || '');
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const categoryData = {
            name,
            slug,
            description,
            thumbnail_url: thumbnailUrl,
        };

        let error;
        if (isNew) {
            const { error: insertError } = await supabase
                .from('categories')
                // @ts-ignore
                .insert(categoryData as any);
            error = insertError;
        } else {
            const { error: updateError } = await supabase
                .from('categories')
                // @ts-ignore
                .update(categoryData as any)
                .eq('id', id);
            error = updateError;
        }

        setLoading(false);

        if (error) {
            alert('Error saving category: ' + error.message);
        } else {
            router.push('/admin/categories');
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        if (isNew) {
            // Auto-generate slug
            setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
        }
    };

    return (
        <AdminLayout title={isNew ? 'New Category' : 'Edit Category'}>
            <div className="bg-white p-6 rounded shadow max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={handleNameChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug</label>
                        <input
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black"
                        />
                        <p className="text-xs text-gray-500 mt-1">URL-friendly version of the name.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            {thumbnailUrl ? (
                                <div className="relative inline-block">
                                    <img src={thumbnailUrl} alt="Thumbnail" className="h-32 w-32 object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={() => setThumbnailUrl('')}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                    >
                                        X
                                    </button>
                                </div>
                            ) : (
                                <EditableImage
                                    src=""
                                    alt="Upload Thumbnail"
                                    onSave={async (url) => setThumbnailUrl(url)}
                                    isEditing={true}
                                    className="mx-auto h-32 w-32 object-contain"
                                />
                            )}
                            {!thumbnailUrl && <p className="text-sm text-gray-500 mt-2">Click to upload</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default CategoryForm;
