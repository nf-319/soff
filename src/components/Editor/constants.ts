export const tinymcePlugins = [
  'advlist',
  'autolink',
  'lists',
  'link',
  'image',
  'charmap',
  'preview',
  'anchor',
  'searchreplace',
  'visualblocks',
  'code',
  'fullscreen',
  'insertdatetime',
  'media',
  'table',
  'wordcount',
  'quickbars',
]

export const tinymceToolbars = `undo redo | styles | bold italic
 | fontselect fontsizeselect formatselect | h1 h2 h3 | fontsize fontfamily
 | alignleft aligncenter alignright alignjustify |
  bullist numlist outdent indent | link | forecolor backcolor | removeformat | alignjustify | outdent indent`

export const tinymceApiKey = process.env.NEXT_PUBLIC_TINYMCE_KEY

export const tinymceContentStyle = 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
