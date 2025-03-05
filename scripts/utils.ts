import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import * as path from 'node:path'


export function copyFile(sourceFile:string, targetDir:string) {
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, path.basename(sourceFile));
  copyFileSync(sourceFile, targetFile);
  console.log(`Copied: ${sourceFile} -> ${targetFile}`);
}
