import { useState, useEffect } from 'react'
import { Editor as TinymceEditor, IAllProps } from '@tinymce/tinymce-react'
import { tinymceApiKey, tinymceContentStyle, tinymcePlugins, tinymceToolbars } from './constants'
import Spinner from '../spinner'
import { Box, Skeleton } from '@mui/material'

export type EditorProps = {
  isShowMaxLimit?: boolean
  maxLimit?: number
  isDisabled?: boolean
  value?: string
  initialValue?: string
  onBeforeAdd?: IAllProps['onBeforeAddUndo']
  onChange: (content: string) => void
}

export const Editor = ({
  onChange,
  value,
  initialValue,
  onBeforeAdd,
  isShowMaxLimit,
  maxLimit,
  isDisabled
}: EditorProps) => {
  const [editorContentLength, setEditorContentLength] = useState(0)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isExceedingLimit, setExceedingLimit] = useState(false)

  const handleEditorChange = (content: string) => {
    if (maxLimit && content.length > maxLimit) {
      setExceedingLimit(true)
    } else {
      setExceedingLimit(false)
    }

    onChange(content)
    setEditorContentLength(content?.length)
  }

  const handleEditorBeforeAdd: IAllProps['onBeforeAddUndo'] = (editor: any, evt: any) => {
    onBeforeAdd?.(editor, evt)
    const contentLength = editor.target.getContent({ format: 'text' }).length

    setEditorContentLength(contentLength)
  }

  const handleEditorMount = () => {
    setLoading(false)
  }

  useEffect(() => {
    if (value) {
      setEditorContentLength(value.length)
    }
  }, [value])

  return (
    <>
      {isLoading && (
        <Box sx={{ width: '100%' }}>
          <Skeleton variant='rectangular' height={300} animation='wave' style={{ borderRadius: 1 }} />
        </Box>
      )}

      <TinymceEditor
        onEditorChange={handleEditorChange}
        onBeforeAddUndo={handleEditorBeforeAdd}
        value={value}
        apiKey={tinymceApiKey}
        initialValue={initialValue}
        onInit={handleEditorMount}
        disabled={isDisabled}
        init={{
          height: 400,
          plugins: tinymcePlugins,
          toolbar: tinymceToolbars,
          branding: false,
          image_advtab: true,
          file_picker_types: 'image',
          quickbars_selection_toolbar:
            'bold italic underline strikethrough | alignleft aligncenter alignright | formatselect fontselect fontsizeselect | forecolor backcolor | link | bullist numlist | blockquote',
          quickbars_insert_toolbar: false,
          quickbars_image_toolbar: 'alignleft aligncenter alignright | image',
          content_style: tinymceContentStyle,
          contextmenu_never_use_native: true,
          contextmenu: false,
          autosave_ask_before_unload: false,
          autosave_interval: '10s',
          autosave_retention: '10m'
        }}
      />

      {!isLoading && isShowMaxLimit && (
        <p style={{ textAlign: 'right', color: isExceedingLimit ? 'red' : 'inherit' }}>
          {editorContentLength} / {maxLimit}
        </p>
      )}
    </>
  )
}
