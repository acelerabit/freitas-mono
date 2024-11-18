import dayjs from 'dayjs';

interface Metric {
  id: string;
  name: string;
  createdAt: Date
}


export const groupByDate = (items: Metric[]) => {
  const groupedData = items.reduce((acc: any, item) => {
    const date = dayjs(item.createdAt).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += 1;
    return acc;
  }, {});

  return Object.keys(groupedData).map(date => ({
    date,
    count: groupedData[date],
  }));
};