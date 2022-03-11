let editorOut = ace.edit("editorOut")
let editorX = ace.edit("editorX")
let editorY = ace.edit("editorY")

initEditors()

editorX.getSession().on('change', changed)
editorY.getSession().on('change', changed)

document.getElementById("editorY").focus()

function changed(e) {
  let tokensTemp
  let numericValuesX = []
  let numericValuesY = []

  let inputStringX = editorX.getValue()
  let inputStringY = editorY.getValue()
  
  tokensTemp = inputStringX.split(/[^0-9-.]/)

  tokensTemp.forEach(v => {
    let maybeNum = parseFloat(v)
    if(!isNaN(maybeNum)){
      numericValuesX.push(maybeNum)
    }
  })

  tokensTemp = inputStringY.split(/[^0-9.]/)

  tokensTemp.forEach(v => {
    let maybeNum = parseFloat(v)
    if(!isNaN(maybeNum)){
      numericValuesY.push(maybeNum)
    }
  })

  let outputString = ''
  outputString += "number of x values : " + numericValuesX.length + '\n'
  outputString += "number of y values : " + numericValuesY.length

  editorOut.setValue(outputString)
  editorOut.getSession().selection.clearSelection();

  globalData[0] = {}

  if(numericValuesX.length != 0){
    globalData[0].x = numericValuesX
  }

  globalData[0].y = numericValuesY
  Plotly.redraw(plot) 
}

function initEditors(){
    editorX.setTheme("ace/theme/clouds")
    editorX.session.setMode("ace/mode/c_cpp")
    editorX.setShowPrintMargin(false)

    editorY.setTheme("ace/theme/clouds")
    editorY.session.setMode("ace/mode/c_cpp")
    editorY.setShowPrintMargin(false)

    editorOut.setTheme("ace/theme/dawn")
    editorOut.session.setMode("ace/mode/c_cpp")
    editorOut.setShowPrintMargin(false)
    editorOut.renderer.$cursorLayer.element.style.display = "none"
    editorOut.setOptions({
      readOnly: true,
      highlightActiveLine: false,
      highlightGutterLine: false
    })

    editorX.setAutoScrollEditorIntoView(true)
    editorY.setAutoScrollEditorIntoView(true)
    editorOut.setAutoScrollEditorIntoView(true)

    editorX.setOptions({
      vScrollBarAlwaysVisible: true,
      hScrollBarAlwaysVisible: true,
    })

    editorY.setOptions({
      vScrollBarAlwaysVisible: true,
      hScrollBarAlwaysVisible: true,
    })

    editorOut.setOptions({
      vScrollBarAlwaysVisible: true,
      hScrollBarAlwaysVisible: true,
    })

    editorX.session.setOptions({
      tabSize: 4,
      useSoftTabs: false,
    })
    
    editorY.session.setOptions({
      tabSize: 4,
      useSoftTabs: false,
    })

    editorOut.session.setOptions({
      tabSize: 4,
      useSoftTabs: false,
    })

    editorX.setValue('1, 2, 3, 4, 5')
    editorY.setValue('2, 4, 8, 16, 32')

    changed()

    editorX.execCommand("gotolineend")
    editorY.execCommand("gotolineend")

    editorY.focus()
}