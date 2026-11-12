const URL = 'https://stooq.com/q/d/l/?s=xlu.us&i=d';

for (let attempt = 1; attempt <= 2; attempt++) {
  const response = await fetch(URL);
  const text = await response.text();

  console.log(`attempt ${attempt}: status ${response.status}`);
  console.log(text.slice(0, 200));
  console.log('---');
}
