const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
          filelist = walkSync(path.join(dir, file), filelist);
      }
    }
    else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, '../client'));

let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    if (content.includes('#FFF8F3')) {
        content = content.replace(/#FFF8F3/g, '#ECDFD7');
        fs.writeFileSync(file, content, 'utf-8');
        count++;
        console.log('Replaced in ' + file);
    }
});

console.log('Done! Replaced in ' + count + ' files.');
