import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  ElementNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  RangeSelection,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextNode,
  UNDO_COMMAND,
} from 'lexical';

import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import {
  LuAlignCenter,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuItalic,
  LuLink,
  LuList,
  LuRedo,
  LuStrikethrough,
  LuUnderline,
  LuUndo,
} from 'react-icons/lu';
import { GoListOrdered } from 'react-icons/go';
import { blockTypeToBlockName, rootTypeToRootName, useToolbarState } from './ToolbarContext';
import {
  $getSelectionStyleValueForProperty,
  $isAtNodeEnd,
  $setBlocksType,
} from '@lexical/selection';
import Dropdown from '../Dropdown';
import { $createHeadingNode, $isHeadingNode, HeadingTagType } from '@lexical/rich-text';

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

function BlockFormatDropDown({
  editor,
  blockType,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  return (
    <Dropdown
      label={blockTypeToBlockName[blockType]}
      onSelect={(option) => {
        if (option.value === 'paragraph') {
          editor.update(() => {
            const selection = $getSelection();
            $setBlocksType(selection, () => $createParagraphNode());
          });
        } else if (option.value === 'bullet') {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else if (option.value === 'number') {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        } else {
          editor.update(() => {
            const selection = $getSelection();
            $setBlocksType(selection, () => $createHeadingNode(option.value as HeadingTagType));
          });
        }
      }}
      options={Object.entries(blockTypeToBlockName).map(([key, value]) => ({
        label: value,
        value: key,
      }))}
      selectedOption={{
        label: blockTypeToBlockName[blockType],
        value: blockType,
      }}
      classNames={{
        button: 'btn-active btn-sm !m-0',
        container: 'min-w-[150px] max-w-[150px] flex-shrink-0',
      }}
    />
  );
}

export function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
  }
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { toolbarState, updateToolbarState } = useToolbarState();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        let element =
          anchorNode.getKey() === 'root'
            ? anchorNode
            : $findMatchingParent(anchorNode, (e) => {
                const parent = e.getParent();
                return parent !== null && $isRootOrShadowRoot(parent);
              });

        if (element === null) {
          element = anchorNode.getTopLevelElementOrThrow();
        }

        const elementKey = element.getKey();
        const elementDOM = editor.getElementByKey(elementKey);
        const isRTL =
          elementDOM?.dir === 'rtl' ||
          (typeof window !== 'undefined' &&
            elementDOM !== null &&
            window.getComputedStyle(elementDOM).direction === 'rtl');
        updateToolbarState('isRTL', Boolean(isRTL));

        if (elementDOM !== null) {
          if ($isListNode(element)) {
            const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
            const type = parentList ? parentList.getListType() : element.getListType();

            updateToolbarState('blockType', type as keyof typeof blockTypeToBlockName);
          } else {
            const type = $isHeadingNode(element) ? element.getTag() : element.getType();
            if (type in blockTypeToBlockName) {
              updateToolbarState('blockType', type as keyof typeof blockTypeToBlockName);
            }
          }
        }
        // Handle buttons
        updateToolbarState(
          'fontColor',
          $getSelectionStyleValueForProperty(selection, 'color', '#fff')
        );
        updateToolbarState(
          'bgColor',
          $getSelectionStyleValueForProperty(selection, 'background-color', '#fff')
        );
        updateToolbarState(
          'fontFamily',
          $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial')
        );
      }
      if ($isRangeSelection(selection)) {
        // Update text format
        updateToolbarState('isBold', selection.hasFormat('bold'));
        updateToolbarState('isItalic', selection.hasFormat('italic'));
        updateToolbarState('isUnderline', selection.hasFormat('underline'));
        updateToolbarState('isStrikethrough', selection.hasFormat('strikethrough'));
        updateToolbarState('isSubscript', selection.hasFormat('subscript'));
        updateToolbarState('isSuperscript', selection.hasFormat('superscript'));
        updateToolbarState('isHighlight', selection.hasFormat('highlight'));
        updateToolbarState('isCode', selection.hasFormat('code'));

        const node = selection.anchor.getNode();
        const parent = node.getParent();
        updateToolbarState('isLink', $isLinkNode(parent) || $isLinkNode(node));
        updateToolbarState(
          'fontSize',
          $getSelectionStyleValueForProperty(selection, 'font-size', '15px')
        );
        updateToolbarState('isLowercase', selection.hasFormat('lowercase'));
        updateToolbarState('isUppercase', selection.hasFormat('uppercase'));
        updateToolbarState('isCapitalize', selection.hasFormat('capitalize'));
      }
    });
  }, [editor, updateToolbarState]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updateToolbar();
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  return (
    <div className="toolbar gap-1 flex-wrap" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="btn btn-neutral btn-soft hover:text-base-100 btn-square btn-sm"
        aria-label="Undo"
        type="button"
      >
        <LuUndo size={16} />
      </button>
      <button
        type="button"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="btn btn-neutral hover:text-base-100 btn-soft btn-square btn-sm"
        aria-label="Redo"
      >
        <LuRedo size={16} />
      </button>
      <Divider />
      <BlockFormatDropDown
        editor={editor}
        blockType={toolbarState.blockType}
        rootType={toolbarState.rootType}
        disabled={false}
      />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={
          'btn btn-neutral hover:text-base-100 btn-soft btn-square btn-sm ' +
          (toolbarState.isBold ? 'btn-active' : '')
        }
        aria-label="Format Bold"
      >
        <LuBold size={16} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={
          'btn btn-neutral hover:text-base-100 btn-soft btn-square btn-sm ' +
          (toolbarState.isItalic ? 'btn-active' : '')
        }
        aria-label="Format Italics"
      >
        <LuItalic size={16} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={
          'btn btn-neutral hover:text-base-100 btn-soft btn-square btn-sm ' +
          (toolbarState.isUnderline ? 'btn-active' : '')
        }
        aria-label="Format Underline"
      >
        <LuUnderline size={16} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={
          'btn btn-neutral hover:text-base-100 btn-soft btn-square btn-sm ' +
          (toolbarState.isStrikethrough ? 'btn-active' : '')
        }
        aria-label="Format Strikethrough"
      >
        <LuStrikethrough size={16} />
      </button>
      <button
        type="button"
        onClick={() => {
          const url = toolbarState.isLink ? null : window.prompt('Enter URL', 'https://');
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }}
        className={
          'btn btn-neutral hover:text-base-100 btn-soft btn-square btn-sm ' +
          (toolbarState.isLink ? 'btn-active' : '')
        }
        aria-label="Insert Link"
      >
        <LuLink size={16} />
      </button>
      <Divider />
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
          }}
          className="btn btn-neutral hover:text-base-100 btn-soft btn-square btn-sm"
          aria-label="Left Align"
        >
          <LuAlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
          }}
          className="btn btn-neutral hover:text-base-100 btn-soft btn-square btn-sm"
          aria-label="Center Align"
        >
          <LuAlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
          }}
          className="btn btn-neutral hover:text-base-100 btn-soft btn-square btn-sm"
          aria-label="Right Align"
        >
          <LuAlignRight size={16} />
        </button>
      </div>
      <Divider />
      {/* unordered list and ordered list */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          }}
          className="btn btn-neutral hover:text-base-100 btn-soft btn-square btn-sm"
          aria-label="Insert Unordered List"
        >
          <LuList size={16} />
        </button>
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          }}
          className="btn btn-neutral hover:text-base-100 btn-soft btn-square btn-sm"
          aria-label="Insert Ordered List"
        >
          <GoListOrdered size={16} />
        </button>
      </div>
    </div>
  );
}
