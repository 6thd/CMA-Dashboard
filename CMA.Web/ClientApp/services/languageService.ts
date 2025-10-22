// services/languageService.ts
const API_BASE_URL = '/api';

export const setLanguage = async (language: string): Promise<boolean> => {
  try {
    console.log('Sending language change request:', language);
    const response = await fetch(`${API_BASE_URL}/language/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Language change response:', await response.json());
    return true;
  } catch (error) {
    console.error('Failed to set language:', error);
    return false;
  }
};