export interface DirectoryTreeNode { name:string;path:string;type:"file"|"directory";children?:DirectoryTreeNode[]; }
export function directoryTree(root:string,options?:{depth?:number;ignore?:string[];followSymlinks?:boolean}):Promise<DirectoryTreeNode>;
export function flattenTree(tree:DirectoryTreeNode):DirectoryTreeNode[];

