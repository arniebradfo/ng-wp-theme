// TODO: this should be in a typings.d.ts file?

export interface IContent {
    rendered: string;
}

export interface IProtectedContent extends IContent {
    protected: boolean;
}

export interface IMenuItem {
    ID: number;
    attr: string;
    children: IMenuItem[];
    classes: string;
    description: string;
    object: string;
    object_id: number;
    order: number;
    parent: number;
    target: string;
    title: string;
    type: string;
    type_label: string;
    url: string;
    xfn: string;
}

export interface IPost {
    author: 1;
    categories: number[];
    comment_status: 'open' | 'closed' ; // TODO: add the rest
    content: IProtectedContent;
    date: string; // Date?
    date_gmt: string; // Date?
    excerpt: IProtectedContent;
    featured_media: number;
    format:  'standard' | 'link' | 'video' | 'aside' | 'audio' | 'chat' | 'gallery' | 'image' | 'quote' | 'status' ;
    guid: IContent;
    id: number[];
    link: string; // URL?
    meta: string[]; // TODO: is this right???
    modified: string; // Date?
    modified_gmt: string; // Date?
    ping_status: 'open' | 'closed' ; // TODO: add the rest
    slug: string;
    status: 'open' | 'closed' ; // TODO: add the rest
    sticky: boolean;
    tags: number[];
    template: string;
    title: IContent;
    type: 'post' | 'page' ; // TODO: add the rest
    _links: {
        about: {
            href: string;
        }[];
        author: {
            embeddable: boolean;
            href: string;
        }[];
        collection: {
            href: string;
        }[];
        curies: {
            href: string;
            name: string;
            templated: boolean;
        }[];
        replies: {
            embeddable: boolean;
            href: string;
        }[];
        self: {
            href: string;
        }[];
        'version-history': {
            href: string;
        }[];
        'wp:attachment': {
            href: string;
        }[];
        'wp:featuredmedia': {
            embeddable: boolean;
            href: string;
        }[];
        'wp:term': {
            embeddable: boolean;
            href: string;
            taxonomy: 'category' | 'post_tag'; // TODO: add the rest
        }[];
    }
}
