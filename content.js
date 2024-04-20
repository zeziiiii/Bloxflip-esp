function highlightRandomBoxes(numBoxes) {
  const totalButtons = document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').length;
  const highlightedButtons = new Set();
  document.querySelectorAll('html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button').forEach(button => {
      button.classList.remove('highlighted-element');
  });
  const highlightedIndexes = [];
  while (highlightedButtons.size < numBoxes) {
      const randomIndex = Math.floor(Math.random() * totalButtons) + 1;
      const selector = `html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > button:nth-child(${randomIndex})`;
      const targetButton = document.querySelector(selector);
      if (targetButton && !highlightedButtons.has(randomIndex)) {
          targetButton.classList.add('highlighted-element');
          highlightedButtons.add(randomIndex);
          highlightedIndexes.push(randomIndex);
      }
  }
  return { status: 'success', highlightedIndexes: highlightedIndexes };
}

function highlightRandomTowers(numRows) {
  const highlightedIndexes = [];
  document.querySelectorAll('.highlighted-element').forEach(button => {
    button.classList.remove('highlighted-element');
  });
  for (let i = 8; i > 8 - numRows && i > 0; i--) {
    const row = i;
    const randomButtonIndex = Math.floor(Math.random() * 3) + 1;
    const selector = `html > body > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > div > div:nth-child(${row}) > div:nth-child(${randomButtonIndex}) > button`;
    const targetButton = document.querySelector(selector);

    if (targetButton) {
      targetButton.classList.add('highlighted-element');
      highlightedIndexes.push({ row: row, button: randomButtonIndex });
    }
  }

  return { status: 'success', highlightedIndexes: highlightedIndexes };
}






chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'highlight') {
    const response = highlightRandomBoxes(request.numBoxes);
    sendResponse(response);
  } else if (request.action === 'highlightTowers') {
    const response = highlightRandomTowers(request.numRows);
    sendResponse(response);
  }
});
