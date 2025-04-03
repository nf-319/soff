'use client'
import React, { useState } from 'react'
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react'
import { Box, Button } from '@mui/material'

const CustomEditorr = () => {
  const [editorData, setEditorData] = useState('<p>Hello world!</p>')

  const cloud = useCKEditorCloud({
    version: '44.3.0',
    premium: true
  })

  if (cloud.status === 'error') {
    return <div>Error!</div>
  }

  if (cloud.status === 'loading') {
    return <div>Loading...</div>
  }

  const {
    ClassicEditor,
    Alignment,
    Autoformat,
    Autosave,
    BlockQuote,
    Bold,
    CloudServices,
    Code,
    CodeBlock,
    Essentials,
    FindAndReplace,
    Font,
    Heading,
    Highlight,
    HorizontalLine,
    HtmlEmbed,
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    Italic,
    Link,
    List,
    MediaEmbed,
    Mention,
    PageBreak,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    SelectAll,
    SpecialCharacters,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
    WordCount
  } = cloud.CKEditor

  return (
    <div className='p-4'>
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={(event, editor) => {
          const data = editor.getData()
          setEditorData(data)
        }}
        config={{
          licenseKey:
            'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDQ4NDc5OTksImp0aSI6ImJkZWNjOWQwLWRlMDAtNDMzYy1hYTc1LTMyZjNjNjBlMGViYiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImE2NDQ3MzFiIn0.jECpsHIjqFOGYlMuWKp0KLg9y1snnjNnMzOOEDE45qOXkXYwfjjvgUbxd3Efn2PSoVyDEVuA2hcXpezfCNJOyQ',
          plugins: [
            Alignment,
            Autoformat,
            Autosave,
            BlockQuote,
            Bold,
            CloudServices,
            Code,
            CodeBlock,
            Essentials,
            FindAndReplace,
            Font,
            Heading,
            Highlight,
            HorizontalLine,
            HtmlEmbed,
            Image,
            ImageCaption,
            ImageResize,
            ImageStyle,
            ImageToolbar,
            ImageUpload,
            Indent,
            Italic,
            Link,
            List,
            MediaEmbed,
            Mention,
            PageBreak,
            Paragraph,
            PasteFromOffice,
            RemoveFormat,
            SelectAll,
            SpecialCharacters,
            Strikethrough,
            Subscript,
            Superscript,
            Table,
            TableToolbar,
            TextTransformation,
            TodoList,
            Underline,
            WordCount
          ],
          toolbar: {
            items: [
              'undo',
              'redo',
              '|',
              'exportPdf',
              'exportWord',
              '|',
              'findAndReplace',
              'selectAll',
              '|',
              'heading',
              '|',
              'fontfamily',
              'fontsize',
              'fontColor',
              'fontBackgroundColor',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'subscript',
              'superscript',
              'highlight',
              '|',
              'link',
              'uploadImage',
              'insertTable',
              'mediaEmbed',
              'htmlEmbed',
              '|',
              'bulletedList',
              'numberedList',
              'todoList',
              '|',
              'outdent',
              'indent',
              '|',
              'blockQuote',
              'code',
              'codeBlock',
              'pageBreak',
              '|',
              'horizontalLine',
              'specialCharacters',
              'removeFormat',
              'textTransformation',
              '|',
              'alignment:left',
              'alignment:center',
              'alignment:right',
              'alignment:justify',
              '|',
              'wordCount'
            ],
            shouldNotGroupWhenFull: false
          },
          image: {
            toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative']
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
          },
          mediaEmbed: {
            previewsInData: true
          },
          simpleUpload: {
            uploadUrl: 'https://your-server.com/upload',
            headers: {
              Authorization: 'Bearer YOUR_TOKEN'
            }
          }
        }}
      />

      <Box display={'flex'} justifyContent={'end'} marginTop={2}>
        <Button variant='contained' onClick={() => console.log(editorData)}>
          Xabarnomani jo'natish
        </Button>
      </Box>
    </div>
  )
}

export default CustomEditorr
