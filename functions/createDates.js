const createDates = (rate) => {
  let count = 0;
  const date = new Date();
  const today = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );
  const dates = [
    {
      rate: rate,
      date: today,
    },
  ];
  for (let i = 0; i < 365; i++) {
    count += 1;
    dates.push({
      rate: rate,
      date: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + count
      ),
    });
  }
  return dates;
};

module.exports = { createDates };
