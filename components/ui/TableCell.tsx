import Link from 'next/link';
import React from 'react';

type Props = {
  value: string | React.ReactNode;
  isLink?: boolean;
  link?: string;
};

function TableCell({ value, isLink, link }: Props) {
  const className = 'w-full h-full flex items-center justify-start px-4';

  if (isLink && link) {
    return (
      <Link href={link} className={className}>
        {value}
      </Link>
    );
  }
  return <div className={className}>{value}</div>;
}

export default TableCell;
