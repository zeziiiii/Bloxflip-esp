document.addEventListener('DOMContentLoaded', function() {
  const numBoxesInput = document.getElementById('numBoxesInput');
  const highlightButton = document.getElementById('highlightButton');
  const loadingImage = document.getElementById('loadingImage');

  function updateElementsVisibility() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      if (currentTab.url === 'https://bloxflip.com/mines' || currentTab.url === 'https://bloxflip.com/towers') {
        highlightButton.style.display = 'block';
      } else {
        highlightButton.style.display = 'none';
      }
    });
  }

  function showLoading() {
    highlightButton.style.display = 'none';
    loadingImage.style.display = 'block';
    saveProgress({ isLoading: true });
    setTimeout(() => {
      loadingImage.style.display = 'none';
      highlightButton.style.display = 'block';
      highlightBoxes();
    }, Math.random() * 2000 + 1500);
  }

  function highlightBoxes() {
    let numBoxes = numBoxesInput.value;
    numBoxes = parseInt(numBoxes);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      if (activeTab.url === 'https://bloxflip.com/mines') {
        chrome.tabs.sendMessage(activeTab.id, { action: 'highlight', numBoxes: numBoxes }, function(response) {
          if (response && response.status === 'success') {
            console.log('Boxes highlighted successfully');
            saveProgress(response.highlightedIndexes);
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
            saveProgress(response.highlightedIndexes);
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
  }

  function saveProgress(data) {
    chrome.storage.local.set({ 'highlightedIndexes': data }, function() {
      console.log('Progress saved:', data);
    });
  }

  function checkLoadingStatus() {
    chrome.storage.local.get(['isLoading'], function(data) {
      if (data.isLoading) {
        loadingImage.style.display = 'block';
        highlightButton.style.display = 'none';
        highlightBoxes();
      }
    });
  }

  updateElementsVisibility();
  checkLoadingStatus();

  highlightButton.addEventListener('click', function() {
    showLoading();
  });
});
