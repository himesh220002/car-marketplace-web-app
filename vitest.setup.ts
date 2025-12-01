import '@testing-library/jest-dom';
// Removed vi and vi.stubGlobal for import.meta.env as it's now handled by `define` in vite.config.ts

// If you have other global setups for Vitest, they can remain here.
// For example, if you were mocking other globals or setting up other test utilities.

// const SendBirdApplicationId = 'test-app-id';  // No longer needed here
// const SendBirdApiToken = 'test-api-token';    // No longer needed here

// vi.stubGlobal('import', {
//   meta: {
//     env: {
//       VITE_SENDBIRD_APP_ID: SendBirdApplicationId,
//       VITE_SENDBIRD_API_TOKEN: SendBirdApiToken,
//     },
//   },
// });
