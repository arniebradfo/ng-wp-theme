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

export interface IWpId {
    id: number;
}

export interface IWpPage extends IWpId {
    author: number;
    comment_status: 'open' | 'closed'; // TODO: add the rest
    content: IWpContentProtected;
    date: string;
    date_gmt: string;
    excerpt: IWpContentProtected;
    featured_media: number;
    guid: IWpContent;
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

export interface IWpTaxonomy extends IWpId { // IWpCategory & IWpTag
    count: number;
    description: string;
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

export interface IWpUser extends IWpId {
    avatar_urls: IWpAvatarUrls;
    description: string;
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

export interface IWpComment extends IWpId {
    author: number;
    author_avatar_urls: IWpAvatarUrls;
    author_name: string;
    author_url: string;
    content: IWpContent;
    date: string;
    date_gmt: string;
    link: string;
    meta: string[];
    parent: number;
    post: number;
    status: 'approved' | 'pending';
    type: 'comment';
    _links: {
        author: IWpLinkHrefEmbeddable[];
        collection: IWpLinkHref[];
        self: IWpLinkHref[];
        up: {
            embeddable: boolean;
            href: string;
            post_type: 'post' | 'page'
        }[];
    };
    children?: IWpComment[];
}

export interface IWpOptions {
    discussion: {
        require_name_email: boolean;
        thread_comments: boolean;
        thread_comments_depth: number;
        show_avatars: boolean;
        avatar_default: 'mystery'|'blank'|'gravatar_default'|'identicon'|'wavatar'|'monsterid'|'retro';
        page_comments: boolean;
        comments_per_page: number;
        default_comments_page: 'newest'|string;
        comment_order: 'desc'|'asc';
    };
    general: {
        admin_email: string;
        blogdescription: string;
        blogname: string;
        comment_registration: boolean;
        date_format: string;
        home: string;
        siteurl: string;
        start_of_week: Week;
        time_format: string;
        users_can_register: boolean;
    };
    permalinks: {
        permalink_structure: string;
        category_base: string;
        tag_base: string;
    };
    reading: {
        page_on_front: number;
        page_for_posts: number;
        posts_per_page: number;
        show_on_front: 'posts' | 'page';
        sticky_posts: number[];
    };
    widgets: {
        sidebars_widgets: {
            wp_inactive_widgets: string[];
            array_version: number;
        };
        widget_categories: {
            [id: number]: {
                title: string;
                count: number;
                hierarchical: number;
                dropdown: number;
            };
            _multiwidget: number;
        };
    };
}

interface IWpAvatarUrls {
    24: string;
    48: string;
    96: string;
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

export enum Week {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}
