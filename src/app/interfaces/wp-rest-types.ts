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


export interface IPage {
    author: number;
    comment_status: 'open' | 'closed'; // TODO: add the rest
    content: IProtectedContent;
    date: string;
    date_gmt: string;
    excerpt: IProtectedContent;
    featured_media: number;
    guid: IContent;
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
    title: IContent;
    type: 'post' | 'page'; // TODO: add the rest
    _links: {
        about: ILinkHref[];
        author: ILinkHrefEmbeddable[];
        collection: ILinkHref[];
        curies: ICurie[];
        replies: ILinkHrefEmbeddable[];
        self: ILinkHref[];
        'version-history': ILinkHref[];
        'wp:attachment': ILinkHref[];
    };
}

export interface IPost extends IPage {
    categories: number[];
    format: 'standard' | 'link' | 'video' | 'aside' | 'audio' | 'chat' | 'gallery' | 'image' | 'quote' | 'status';
    ping_status: 'open' | 'closed'; // TODO: add the rest
    sticky: boolean;
    tags: number[];
    _links: {
        about: ILinkHref[];
        author: ILinkHrefEmbeddable[];
        collection: ILinkHref[];
        curies: ICurie[];
        replies: ILinkHrefEmbeddable[];
        self: ILinkHref[];
        'version-history': ILinkHref[];
        'wp:attachment': ILinkHref[];
        'wp:featuredmedia': ILinkHrefEmbeddable[];
        'wp:term': {
            embeddable: boolean;
            href: string;
            taxonomy: 'category' | 'post_tag'; // TODO: add the rest
        }[];
    };
}

export interface ITaxonomy { // ICategory & ITag
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
        about: ILinkHref[];
        collection: ILinkHref[];
        curies: ICurie[];
        self: ILinkHref[];
        'wp:post_type': ILinkHref[];
    };
}

export interface IUser {
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
        collection: ILinkHref[];
        self: ILinkHref[];
    };
}

interface ILinkHref {
    href: string;
}

interface ILinkHrefEmbeddable extends ILinkHref {
    embeddable: boolean;
}

interface ICurie {
    href: string;
    name: string;
    templated: boolean;
}
