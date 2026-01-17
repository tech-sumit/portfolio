#!/usr/bin/env node

/**
 * Fetch Twitter/X Thread Script
 * 
 * Usage: node scripts/fetch-twitter-thread.js <tweet_url>
 * Example: node scripts/fetch-twitter-thread.js https://x.com/bcherny/status/2007179832300581177
 * 
 * This script fetches a Twitter thread and outputs individual tweet URLs
 * that can be used for embedding in blog posts.
 */

const https = require('https');
const http = require('http');

// Extract tweet ID and username from URL
function parseTweetUrl(url) {
  const match = url.match(/(?:twitter\.com|x\.com)\/(\w+)\/status\/(\d+)/);
  if (!match) {
    throw new Error('Invalid Twitter/X URL format');
  }
  return {
    username: match[1],
    tweetId: match[2]
  };
}

// Fetch page content
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    };

    client.get(url, options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Try to fetch thread data using threadreaderapp or similar
async function fetchThreadData(username, tweetId) {
  console.log(`\n📦 Fetching thread for @${username}/status/${tweetId}...\n`);
  
  // Try twitter-thread.com API (unroll service)
  try {
    const unrollUrl = `https://twitter-thread.com/t/${tweetId}`;
    console.log(`Trying: ${unrollUrl}`);
    const html = await fetchUrl(unrollUrl);
    
    // Extract tweet IDs from the page
    const tweetIdMatches = html.match(/status\/(\d{15,})/g);
    if (tweetIdMatches) {
      const uniqueIds = [...new Set(tweetIdMatches.map(m => m.replace('status/', '')))];
      return uniqueIds;
    }
  } catch (e) {
    console.log('Thread unroll service not available');
  }

  // Fallback: return just the main tweet
  return [tweetId];
}

// Generate embed code for a tweet
function generateEmbed(username, tweetId, index) {
  return {
    index,
    tweetId,
    url: `https://twitter.com/${username}/status/${tweetId}`,
    embed: `<blockquote class="twitter-tweet"><a href="https://twitter.com/${username}/status/${tweetId}"></a></blockquote>`
  };
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
📌 Twitter/X Thread Fetcher

Usage: node scripts/fetch-twitter-thread.js <tweet_url>

Example:
  node scripts/fetch-twitter-thread.js https://x.com/bcherny/status/2007179832300581177

Output:
  - List of individual tweet URLs in the thread
  - Embed codes ready for markdown
`);
    process.exit(1);
  }

  const tweetUrl = args[0];
  
  try {
    const { username, tweetId } = parseTweetUrl(tweetUrl);
    console.log(`\n🔍 Parsed URL:`);
    console.log(`   Username: @${username}`);
    console.log(`   Tweet ID: ${tweetId}`);
    
    const tweetIds = await fetchThreadData(username, tweetId);
    
    console.log(`\n✅ Found ${tweetIds.length} tweets in thread:\n`);
    console.log('─'.repeat(60));
    
    tweetIds.forEach((id, index) => {
      const embed = generateEmbed(username, id, index + 1);
      console.log(`\n📝 Tweet ${embed.index}:`);
      console.log(`   URL: ${embed.url}`);
      console.log(`   Embed:`);
      console.log(`   ${embed.embed}`);
    });
    
    console.log('\n' + '─'.repeat(60));
    console.log('\n📋 Quick Copy - All Embeds:\n');
    
    tweetIds.forEach((id, index) => {
      console.log(`<!-- Tweet ${index + 1} -->`);
      console.log(`<blockquote class="twitter-tweet"><a href="https://twitter.com/${username}/status/${id}"></a></blockquote>\n`);
    });
    
    console.log('\n✨ Done! Copy the embed codes above into your markdown file.');
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
