import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownEditor = () => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef(null);

  // Hàm xử lý khi nội dung thay đổi
  const handleContentChange = (e) => {
    setMarkdownContent(e.target.value);
  };

  // Hàm xử lý khi bấm nút Preview
  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  // Hàm để chèn định dạng vào văn bản
  const insertFormat = (format) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdownContent.substring(start, end);
    
    let formattedText = '';
    let cursorPosition = 0;
    
    switch(format) {
      case 'bold':
        formattedText = `**${selectedText || 'văn bản in đậm'}**`;
        cursorPosition = selectedText ? 2 : 14;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'văn bản in nghiêng'}*`;
        cursorPosition = selectedText ? 1 : 18;
        break;
      case 'heading':
        formattedText = `# ${selectedText || 'Tiêu đề'}`;
        cursorPosition = selectedText ? 2 : 8;
        break;
      case 'link':
        formattedText = `[${selectedText || 'Liên kết'}](url)`;
        cursorPosition = selectedText ? 3 + selectedText.length : 11;
        break;
      case 'image':
        formattedText = `![${selectedText || 'Mô tả ảnh'}](url)`;
        cursorPosition = selectedText ? 4 + selectedText.length : 14;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || 'Danh sách mục'}\n- Mục tiếp theo\n`;
        cursorPosition = selectedText ? 3 : 14;
        break;
      case 'code':
        formattedText = `\`\`\`\n${selectedText || 'mã nguồn của bạn'}\n\`\`\``;
        cursorPosition = selectedText ? 4 : 17;
        break;
      case 'quote':
        formattedText = `> ${selectedText || 'Trích dẫn'}`;
        cursorPosition = selectedText ? 2 : 10;
        break;
      default:
        return;
    }
    
    const newContent = 
      markdownContent.substring(0, start) + 
      formattedText + 
      markdownContent.substring(end);
    
    setMarkdownContent(newContent);
    
    // Đặt lại vị trí con trỏ
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
      } else {
        textarea.setSelectionRange(start + cursorPosition, start + cursorPosition);
      }
    }, 0);
  };

  return (
    <div className="markdown-editor">
      <div className="toolbar">
        <button onClick={() => insertFormat('bold')} title="In đậm">B</button>
        <button onClick={() => insertFormat('italic')} title="In nghiêng">I</button>
        <button onClick={() => insertFormat('heading')} title="Tiêu đề">H</button>
        <button onClick={() => insertFormat('link')} title="Liên kết">🔗</button>
        <button onClick={() => insertFormat('image')} title="Hình ảnh">🖼️</button>
        <button onClick={() => insertFormat('list')} title="Danh sách">📋</button>
        <button onClick={() => insertFormat('code')} title="Mã nguồn">💻</button>
        <button onClick={() => insertFormat('quote')} title="Trích dẫn">❝</button>
        <button onClick={handlePreview} title="Xem trước">
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>
      
      <div className="editor-container">
        {!showPreview ? (
          <textarea
            ref={textareaRef}
            value={markdownContent}
            onChange={handleContentChange}
            placeholder="Nhập nội dung Markdown ở đây..."
            rows="20"
            className="markdown-input"
          />
        ) : (
          <div className="preview-container">
            <div className="preview-content">
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;