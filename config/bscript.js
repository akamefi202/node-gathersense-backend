const bscript = require('bscript')
const render = require('bscript-render')
const blessed = require('blessed')
 
const screen = blessed.screen({
  title: 'example'
})
 
screen.on('keypress', (ch, key) => {
  if (['escape', 'q', 'C-c'].includes(key.full)) {
    process.exit(0)
  }
})
 
render(bscript('text', 'Hello World'), screen)