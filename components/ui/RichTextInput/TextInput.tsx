import React, { useEffect, useRef } from 'react';
import ToolbarPlugin from './ToolbarPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { $generateNodesFromDOM } from '@lexical/html';
import { HeadingNode } from '@lexical/rich-text';
import {
  $createParagraphNode,
  $getRoot,
  $isTextNode,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  isHTMLElement,
  Klass,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
} from 'lexical';
import './richtext-styles.css';
import { ToolbarContext } from './ToolbarContext';
import { SharedHistoryContext } from './SharedHistoryContext';

type Props = {
  initialValue: string;
  onContentChange: (value: string) => void;
};

type InitialContentPluginProps = {
  initialValue: string;
};

type ContentChangePluginProps = {
  onContentChange: (value: string) => void;
};

const MIN_ALLOWED_FONT_SIZE = 8;
const MAX_ALLOWED_FONT_SIZE = 72;

export const parseAllowedFontSize = (input: string): string => {
  const match = input.match(/^(\d+(?:\.\d+)?)px$/);
  if (match) {
    const n = Number(match[1]);
    if (n >= MIN_ALLOWED_FONT_SIZE && n <= MAX_ALLOWED_FONT_SIZE) {
      return input;
    }
  }
  return '';
};

export function parseAllowedColor(input: string) {
  return /^rgb\(\d+, \d+, \d+\)$/.test(input) ? input : '';
}

const removeStylesExportDOM = (editor: LexicalEditor, target: LexicalNode): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    for (const el of [
      output.element,
      ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
    ]) {
      el.removeAttribute('class');
      el.removeAttribute('style');
      if (el.getAttribute('dir') === 'ltr') {
        el.removeAttribute('dir');
      }
    }
  }
  return output;
};

const getExtraStyles = (element: HTMLElement): string => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = '';
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== '' && fontSize !== '15px') {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== '' && color !== 'rgb(0, 0, 0)') {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

const theme: InitialConfigType['theme'] = {
  code: 'editor-code',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
    h6: 'editor-heading-h6',
  },
  image: 'editor-image',
  link: 'editor-link',
  list: {
    listitem: 'editor-listitem',
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
  },
  ltr: 'ltr',
  paragraph: 'editor-paragraph',
  placeholder: 'editor-placeholder',
  quote: 'editor-quote',
  rtl: 'rtl',
  text: {
    bold: 'editor-text-bold',
    code: 'editor-text-code',
    hashtag: 'editor-text-hashtag',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    strikethrough: 'editor-text-strikethrough',
    underline: 'editor-text-underline',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
  },
};

const editorConfig: InitialConfigType = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: 'React.js Demo',
  nodes: [ParagraphNode, TextNode, ListNode, ListItemNode, HeadingNode, LinkNode],
  onError(error: Error) {
    throw error;
  },
  theme: theme,
};

function InitialContentPlugin({ initialValue }: InitialContentPluginProps) {
  const [editor] = useLexicalComposerContext();
  const lastAppliedValue = useRef<string | null>(null);

  useEffect(() => {
    if (lastAppliedValue.current === initialValue) {
      return;
    }

    lastAppliedValue.current = initialValue;
    editor.update(() => {
      const root = $getRoot();
      root.clear();

      if (!initialValue) {
        root.append($createParagraphNode());
        return;
      }

      try {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialValue, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        if (nodes.length === 0) {
          root.append($createParagraphNode());
          return;
        }
        root.append(...nodes);
      } catch {
        root.append($createParagraphNode());
      }
    });
  }, [editor, initialValue]);

  return null;
}

function ContentChangePlugin({ onContentChange }: ContentChangePluginProps) {
  const [editor] = useLexicalComposerContext();
  const lastHtml = useRef<string | null>(null);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      const html = editor.getRootElement()?.innerHTML ?? '';
      if (html === lastHtml.current) {
        return;
      }
      lastHtml.current = html;
      onContentChange(html);
    });
  }, [editor, onContentChange]);

  return null;
}

function TextInput({ initialValue, onContentChange }: Props) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <SharedHistoryContext>
        <div className="editor-container text-base-content prose prose-headings:m-0">
          <ToolbarContext>
            <ToolbarPlugin />
            <div className="editor-inner">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="editor-input"
                    dir="ltr"
                    aria-placeholder={'Type something...'}
                    placeholder={<div className="editor-placeholder">{'Type something...'}</div>}
                  />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <ListPlugin />
              <LinkPlugin />
              <InitialContentPlugin initialValue={initialValue} />
              <ContentChangePlugin onContentChange={onContentChange} />
            </div>
          </ToolbarContext>
        </div>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}

export default TextInput;
