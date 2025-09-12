#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles');
const indexPath = path.join(articlesDir, 'index.json');

function extractFrontMatter(content) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    return null;
  }

  const frontMatterText = match[1];
  const body = match[2];
  
  const frontMatter = {};
  const lines = frontMatterText.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex !== -1) {
        const key = trimmedLine.substring(0, colonIndex).trim();
        let value = trimmedLine.substring(colonIndex + 1).trim();
        
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        frontMatter[key] = value;
      }
    }
  }
  
  return { frontMatter, body };
}

function generateExcerpt(body, maxLength = 150) {
  const plainText = body
    .replace(/#{1,6}\s+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/!\[.*?\]\([^)]+\)/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
}

function generateArticlesIndex() {
  try {
    const files = fs.readdirSync(articlesDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    const articles = [];
    
    for (const file of mdFiles) {
      const filePath = path.join(articlesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const result = extractFrontMatter(content);
      if (!result) continue;
      
      const { frontMatter, body } = result;
      
      const slug = file.replace('.md', '');
      
      const tags = frontMatter.tags 
        ? frontMatter.tags.split(/[،,]/).map(tag => tag.trim()).filter(tag => tag)
        : [];
      
      const article = {
        slug,
        title: frontMatter.title || slug,
        excerpt: frontMatter.excerpt || generateExcerpt(body),
        date: frontMatter.date || new Date().toISOString().split('T')[0],
        author: frontMatter.author || 'ناشناس',
        tags
      };
      
      articles.push(article);
    }
    
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    fs.writeFileSync(indexPath, JSON.stringify(articles, null, 2), 'utf-8');
    
    console.log(`✅ Generated articles index with ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error('❌ Error generating articles index:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateArticlesIndex();
}

export default generateArticlesIndex;