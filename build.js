const fs = require('fs');

url = `https://api.github.com/users/fantasyui-com/repos?page=1&per_page=100`

const repos = JSON.parse(fs.readFileSync('repos.json'));

const categories = {};

const result = repos
  .map(normalizeEntries)
  .forEach(categorize);

  Object.keys(categories).forEach(function(category){
    let list = categories[category]
    console.log(`## ${category}`)
    list.forEach(function(link){
      console.log(`- ${link}`)
    })
    console.log('')

  })

function normalizeEntries({name,description,url}){

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

  tags.forEach(function(tag){
    if(!categories[tag]) categories[tag] = [];
    categories[tag].push(md)
  })

}
