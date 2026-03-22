import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), '/content');

export async function getAllTechMetadata() {
  const files = fs.readdirSync(contentDirectory);
  
  return files.map((fileName) => {
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    return {
      id: data.id,
      name: data.name,
      fileName: fileName
    };
  });
}

export async function getTechContent(id: string) {
  const files = fs.readdirSync(contentDirectory);
  const targetFile = files.find(file => {
    const content = fs.readFileSync(path.join(contentDirectory, file), 'utf8');
    return matter(content).data.id === id;
  });

  if (!targetFile) return null;

  const fileContents = fs.readFileSync(path.join(contentDirectory, targetFile), 'utf8');
  const { data, content } = matter(fileContents);

  return { meta: data, content };
}