export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            pages: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            sections: {
                Row: {
                    id: string
                    page_id: string
                    key: string
                    display_order: number
                    is_visible: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    page_id: string
                    key: string
                    display_order: number
                    is_visible?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    page_id?: string
                    key?: string
                    display_order?: number
                    is_visible?: boolean
                    created_at?: string
                }
            }
            content_blocks: {
                Row: {
                    id: string
                    section_id: string
                    key: string
                    type: string
                    content: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    section_id: string
                    key: string
                    type: string
                    content: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    section_id?: string
                    key?: string
                    type?: string
                    content?: Json
                    created_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    thumbnail_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    thumbnail_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    thumbnail_url?: string | null
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    price: number
                    sale_price: number | null
                    main_image_url: string | null
                    category_id: string | null
                    is_available: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    price: number
                    sale_price?: number | null
                    main_image_url?: string | null
                    category_id?: string | null
                    is_available?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    price?: number
                    sale_price?: number | null
                    main_image_url?: string | null
                    category_id?: string | null
                    is_available?: boolean
                    created_at?: string
                }
            }
            section_products: {
                Row: {
                    id: string
                    section_id: string
                    product_id: string
                    display_order: number
                }
                Insert: {
                    id?: string
                    section_id: string
                    product_id: string
                    display_order: number
                }
                Update: {
                    id?: string
                    section_id?: string
                    product_id?: string
                    display_order?: number
                }
            }
        }
    }
}
