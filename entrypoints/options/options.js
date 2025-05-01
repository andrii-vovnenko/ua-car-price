const settingsForm = document.getElementById('settingsForm');
const successMessage = document.getElementById('successMessage');
const resetButton = document.getElementById('resetButton');
const userIdInput = document.getElementById('userId');
const apiKeyInput = document.getElementById('apiKey');

// Load saved settings when page opens
async function loadSettings() {
  const result = await browser.storage.local.get(['userId', 'apiKey']);
  if (result.userId && result.apiKey) {
    settingsForm.style.display = 'none';
    successMessage.style.display = 'block';
  }
}

// Save settings
settingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = userIdInput.value.trim();
  const apiKey = apiKeyInput.value.trim();
  await browser.storage.local.set({
    userId,
    apiKey
  });
  
  settingsForm.style.display = 'none';
  successMessage.style.display = 'block';
});

// Reset settings
resetButton.addEventListener('click', async () => {
  await browser.storage.local.remove(['userId', 'apiKey']);
  userIdInput.value = '';
  apiKeyInput.value = '';
  settingsForm.style.display = 'block';
  successMessage.style.display = 'none';
});

// Load settings when page opens
document.addEventListener('DOMContentLoaded', loadSettings); 