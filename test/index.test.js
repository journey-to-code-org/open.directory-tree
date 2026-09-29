import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { directoryTree, flattenTree } from "../src/index.js";

test("builds tree",async()=>{const root=await mkdtemp(path.join(tmpdir(),"tree-"));try{await mkdir(path.join(root,"a"));await writeFile(path.join(root,"a","x.txt"),"x");const tree=await directoryTree(root);assert.equal(flattenTree(tree).some(n=>n.name==="x.txt"),true);}finally{await rm(root,{recursive:true,force:true});}});
test("ignores names",async()=>{const root=await mkdtemp(path.join(tmpdir(),"tree-"));try{await mkdir(path.join(root,"node_modules"));const tree=await directoryTree(root,{ignore:["node_modules"]});assert.equal(tree.children.length,0);}finally{await rm(root,{recursive:true,force:true});}});
