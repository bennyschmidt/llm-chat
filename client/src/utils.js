const getRandomLeftPx = () => `${(Math.random() * window.innerWidth - 192) << 0 + 192}px`;
const getRandomTopPx = () => `${(Math.random() * window.innerHeight - 192) << 0 + 192}px`;

const getRandomXYStyle = () => ({
  left: getRandomLeftPx(),
  top: getRandomTopPx()
});

const getTimestampedText = text => (
  `${new Date().toLocaleString()}\n\n${text}\n\n`
);

export {
  getRandomLeftPx,
  getRandomTopPx,
  getRandomXYStyle,
  getTimestampedText
};
