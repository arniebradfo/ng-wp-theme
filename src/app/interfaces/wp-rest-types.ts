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
}
