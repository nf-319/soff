// components/custom-editor.js
'use client' // Required only in App Router.

import React from 'react'
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react'
import Image from '@ckeditor/ckeditor5-image/src/image'; // Import the Image plugin

const CustomEditorr = () => {
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

  const { ClassicEditor, Essentials, Paragraph, Bold, Italic } = cloud.CKEditor

  const { FormatPainter } = cloud.CKEditorPremiumFeatures

  return (
    <CKEditor
      editor={ClassicEditor}
      data={'<p>Hello world!</p>'}
      config={{
        licenseKey:
          'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDQ4NDc5OTksImp0aSI6ImJkZWNjOWQwLWRlMDAtNDMzYy1hYTc1LTMyZjNjNjBlMGViYiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImE2NDQ3MzFiIn0.jECpsHIjqFOGYlMuWKp0KLg9y1snnjNnMzOOEDE45qOXkXYwfjjvgUbxd3Efn2PSoVyDEVuA2hcXpezfCNJOyQ',
        plugins: [Essentials, Paragraph, Bold, Italic, FormatPainter, Image],
        toolbar: ['undo', 'redo', '|', 'bold', 'italic', '|', 'formatPainter', 'insertTable', '|', 'image']
      }}
    />
  )
}

export default CustomEditorr
