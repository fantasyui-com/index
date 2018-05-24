#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const request = require('request');
const kebab = require('lodash.kebabcase');

const program = {
  repos: `https://api.github.com/users/fantasyui-com/repos?page=1&per_page=100`
};

const head = `# Index Of fantasyui-com Repositories
`;
const complete = [];
const categories = {};

request({url: program.repos, headers: {'User-Agent': 'Mozilla/3.0 (compatible; MSIE 3.0; Windows NT 5.0)' }}, function (error, response, body) {
  //console.log('error:', error); // Print the error if one occurred
  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.
  if (!error && response.statusCode == 200) {
    // const repos = JSON.parse(fs.readFileSync('repos.json'));
    fs.writeFileSync(__dirname+path.sep+'repos.json',body);
    const data = JSON.parse(body);
    const tidy = data.map(normalizeEntries).forEach(categorize);
    report();
  }
});

function report(){
  console.log(head);

  console.log(`## Table of Contents`)
  Object.keys(categories).sort().forEach(function(category){
    console.log(`- [${category}](#${kebab(category)})`)
  });
  console.log(`- [Index](#${kebab('Index')})`)
  console.log('');

  Object.keys(categories).sort().forEach(function(category){
    let list = categories[category]
    console.log(`## ${category}`)
    list.sort().forEach(function(link){
      console.log(`- ${link}`)
    })
    console.log('')
  });

  console.log(`## Index`);
  complete.sort().forEach(function(link){
    console.log(`- ${link}`)
  });
  console.log('')

}

function normalizeEntries({name,description}){
  let url = `https://github.com/fantasyui-com/${name}`;
  let tags = [];
  let matches = description.match(/\[([A-Za-z ,]+)\]/);
  if(matches){
    tags = tags.concat(matches[1].split(',').map(i=>i.trim()));
  }
  description = description.replace(/\[[A-Za-z ,]+\]/g,'');
  let md = `[${name}](${url}) - ${description}`;
  return {name,tags,md,description,url}
}

function categorize({tags,md}){
  complete.push(md);
  tags.forEach(function(tag){
    if(!categories[tag]) categories[tag] = [];
    categories[tag].push(md)
  });
}
