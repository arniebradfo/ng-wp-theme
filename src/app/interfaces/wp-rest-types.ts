// TODO: this should be in a typings.d.ts file?

export interface IWpMenuItem {
    ID: number;
    attr: string;
    children: IWpMenuItem[];
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

export interface IWpPage {
    author: number;
    comment_status: 'open' | 'closed'; // TODO: add the rest
    content: IWpContentProtected;
    date: string;
    date_gmt: string;
    excerpt: IWpContentProtected;
    featured_media: number;
    guid: IWpContent;
    id: number;
    link: string;
    menu_order: number;
    meta: string[]; // is this right?
    modified: string; // Date?
    modified_gmt: string; // Date?
    parent: number; // not in IPost...
    ping_status: 'open' | 'closed'; // TODO: add the rest
    slug: string;
    status: 'open' | 'closed' | 'publish'; // ??? TODO: add the rest
    template: string;
    title: IWpContent;
    type: 'post' | 'page'; // TODO: add the rest
    _links: {
        about: IWpLinkHref[];
        author: IWpLinkHrefEmbeddable[];
        collection: IWpLinkHref[];
        curies: IWpCurie[];
        replies: IWpLinkHrefEmbeddable[];
        self: IWpLinkHref[];
        'version-history': IWpLinkHref[];
        'wp:attachment': IWpLinkHref[];
    };
}

export interface IWpPost extends IWpPage {
    categories: number[];
    format: 'standard' | 'link' | 'video' | 'aside' | 'audio' | 'chat' | 'gallery' | 'image' | 'quote' | 'status';
    parent: undefined; // to negate the parent in IPage?
    sticky: boolean;
    tags: number[];
    _links: {
        about: IWpLinkHref[];
        author: IWpLinkHrefEmbeddable[];
        collection: IWpLinkHref[];
        curies: IWpCurie[];
        replies: IWpLinkHrefEmbeddable[];
        self: IWpLinkHref[];
        'version-history': IWpLinkHref[];
        'wp:attachment': IWpLinkHref[];
        'wp:featuredmedia': IWpLinkHrefEmbeddable[];
        'wp:term': {
            embeddable: boolean;
            href: string;
            taxonomy: 'category' | 'post_tag'; // TODO: add the rest
        }[];
    };
}

export interface IWpTaxonomy { // IWpCategory & IWpTag
    count: number;
    description: string;
    id: number;
    link: string;
    meta: string[]; // ???
    name: string;
    parent: number;
    slug: string;
    taxonomy: 'category' | 'post_tag'; // ???
    _links: {
        about: IWpLinkHref[];
        collection: IWpLinkHref[];
        curies: IWpCurie[];
        self: IWpLinkHref[];
        'wp:post_type': IWpLinkHref[];
    };
}

export interface IWpUser {
    avatar_urls: {
        24: string;
        48: string;
        96: string;
    };
    description: string;
    id: number;
    link: string;
    meta: string[];
    name: string;
    slug: string;
    url: string;
    _links: {
        collection: IWpLinkHref[];
        self: IWpLinkHref[];
    };
}

interface IWpContent {
    rendered: string;
}

interface IWpContentProtected extends IWpContent {
    protected: boolean;
}

interface IWpLinkHref {
    href: string;
}

interface IWpLinkHrefEmbeddable extends IWpLinkHref {
    embeddable: boolean;
}

interface IWpCurie {
    href: string;
    name: string;
    templated: boolean;
}
