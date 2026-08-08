export const TableCustomStyles = {
  rows: {
    style: {
      backgroundColor: 'var(--color-base-200)',
    },
    stripedStyle: {
      backgroundColor: 'var(--color-base-100)',
    },
  },
  headCells: {
    style: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--color-base-content)',
    },
  },
  headRow: {
    style: {
      backgroundColor: 'var(--color-base-300)',
    },
  },
  cells: {
    style: {
      fontSize: '16px',
      fontWeight: '400',
      color: 'var(--color-base-content)',
      cursor: 'pointer',
    },
  },
  pagination: {
    style: {
      color: 'var(--color-base-content)',
      backgroundColor: 'var(--color-base-100)',
    },
    pageButtonsStyle: {
      color: 'var(--color-base-content)',
      fill: 'var(--color-base-content)',
      '&:disabled': {
        cursor: 'unset',
        color: 'var(--color-base-content)',
        fill: 'var(--color-base-content)',
        opacity: 0.5,
      },
    },
  },
  header: {
    style: {
      fontSize: '22px',
      color: 'var(--color-base-content)',
      backgroundColor: 'transparent',
      minHeight: '10px',
      paddingLeft: '16px',
      paddingRight: '8px',
    },
  },
};

export const AdminOrdersTableCustomStyles = {
  rows: {
    style: {
      backgroundColor: 'var(--color-base-200)',
    },
    stripedStyle: {
      backgroundColor: 'var(--color-base-300)',
    },
  },
  headCells: {
    style: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--color-base-content)',
    },
  },
  headRow: {
    style: {
      backgroundColor: 'var(--color-base-100)',
    },
  },
  cells: {
    style: {
      fontSize: '16px',
      fontWeight: '400',
      color: 'var(--color-base-content)',
      cursor: 'pointer',
      paddingLeft: '0px',
      paddingRight: '0px',
    },
  },
  pagination: {
    style: {
      color: 'var(--color-base-content)',
      backgroundColor: 'var(--color-base-100)',
    },
    pageButtonsStyle: {
      color: 'var(--color-base-content)',
      fill: 'var(--color-base-content)',
      '&:disabled': {
        cursor: 'unset',
        color: 'var(--color-base-content)',
        fill: 'var(--color-base-content)',
        opacity: 0.5,
      },
    },
  },
  header: {
    style: {
      fontSize: '22px',
      color: 'var(--color-base-content)',
      backgroundColor: 'transparent',
      minHeight: '10px',
      paddingLeft: '16px',
      paddingRight: '8px',
    },
  },
};
