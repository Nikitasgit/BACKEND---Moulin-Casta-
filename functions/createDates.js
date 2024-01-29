const createDates = (rate) => {
  let count = 0;
  const date = new Date();
  const today = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
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
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate() + count
        )
      ),
    });
  }
  return dates;
};
module.exports = { createDates };
