import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  editor: Editor;
}

export const buildEditor = (content: string, handleChange: (value: string) => void) => {
  const editor = useEditor({
    extensions: [
      StarterKit
    ],
    content,
    onUpdate({editor}) {
      const updatedContent = editor.getHTML();
      handleChange(updatedContent);
    },
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
    },
  }, [content]);

  return editor;
}

function TextEditor ({ editor }: Props) {
  return (
    <div>
      <div>
        <p className="update-form-description dark-purple">&#9432; Highlight text to see formatting options.</p>
      </div>
      {editor && 
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="bubble-menu">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={editor.isActive('bold') ? 'is-active text-editor-menu-btn' : 'text-editor-menu-btn'}
          >
            <b>Bold</b>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={editor.isActive('italic') ? 'is-active text-editor-menu-btn' : 'text-editor-menu-btn'}
          >
            <i>Italic</i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={editor.isActive('heading', { level: 4 }) ? 'is-active text-editor-menu-btn' : 'text-editor-menu-btn'}
          >
            <b>Header</b>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active text-editor-menu-btn' : 'text-editor-menu-btn'}
          >
            <ul className="text-editor-menu-list"><li>List</li></ul>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'is-active text-editor-menu-btn' : 'text-editor-menu-btn'}
          >
            <ol className="text-editor-menu-list"><li>List</li></ol>
          </button>
        </div>
      </BubbleMenu>
      }
      <EditorContent editor={editor} />
    </div>
  )
}

export default TextEditor;