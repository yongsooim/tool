let editorOut = ace.edit("editorOut")
let editor = ace.edit("editor")

initEditors()

editor.getSession().on('change', changed)
document.getElementById("editor").focus()

function changed(e) {
  let inputString = editor.getValue()
  let tokens = inputString.split(/[^0-9.]/)
  let numericValues = []

  tokens.forEach(v => {
    let maybeNum = parseFloat(v)
    if(!isNaN(maybeNum)){
      numericValues.push(maybeNum)
    }
  })

  console.log(numericValues)

  let outputString = "number of values : " + numericValues.length

  editorOut.setValue(outputString)

  globalData[0].y = numericValues
  Plotly.redraw(plot) 
}


function initEditors(){
    editor.setTheme("ace/theme/clouds")
    editor.session.setMode("ace/mode/c_cpp")
    editor.setShowPrintMargin(false)

    editorOut.setTheme("ace/theme/dawn")
    editorOut.session.setMode("ace/mode/c_cpp")
    editorOut.setShowPrintMargin(false)
    editorOut.renderer.$cursorLayer.element.style.display = "none"
    editorOut.setOptions({
      readOnly: true,
      highlightActiveLine: false,
      highlightGutterLine: false
    })
    editorOut.setOption("highlightActiveLine", true)

    editor.setAutoScrollEditorIntoView(true)
    editorOut.setAutoScrollEditorIntoView(true)

    editor.setOptions({
      vScrollBarAlwaysVisible: true,
      hScrollBarAlwaysVisible: true,
    })

    editorOut.setOptions({
      vScrollBarAlwaysVisible: true,
      hScrollBarAlwaysVisible: true,

    })

    editor.session.setOptions({
      tabSize: 4,
      useSoftTabs: false,
    })
    editorOut.session.setOptions({
      tabSize: 4,
      useSoftTabs: false,
    })

    editor.focus()
}