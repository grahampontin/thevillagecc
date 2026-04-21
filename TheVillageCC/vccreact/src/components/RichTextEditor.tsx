import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const ToolbarButton: React.FC<{
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}> = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onMouseDown={e => { e.preventDefault(); onClick(); }}
    title={title}
    className={`px-1.5 py-0.5 rounded text-sm font-medium transition ${
      active
        ? 'bg-villageGreen text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing…',
  minHeight = 200,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      const html = editor.getHTML();
      // Treat empty paragraph as empty string
      onChange(html === '<p></p>' ? '' : html);
    },
  });

  // Sync external value changes (e.g. when modal opens with existing data)
  React.useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    const incoming = value || '';
    if (currentHtml !== incoming && (incoming !== '' || currentHtml !== '<p></p>')) {
      editor.commands.setContent(incoming);
    }
    // We only want to run this when `value` changes from outside
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-villageGreen">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1 border-b border-gray-200 bg-gray-50">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <s>S</s>
        </ToolbarButton>

        <span className="mx-1 text-gray-300">|</span>

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          H2
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          H3
        </ToolbarButton>

        <span className="mx-1 text-gray-300">|</span>

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          ≡
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          1.
        </ToolbarButton>

        <span className="mx-1 text-gray-300">|</span>

        <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Link">
          🔗
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear formatting">
          ✕
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div
        className="relative px-3 py-2 text-sm text-gray-900 bg-white"
        style={{ minHeight }}
        onClick={() => editor.commands.focus()}
      >
        {editor.isEmpty && (
          <span className="absolute top-2 left-3 text-gray-400 pointer-events-none select-none text-sm">
            {placeholder}
          </span>
        )}
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[150px]"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;

