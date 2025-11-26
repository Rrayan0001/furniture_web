import Head from 'next/head'
import Header from '@/components/Header'
import Hero, { HeroContent } from '@/components/Hero'
import NewArrivals, { NewArrivalsContent, Product } from '@/components/NewArrivals'
import CirclesCollection, { CirclesCollectionContent } from '@/components/CirclesCollection'
import FoundFlorals, { FoundFloralsContent } from '@/components/FoundFlorals'
import Categories from '@/components/Categories'
import Footer from '@/components/Footer'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [heroContent, setHeroContent] = useState<HeroContent | undefined>(undefined);
  const [newArrivalsContent, setNewArrivalsContent] = useState<NewArrivalsContent | undefined>(undefined);
  const [circlesContent, setCirclesContent] = useState<CirclesCollectionContent | undefined>(undefined);
  const [foundFloralsContent, setFoundFloralsContent] = useState<FoundFloralsContent | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchPageData();

    // Real-time subscription
    const channel = supabase
      .channel('public:data')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_blocks' }, () => {
        fetchPageData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchPageData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPageData = async () => {
    try {
      // 1. Get Page ID for 'home'
      const { data: page } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', 'home')
        .single() as any;

      if (page) {
        // 2. Fetch Sections & Content Blocks
        const { data: sections } = await supabase
          .from('sections')
          .select(`
            id,
            key,
            content_blocks ( key, content )
          `)
          .eq('page_id', page.id);

        if (sections) {
          sections.forEach((section: any) => {
            const content: any = {};
            if (section.content_blocks) {
              section.content_blocks.forEach((block: any) => {
                content[block.key] = block.content;
              });
            }

            if (section.key === 'hero') setHeroContent(content);
            if (section.key === 'new_arrivals') setNewArrivalsContent(content);
            if (section.key === 'circles') setCirclesContent(content);
            if (section.key === 'found_florals') setFoundFloralsContent(content);
          });
        }
      }

      // 3. Fetch Products
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
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <Head>
        <title>granger vintage - Midcentury Modern, Vintage, & Retro Home Decor</title>
        <meta name="description" content="Midcentury Modern, Vintage, & Retro Home Decor based out of Austin, TX" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-[#FAF9F6]">
        <Header />
        <Hero content={heroContent} />
        <NewArrivals
          content={newArrivalsContent}
          products={products.length > 0 ? products.slice(0, 2) : undefined}
        />
        <CirclesCollection
          content={circlesContent}
          products={products.length > 0 ? products.slice(2, 5) : undefined}
        />
        <FoundFlorals
          content={foundFloralsContent}
          products={products.length > 0 ? products.slice(5, 8) : undefined}
        />
        <Categories />
        <Footer />
      </main>
    </>
  )
}

