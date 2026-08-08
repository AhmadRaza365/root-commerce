type dateProps = {
  unformatedDate: string;
  format:
    | 'DD-MM-YYYY'
    | 'DD/MM/YYYY'
    | 'DD MMM YYYY'
    | 'YYYY-MM-DD'
    | 'YYYY-MM-DDTHH:mm'
    | 'DD-MM-YYYY HH:mm';
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = ({ unformatedDate, format = 'DD-MM-YYYY' }: dateProps) => {
  const date = new Date(unformatedDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  const hours24 = date.getHours();
  const hours = hours24.toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = (hours24 % 12 || 12).toString().padStart(2, '0');

  if (format === 'DD-MM-YYYY') {
    return `${day}-${month}-${year}`;
  } else if (format === 'DD/MM/YYYY') {
    return `${day}/${month}/${year}`;
  } else if (format === 'DD MMM YYYY') {
    return `${day} ${months[date.getMonth()]} ${year}`;
  } else if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  } else if (format === 'YYYY-MM-DDTHH:mm') {
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } else if (format === 'DD-MM-YYYY HH:mm') {
    return `${day}-${month}-${year} ${hours12}:${minutes} ${period}`;
  }

  return `${day}-${month}-${year}`;
};

const getTimeFromDate = (unformatedDate: string) => {
  const date = new Date(unformatedDate);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

export { formatDate, getTimeFromDate };
