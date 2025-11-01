export function movingAverage(arr: number[], window = 7): number[] {
  const res: number[] = [];
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= window) sum -= arr[i - window];
    res.push(i >= window - 1 ? sum / window : NaN);
  }
  return res;
}
