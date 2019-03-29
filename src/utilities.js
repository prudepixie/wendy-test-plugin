export const until = conditionFunction => {
  const poll = resolve => {
    if (conditionFunction()) resolve();
    else setTimeout(() => poll(resolve), 10);
  };

  return new Promise(poll);
};

export const isEmpty = obj => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return JSON.stringify(obj) === JSON.stringify({});
};
