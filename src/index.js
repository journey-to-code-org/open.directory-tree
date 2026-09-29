import { readdir, stat } from "node:fs/promises";
import path from "node:path";

export async function directoryTree(root, options = {}) {
  if (typeof root !== "string") throw new TypeError("Expected root to be a string");
  const maxDepth = options.depth ?? Infinity;
  const ignore = new Set(options.ignore ?? []);
  const followSymlinks = options.followSymlinks ?? false;

  async function walk(target, depth) {
    const info = await stat(target);
    const node = {
      name: path.basename(target),
      path: target,
      type: info.isDirectory() ? "directory" : "file"
    };

    if (!info.isDirectory() || depth >= maxDepth) return node;

    const names = (await readdir(target,{withFileTypes:true}))
      .filter((entry) => !ignore.has(entry.name))
      .sort((a,b)=>a.name.localeCompare(b.name));

    node.children = [];
    for (const entry of names) {
      if (entry.isSymbolicLink() && !followSymlinks) continue;
      node.children.push(await walk(path.join(target,entry.name),depth+1));
    }
    return node;
  }

  return walk(path.resolve(root),0);
}

export function flattenTree(tree) {
  const out=[];
  const walk=(node)=>{out.push(node);for(const child of node.children??[])walk(child);};
  walk(tree);
  return out;
}
