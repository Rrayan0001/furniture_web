import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Hero, { HeroContent } from '@/components/Hero';
import NewArrivals, { NewArrivalsContent, Product } from '@/components/NewArrivals';
import CirclesCollection, { CirclesCollectionContent } from '@/components/CirclesCollection';
import FoundFlorals, { FoundFloralsContent } from '@/components/FoundFlorals';
import Categories from '@/components/Categories';
import Footer from '@/components/Footer';
import Link from 'next/link';

import EditableText from '@/components/admin/EditableText';

const AdminEditor = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [loading, setLoading] = useState(true);
    const [pageId, setPageId] = useState<string | null>(null);

    // State for Home page content
    const [heroContent, setHeroContent] = useState<HeroContent | undefined>(undefined);
    const [newArrivalsContent, setNewArrivalsContent] = useState<NewArrivalsContent | undefined>(undefined);
    const [circlesContent, setCirclesContent] = useState<CirclesCollectionContent | undefined>(undefined);
    const [foundFloralsContent, setFoundFloralsContent] = useState<FoundFloralsContent | undefined>(undefined);

    // State for generic page content (About, Contact, etc.)
    const [sections, setSections] = useState<any[]>([]);

    // State for products
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin');
                return;
            }
            if (slug) {
                fetchPageData(typeof slug === 'string' ? slug : slug[0]);
            }
        };
        checkUser();
    }, [slug, router]);

    const fetchPageData = async (pageSlug: string) => {
        setLoading(true);
        try {
            // 1. Get Page ID
            let { data: page, error: pageError } = await supabase
                .from('pages')
                .select('id')
                .eq('slug', pageSlug)
                .single() as any;

            if (pageError && pageError.code === 'PGRST116') {
                // Page doesn't exist, create it?
                if (['home', 'about', 'contact'].includes(pageSlug)) {
                    const { data: newPage, error: createError } = await supabase
                        .from('pages')
                        // @ts-ignore
                        .insert({ slug: pageSlug, title: pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1) } as any)
                        .select()
                        .single();
                    if (createError) throw createError;
                    page = newPage;
                }
            } else if (pageError) {
                throw pageError;
            }

            if (page) {
                setPageId(page.id);

                // 2. Fetch Sections & Content Blocks
                const { data: sectionsData } = await supabase
                    .from('sections')
                    .select(`
            id,
            key,
            display_order,
            content_blocks ( key, content )
          `)
                    .eq('page_id', page.id)
                    .order('display_order', { ascending: true });

                if (sectionsData) {
                    // For Home page, we map to specific states
                    if (pageSlug === 'home') {
                        sectionsData.forEach((section: any) => {
                            const content: any = {};
                            if (section.content_blocks) {
                                section.content_blocks.forEach((block: any) => {
                                    content[block.key] = block.content?.text || block.content; // Handle JSON or raw
                                });
                            }

                            if (section.key === 'hero') setHeroContent(content);
                            if (section.key === 'new_arrivals') setNewArrivalsContent(content);
                            if (section.key === 'circles') setCirclesContent(content);
                            if (section.key === 'found_florals') setFoundFloralsContent(content);
                        });
                    } else {
                        // For other pages, keep generic structure
                        setSections(sectionsData);
                    }
                }
            }

            // 3. Fetch Products (Global)
            const { data: productsData } = await supabase.from('products').select('*');
            if (productsData) {
                setProducts(productsData.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    image_url: p.main_image_url || '',
                })));
            }

        } catch (error) {
            console.error('Error fetching page data:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateContent = async (sectionKey: string, contentKey: string, value: any) => {
        if (!pageId) return;

        try {
            // 1. Get or Create Section
            let { data: section } = await supabase
                .from('sections')
                .select('id')
                .eq('page_id', pageId)
                .eq('key', sectionKey)
                .single() as any;

            if (!section) {
                // Determine order? For now just append or 0
                const { data: newSection, error } = await supabase
                    .from('sections')
                    // @ts-ignore
                    .insert({ page_id: pageId, key: sectionKey, display_order: 10 } as any)
                    .select()
                    .single();
                if (error) throw error;
                section = newSection;
            }

            if (!section) return;

            // 2. Upsert Content Block
            const { data: block } = await supabase
                .from('content_blocks')
                .select('id, content')
                .eq('section_id', section.id)
                .eq('key', contentKey)
                .single() as any;

            const newContent = { text: value }; // Always wrap in JSON for consistency now

            if (block) {
                await supabase
                    .from('content_blocks')
                    // @ts-ignore
                    .update({ content: newContent } as any)
                    .eq('id', block.id);
            } else {
                await supabase
                    .from('content_blocks')
                    // @ts-ignore
                    .insert({
                        section_id: section.id,
                        key: contentKey,
                        type: 'text',
                        content: newContent
                    } as any);
            }

            // Update local state
            if (slug === 'home') {
                if (sectionKey === 'hero') setHeroContent(prev => ({ ...prev!, [contentKey]: value }));
                if (sectionKey === 'new_arrivals') setNewArrivalsContent(prev => ({ ...prev!, [contentKey]: value }));
                if (sectionKey === 'circles') setCirclesContent(prev => ({ ...prev!, [contentKey]: value }));
                if (sectionKey === 'found_florals') setFoundFloralsContent(prev => ({ ...prev!, [contentKey]: value }));
            } else {
                // Update generic sections state
                setSections(prev => prev.map(s => {
                    if (s.key === sectionKey) {
                        const updatedBlocks = s.content_blocks.map((b: any) =>
                            b.key === contentKey ? { ...b, content: newContent } : b
                        );
                        // If block didn't exist in local state, add it
                        if (!updatedBlocks.find((b: any) => b.key === contentKey)) {
                            updatedBlocks.push({ key: contentKey, content: newContent });
                        }
                        return { ...s, content_blocks: updatedBlocks };
                    }
                    return s;
                }));
            }

        } catch (error) {
            console.error('Error updating content:', error);
            alert('Failed to save changes');
        }
    };

    const updateProduct = async (productId: string, key: string, value: any) => {
        // ... existing updateProduct logic ...
        console.log('Update product', productId, key, value);
        try {
            const updateData: any = {};
            if (key === 'image_url') updateData.main_image_url = value;
            else updateData[key] = value;

            const { error } = await supabase
                .from('products')
                // @ts-ignore
                .update(updateData)
                .eq('id', productId);

            if (error) throw error;

            setProducts(prev => prev.map(p => p.id === productId ? { ...p, [key]: value } : p));
        } catch (e) {
            console.error("Error updating product", e);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Editor...</div>;

    // Helper to get content from generic section
    const getSectionContent = (sectionKey: string, contentKey: string) => {
        const section = sections.find(s => s.key === sectionKey);
        const block = section?.content_blocks?.find((b: any) => b.key === contentKey);
        return block?.content?.text || '';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <div className="bg-black text-white p-4 flex justify-between items-center sticky top-0 z-[100]">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="font-bold hover:text-gray-300">
                        &larr; Dashboard
                    </Link>
                    <span className="text-gray-400">|</span>
                    <span className="font-semibold">Editing: {slug}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Changes save automatically</span>
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.push('/admin');
                        }}
                        className="text-white hover:text-red-400 font-semibold ml-4 border border-gray-600 px-3 py-1 rounded hover:border-red-400 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="bg-white min-h-screen relative">
                <Header topOffset="57px" isAdmin={true} />

                {slug === 'home' ? (
                    <>
                        <div className="relative group">
                            <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-xs px-2 py-1 rounded pointer-events-none">
                                Hero Section
                            </div>
                            <Hero
                                content={heroContent}
                                isEditing={true}
                                onUpdate={(key, val) => updateContent('hero', key, val)}
                            />
                        </div>
                        {/* ... other Home sections ... */}
                        <div className="relative group">
                            <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-xs px-2 py-1 rounded pointer-events-none">
                                New Arrivals Section
                            </div>
                            <NewArrivals
                                content={newArrivalsContent}
                                products={products.slice(0, 2)}
                                isEditing={true}
                                onUpdateContent={(key, val) => updateContent('new_arrivals', key, val)}
                                onUpdateProduct={updateProduct}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-xs px-2 py-1 rounded pointer-events-none">
                                Circles Collection
                            </div>
                            <CirclesCollection
                                content={circlesContent}
                                products={products.slice(2, 5)}
                                isEditing={true}
                                onUpdateContent={(key, val) => updateContent('circles', key, val)}
                                onUpdateProduct={updateProduct}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-xs px-2 py-1 rounded pointer-events-none">
                                Found Florals
                            </div>
                            <FoundFlorals
                                content={foundFloralsContent}
                                products={products.slice(5, 8)}
                                isEditing={true}
                                onUpdateContent={(key, val) => updateContent('found_florals', key, val)}
                                onUpdateProduct={updateProduct}
                            />
                        </div>
                        <Categories />
                    </>
                ) : slug === 'about' ? (
                    <div className="pt-[140px] pb-20 min-h-screen bg-[#FAF9F6]">
                        {/* Hero Section */}
                        <div className="w-full bg-black text-white py-20 mb-16 relative group">
                            <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-xs px-2 py-1 rounded pointer-events-none">
                                Hero Section
                            </div>
                            <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center">
                                <div className="mb-6">
                                    <EditableText
                                        initialValue={getSectionContent('hero', 'heading') || 'About granger vintage'}
                                        onSave={(val) => updateContent('hero', 'heading', val)}
                                        isEditing={true}
                                        tag="h1"
                                        className="text-[40px] md:text-[60px] font-bold text-white"
                                    />
                                </div>
                                <div className="max-w-[800px] mx-auto">
                                    <EditableText
                                        initialValue={getSectionContent('hero', 'description') || 'We curate timeless pieces that tell a story.'}
                                        onSave={(val) => updateContent('hero', 'description', val)}
                                        isEditing={true}
                                        tag="p"
                                        className="text-[18px] md:text-[20px] text-white"
                                        multiline
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Text Sections */}
                        {sections.filter(s => s.key !== 'hero').map((section) => (
                            <div key={section.id} className="w-full bg-[#FAF9F6] py-16 relative group border-b border-gray-200">
                                <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-xs px-2 py-1 rounded pointer-events-none">
                                    Section: {section.key}
                                </div>
                                <div className="max-w-[1000px] mx-auto px-4 md:px-8">
                                    <div className="mb-6">
                                        <EditableText
                                            initialValue={getSectionContent(section.key, 'heading')}
                                            onSave={(val) => updateContent(section.key, 'heading', val)}
                                            isEditing={true}
                                            tag="h2"
                                            className="text-[28px] md:text-[36px] font-bold text-black"
                                        />
                                    </div>
                                    <EditableText
                                        initialValue={getSectionContent(section.key, 'content')}
                                        onSave={(val) => updateContent(section.key, 'content', val)}
                                        isEditing={true}
                                        tag="p"
                                        className="text-[16px] md:text-[18px] text-black leading-relaxed whitespace-pre-wrap"
                                        multiline
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="pt-[140px] text-center">
                        <h2 className="text-2xl font-bold">Editor not implemented for {slug} yet.</h2>
                    </div>
                )}

                <Footer />
            </div>
        </div>
    );
};

export default AdminEditor;
