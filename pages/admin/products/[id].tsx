import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import EditableImage from '@/components/admin/EditableImage';

const ProductForm = () => {
    const router = useRouter();
    const { id } = router.query;
    const isNew = id === 'new' || !id;

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [mainImageUrl, setMainImageUrl] = useState('');
    const [additionalImages, setAdditionalImages] = useState<string[]>([]);
    const [modelUrl, setModelUrl] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);

    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (!isNew && id) {
            fetchProduct(id as string);
        }
    }, [id, isNew]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('id, name');
        if (data) setCategories(data);
    };

    const fetchProduct = async (productId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single() as any;

        if (error) {
            console.error(error);
            router.push('/admin/products');
        } else if (data) {
            setName(data.name);
            setSlug(data.slug);
            setDescription(data.description || '');
            setPrice(data.price);
            setSalePrice(data.sale_price || '');
            setCategoryId(data.category_id || '');
            setMainImageUrl(data.main_image_url || '');
            setAdditionalImages(data.additional_images || []);
            setModelUrl(data.model_url || '');
            setIsAvailable(data.is_available);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const productData = {
            name,
            slug,
            description,
            price: parseFloat(price),
            sale_price: salePrice ? parseFloat(salePrice) : null,
            category_id: categoryId || null,
            main_image_url: mainImageUrl,
            additional_images: additionalImages,
            model_url: modelUrl,
            is_available: isAvailable,
        };

        console.log('Saving product with data:', productData);
        console.log('Model URL:', modelUrl);

        let error;
        if (isNew) {
            // @ts-ignore
            const { error: insertError } = await supabase
                .from('products')
                .insert(productData as any);
            error = insertError;
        } else {
            // @ts-ignore
            const { error: updateError } = await supabase
                .from('products')
                // @ts-ignore
                .update(productData as any)
                .eq('id', id);
            error = updateError;
        }

        setLoading(false);

        if (error) {
            alert('Error saving product: ' + error.message);
        } else {
            alert('Product saved successfully!');
            router.push('/admin/products');
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        if (isNew) {
            setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
        }
    };

    const handleAddAdditionalImage = (url: string) => {
        setAdditionalImages([...additionalImages, url]);
    };

    const handleRemoveAdditionalImage = (index: number) => {
        const newImages = [...additionalImages];
        newImages.splice(index, 1);
        setAdditionalImages(newImages);
    };

    const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        console.log('Uploading model file:', file.name, 'Size:', file.size);

        // Simple validation - accept .glb, .gltf, and .ply
        if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf') && !file.name.endsWith('.ply')) {
            alert('Please upload a .glb, .gltf, or .ply file');
            return;
        }

        setLoading(true);
        const fileName = `${Date.now()}-${file.name}`;
        console.log('Uploading to storage as:', fileName);

        const { data, error } = await supabase.storage
            .from('images') // Using the same bucket for simplicity, ideally separate bucket
            .upload(`models/${fileName}`, file);

        if (error) {
            console.error('Upload error:', error);
            alert('Error uploading model: ' + error.message);
        } else if (data) {
            const { data: urlData } = supabase.storage
                .from('images')
                .getPublicUrl(`models/${fileName}`);
            console.log('Model uploaded successfully! URL:', urlData.publicUrl);
            setModelUrl(urlData.publicUrl);
            alert('Model uploaded successfully!');
        }
        setLoading(false);
    };

    return (
        <AdminLayout title={isNew ? 'New Product' : 'Edit Product'}>
            <div className="bg-white p-6 rounded shadow max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sale Price ($) <span className="text-gray-400 font-normal">(Optional)</span></label>
                            <input
                                type="number"
                                step="0.01"
                                value={salePrice}
                                onChange={(e) => setSalePrice(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black"
                        >
                            <option value="">Select a category...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black"
                        />
                    </div>

                    {/* Image Management Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Images & Media</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Main Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    {mainImageUrl ? (
                                        <div className="relative inline-block">
                                            <img src={mainImageUrl} alt="Main" className="h-48 w-auto object-cover rounded" />
                                            <button
                                                type="button"
                                                onClick={() => setMainImageUrl('')}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ) : (
                                        <EditableImage
                                            src=""
                                            alt="Upload Image"
                                            onSave={async (url) => setMainImageUrl(url)}
                                            isEditing={true}
                                            className="mx-auto h-48 w-full object-contain"
                                        />
                                    )}
                                    {!mainImageUrl && <p className="text-sm text-gray-500 mt-2">Click to upload</p>}
                                </div>
                            </div>

                            {/* 3D Model */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">3D Model (.glb/.gltf/.ply)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center flex flex-col items-center justify-center h-full min-h-[200px]">
                                    {modelUrl ? (
                                        <div className="relative w-full">
                                            <p className="text-sm text-green-600 break-all mb-2">Model Uploaded!</p>
                                            <p className="text-xs text-gray-500 break-all mb-4">{modelUrl.split('/').pop()}</p>
                                            <button
                                                type="button"
                                                onClick={() => setModelUrl('')}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Remove Model
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full">
                                            <input
                                                type="file"
                                                accept=".glb,.gltf,.ply"
                                                onChange={handleModelUpload}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">Upload a 3D model file</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Images */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {additionalImages.map((img, index) => (
                                    <div key={index} className="relative border rounded p-2">
                                        <img src={img} alt={`Additional ${index}`} className="w-full h-32 object-cover rounded" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAdditionalImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-36">
                                    <EditableImage
                                        src=""
                                        alt="Add Image"
                                        onSave={async (url) => handleAddAdditionalImage(url)}
                                        isEditing={true}
                                        className="w-full h-full"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Add Image</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center pt-4">
                        <input
                            id="is_available"
                            type="checkbox"
                            checked={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.checked)}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                        />
                        <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">
                            Available for sale
                        </label>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
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
                            {loading ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default ProductForm;
