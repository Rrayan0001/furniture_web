import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { GetServerSideProps } from 'next';

interface Section {
  id: string;
  key: string;
  display_order: number;
  content_blocks: Array<{
    key: string;
    content: { text: string };
  }>;
}

interface AboutProps {
  sections: Section[];
}

export default function About({ sections }: AboutProps) {
  // Group sections by key/type
  const heroSection = sections.find(s => s.key === 'hero');
  // Assuming other sections are text sections for now, or we can filter by key list
  const textSections = sections.filter(s => s.key !== 'hero');

  const getBlockValue = (section: Section | undefined, key: string) => {
    if (!section) return '';
    const block = section.content_blocks.find(b => b.key === key);
    return block?.content?.text || '';
  };

  return (
    <>
      <Head>
        <title>About - granger vintage</title>
        <meta name="description" content="Learn about granger vintage" />
      </Head>
      <main className="min-h-screen bg-[#FAF9F6]">
        <Header />

        {/* Hero Section */}
        <section className="w-full bg-black text-white pt-[120px] pb-20">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center">
            <h1 className="text-[40px] md:text-[60px] font-bold mb-6">
              {getBlockValue(heroSection, 'heading') || 'About granger vintage'}
            </h1>
            <p className="text-[18px] md:text-[20px] max-w-[800px] mx-auto">
              {getBlockValue(heroSection, 'description') || 'We curate timeless pieces that tell a story.'}
            </p>
          </div>
        </section>

        {/* Text Sections */}
        {textSections.map((section) => (
          <section key={section.id} className="w-full bg-[#FAF9F6] py-16">
            <div className="max-w-[1000px] mx-auto px-4 md:px-8">
              <h2 className="text-[28px] md:text-[36px] font-bold text-black mb-6">
                {getBlockValue(section, 'heading')}
              </h2>
              <p className="text-[16px] md:text-[18px] text-black leading-relaxed whitespace-pre-wrap">
                {getBlockValue(section, 'content')}
              </p>
            </div>
          </section>
        ))}

        <Footer />
      </main>
    </>
  );
}

interface Page {
  id: string;
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: pageData } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', 'about')
    .single();

  const page = pageData as Page | null;

  if (!page) {
    return { props: { sections: [] } };
  }

  const { data: sections } = await supabase
    .from('sections')
    .select(`
      id,
      key,
      display_order,
      content_blocks (
        id,
        key,
        content
      )
    `)
    .eq('page_id', page.id)
    .order('display_order', { ascending: true }) as any;

  return {
    props: {
      sections: sections || []
    }
  };
};

