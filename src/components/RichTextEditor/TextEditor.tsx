import React,{useEffect} from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";

import { useQuill } from 'react-quilljs';
import BlotFormatter from 'quill-blot-formatter';
import "react-quill/dist/quill.snow.css";
// import "./styles.css";

export const Editor = ({value, onChange, parentState}:{ value: string;
    onChange: (value: string) => any; parentState?: any;}) => {
// //   const [state, setState] = React.useState({ value: value });
  // const handleChange = onChange
  
  // return (
  //   <div className="text-editor">
  //     <EditorToolbar />
  //     <ReactQuill
  //       theme="snow"
  //       value={value}
  //       onChange={handleChange}
  //       placeholder={"Anything else you want to include"}
  //       modules={modules}
  //       formats={formats}
  //     />
  //   </div>
  // );
//---------------------------------

const { quill, quillRef, Quill } = useQuill({
  modules: { blotFormatter: {} }
});

if (Quill && !quill) {
  // const BlotFormatter = require('quill-blot-formatter');
  Quill.register('modules/blotFormatter', BlotFormatter);
  
}
// if(quill){

//
// }

React.useEffect(() => {
  if (quill) {
    quill.clipboard.dangerouslyPasteHTML('<h1>React Hook for Quill!</h1>');
  }
  console.log("parent state n editor", parentState)
}, [quill]);

useEffect(() => {
  if (quill) {
    quill.on('text-change', (delta, oldContents) => {
      console.log('Text change!');
      console.log(delta);
      console.log('Text change!');
      console.log(quill.getText()); // Get text only
      console.log(quill.getContents()); // Get delta contents
      console.log(quill.root.innerHTML); // Get innerHTML using quill
      console.log(quillRef.current.firstChild.innerHTML);

      let currrentContents = quill.getContents();
      console.log('setting on change content  tto ', JSON.stringify(currrentContents));
      console.log("parent state n editor", parentState)
      onChange(JSON.stringify(currrentContents))

      
      // console.log('current cot string ', currrentContents.toString());
    });
    
  }
  console.log("iis value", value)
  
   
}, [quill, Quill]);

return (
  <div>
  
    <div ref={quillRef}  placeholder={"Anything else you want to include"}/>
  </div>
);


};


export default Editor;
