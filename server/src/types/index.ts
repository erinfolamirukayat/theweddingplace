export interface Product {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    image_url: string;
    suggested_amount: number;
    created_at: Date;
}

export interface Registry {
    id: number;
    couple_names: string;
    wedding_date: Date;
    story?: string;
    share_url?: string;
    created_at: Date;
}

export interface RegistryItem {
    id: number;
    registry_id: number;
    product_id: number;
    quantity: number;
    contributions_received: number;
    is_fully_funded: boolean;
    created_at: Date;
}

export interface Contributor {
    id: number;
    registry_item_id: number;
    name: string;
    email: string;
    amount: number;
    message?: string;
    payment_reference: string;
    created_at: Date;
}

export interface RegistryPicture {
    id: number;
    registry_id: number;
    image_url: string;
    created_at: Date;
}

export interface SurveyResponse {
    id: number;
    name?: string;
    email?: string;
    age_range?: string;
    relationship_status?: string;
    wedding_planning_status?: string;
    received_unwanted_gifts?: string;
    known_registry_platforms?: string;
    registry_usefulness?: string;
    would_use_platform?: string;
    desired_gifts?: string;
    preferred_shopping_method?: string;
    other_shopping_method?: string;
    desired_features?: string;
    open_to_conversation?: string;
    contact_info?: string;
    created_at: Date;
} 