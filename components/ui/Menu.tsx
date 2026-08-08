// src/components/RowMenu.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiDotsVertical } from 'react-icons/hi';

type MenuOption = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
};

type RowMenuProps = {
  options: MenuOption[];
};

function getScrollParents(el: HTMLElement | null) {
  const result: HTMLElement[] = [];
  if (!el) return result;
  let p: HTMLElement | null = el.parentElement;
  while (p) {
    const { overflowY, overflow } = getComputedStyle(p);
    if (/(auto|scroll|overlay)/.test(overflowY) || /(auto|scroll|overlay)/.test(overflow)) {
      result.push(p);
    }
    p = p.parentElement;
  }
  return result;
}

const Menu: React.FC<RowMenuProps> = ({ options }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: -9999, left: -9999 });
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const closeMenu = () => setOpen(false);

  // Position the menu when opened
  useLayoutEffect(() => {
    if (!open || !btnRef.current || !menuRef.current) return;

    const btnRect = btnRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();

    let top = btnRect.bottom;
    let left = btnRect.right - menuRect.width;

    // Flip above if overflow
    if (top + menuRect.height > window.innerHeight) {
      top = Math.max(8, btnRect.top - menuRect.height);
    }
    if (left + menuRect.width > window.innerWidth) {
      left = window.innerWidth - menuRect.width - 8;
    }
    if (left < 8) left = 8;

    setCoords({ top, left });
  }, [open]);

  // Close on outside click, escape, resize, scroll
  useEffect(() => {
    if (!open) return;
    const anchorEl = btnRef.current;
    if (!anchorEl) return;

    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      const target = e.target as Node;
      if (!menuRef.current.contains(target) && !anchorEl.contains(target)) closeMenu();
    };
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMenu();
    const handleResize = () => closeMenu();
    const handleScroll = () => closeMenu();

    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    const scrollParents = getScrollParents(anchorEl);
    scrollParents.forEach((p) => p.addEventListener('scroll', handleScroll, { passive: true }));

    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
      scrollParents.forEach((p) => p.removeEventListener('scroll', handleScroll));
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        className="btn btn-ghost btn-sm w-fit"
        onClick={() => setOpen((prev) => !prev)}
      >
        <HiDotsVertical className="text-xl" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: 'fixed', top: coords.top, left: coords.left }}
            className="z-[9999] w-40 rounded-box shadow-md border border-base-content/10 bg-base-200 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((opt, idx) => (
              <button
                key={idx}
                className={`w-full btn btn-ghost justify-start ${
                  opt.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => {
                  if (!opt.disabled) {
                    opt.onClick();
                    closeMenu();
                  }
                }}
                disabled={opt.disabled}
              >
                {opt.text}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default Menu;
