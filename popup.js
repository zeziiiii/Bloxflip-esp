document.addEventListener('DOMContentLoaded', function() {
  const numBoxesInput = document.getElementById('numBoxesInput');
  const highlightButton = document.getElementById('highlightButton');
  const messageContainer = document.getElementById('messageContainer');
  const gridContainer = document.getElementById('gridContainer');
  function updateElementsVisibility() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      if (currentTab.url === 'https://bloxflip.com/mines') {
        gridContainer.style.display = 'none';
        messageContainer.style.display = 'block';
        messageContainer.textContent = 'Mines';

      } else if (currentTab.url === 'https://bloxflip.com/towers') {
        gridContainer.style.display = 'none';
        messageContainer.style.display = 'block';
        messageContainer.textContent = 'Towers';
      } else {
        gridContainer.style.display = 'none';
        messageContainer.style.display = 'block';
        messageContainer.textContent = 'Go to either Mines or Towers tab it wont work if you click Predict';
      }
    });
  }

  updateElementsVisibility();
  highlightButton.addEventListener('click', function() {
    let numBoxes = numBoxesInput.value;
    numBoxes = parseInt(numBoxes);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      console.log("Active tab ID:", activeTab.id);
      if (activeTab.url === 'https://bloxflip.com/mines') {
        chrome.tabs.sendMessage(activeTab.id, { action: 'highlight', numBoxes: numBoxes }, function(response) {
          if (response && response.status === 'success') {
            console.log('Boxes highlighted successfully');
            updateGrid(response.highlightedIndexes);
          } else if (response) {
            console.error('Error:', response.message || 'Failed to highlight boxes');
          } else {
            console.error('Error: Response is undefined');
          }
        });
      } else if (activeTab.url === 'https://bloxflip.com/towers') {
        chrome.tabs.sendMessage(activeTab.id, { action: 'highlightTowers', numRows: numBoxes }, function(response) {
          if (response && response.status === 'success') {
            console.log('Towers highlighted successfully');
          } else if (response) {
            console.error('Error:', response.message || 'Failed to highlight towers');
          } else {
            console.error('Error: Response is undefined');
          }
        });
      } else {
        console.error('Error: Unsupported URL');
      }
    });
  });
});
