/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios'; // Actual axios is mocked by vi.mock below

// Mock axios. This will be hoisted by Vitest.
vi.mock('axios');

// Import the module to be tested.
// import.meta.env should be stubbed by vitest.setup.ts before this runs.
import Service from './Service';

// Get the mocked version of axios
const mockedAxios = vi.mocked(axios, true);

// Define constants for expected values in tests (allow using real env values when present)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testSendBirdApplicationId = ((import.meta as any).env?.VITE_SENDBIRD_APP_ID) ?? 'test-app-id';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testSendBirdApiToken = ((import.meta as any).env?.VITE_SENDBIRD_API_TOKEN) ?? 'test-api-token';


describe('Service', () => {
  describe('CreateSendBirdUser', () => {
    const userId = 'test-user-123';
    const nickName = 'Test User';
    const profileUrl = 'http://example.com/profile.jpg';

    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      mockedAxios.get.mockReset();
      mockedAxios.post.mockReset();
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should return check_failed for non-404 errors when checking user existence', async () => {
      const getError = new Error('Network Error');
      // @ts-ignore
      getError.isAxiosError = true;
      // @ts-ignore
      getError.response = { status: 500, data: { message: 'Internal Server Error' } };
      mockedAxios.get.mockRejectedValue(getError);

      const result = await Service.CreateSendBirdUser(userId, nickName, profileUrl);

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      // Service returns an error object for unexpected check failures
      expect(result).toEqual({ error: 'check_failed', details: getError.message });
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error checking SendBird user existence:', getError?.message ?? getError);
    });

    it('SHOULD create user if GET rejects with non-Error (hypothetical fix in Service.tsx)', async () => {
        const getErrorNonStandard = { message: 'User not found, custom error object', response: { status: 404 } };
        mockedAxios.get.mockRejectedValue(getErrorNonStandard);

  const createdUserData = { user_id: userId, nickname: nickName, profile_url: profileUrl };
  // Simulate token endpoint not supporting this app (reject first token attempt), then succeed on create
  const tokenErr = new Error('Not Found');
  // @ts-ignore
  tokenErr.isAxiosError = true;
  // @ts-ignore
  tokenErr.response = { status: 404 };
  mockedAxios.post.mockRejectedValueOnce(tokenErr);
  mockedAxios.post.mockResolvedValueOnce({ data: createdUserData, status: 200 });

        const result = await Service.CreateSendBirdUser(userId, nickName, profileUrl);

    // Implementation may attempt token issuance first; assert that a POST happened and the result was returned
    expect(mockedAxios.post).toHaveBeenCalled();
  // Service returns the created user under `user` and may include normalized token fields
  expect((result as unknown as Record<string, unknown>).user).toEqual(createdUserData as unknown);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });


    it('should return existing user data if user already exists (GET status 200)', async () => {
      const existingUserData = { user_id: userId, nickname: 'Existing User', profile_url: profileUrl };
      mockedAxios.get.mockResolvedValue({ data: existingUserData, status: 200 });

      const result = await Service.CreateSendBirdUser(userId, nickName, profileUrl);

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      // token issuance is attempted first; ensure we don't assume no POSTs
      expect(mockedAxios.post).toHaveBeenCalled();
      // Service returns user under `user` when token issuance isn't available
      expect(result).toEqual({ user: existingUserData });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should return a session token when token endpoint responds with token (fast path)', async () => {
      // token endpoint resolves
      const tokenResp = { token: 'sess-xyz', expires_at: 0 };
      mockedAxios.post.mockResolvedValueOnce({ data: tokenResp, status: 200 });

      const result = await Service.CreateSendBirdUser(userId, nickName, profileUrl);

      expect(mockedAxios.post).toHaveBeenCalled();
      // Service normalizes token into access_token field
  expect((result as unknown as Record<string, string>).access_token).toBe('sess-xyz');
  expect((result as unknown as Record<string, string>).token).toBe('sess-xyz');
    });

    it('should fall back to create user with issue_access_token:true when token issuance not available and user missing', async () => {
      // token endpoint returns 400 (session tokens disabled)
      const tokenErr = new Error('Bad Request');
      // @ts-ignore
      tokenErr.isAxiosError = true;
      // @ts-ignore
      tokenErr.response = { status: 400, data: { message: 'Bad Request' } };
      mockedAxios.post.mockRejectedValueOnce(tokenErr);

      // GET returns 404 (user not found)
      const getErr = new Error('Not Found');
      // @ts-ignore
      getErr.isAxiosError = true;
      // @ts-ignore
      getErr.response = { status: 404 };
      mockedAxios.get.mockRejectedValueOnce(getErr);

      // Create returns legacy access_token
      const created = { user_id: userId, access_token: 'legacy-abc' };
      mockedAxios.post.mockResolvedValueOnce({ data: created, status: 200 });

      const result = await Service.CreateSendBirdUser(userId, nickName, profileUrl);

      // The final create call should have been made and returned token normalized
  expect((result as unknown as Record<string, string>).access_token).toBe('legacy-abc');
  expect((result as unknown as Record<string, string>).token).toBe('legacy-abc');
    });

    it('SHOULD handle error during user creation if POST fails (create returns error object)', async () => {
      const getErrorNonStandard = { message: 'User not found, custom error object', response: { status: 404 } };
      mockedAxios.get.mockRejectedValue(getErrorNonStandard);

      const postError = new Error('Failed to create user');
      mockedAxios.post.mockRejectedValue(postError);

      const result = await Service.CreateSendBirdUser(userId, nickName, profileUrl);
      // Service catches create error and returns structured object
      expect(result).toEqual({ error: 'create_failed', details: postError.message });
      // The service logs the create error via console.error
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error creating SendBird user:', postError.message);
    });

    it('should return check_failed object for non-404 errors during user existence check (instanceof Error)', async () => {
        const getError = new Error('Network Error');
        // @ts-ignore
        getError.isAxiosError = true;
        // @ts-ignore
        getError.response = { status: 500, data: { message: 'Internal Server Error' } };
        mockedAxios.get.mockRejectedValue(getError);

        const result = await Service.CreateSendBirdUser(userId, nickName, profileUrl);

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ error: 'check_failed', details: getError.message });
        expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error checking SendBird user existence:', getError?.message ?? getError);
      });
  });

  describe('CreateSendBirdChannel', () => {
    const users = ['user1', 'user2'];
    const title = 'Test Channel';

    beforeEach(() => {
      mockedAxios.post.mockReset();
    });

    it('should create a new channel successfully', async () => {
      const channelData = { channel_url: 'sendbird_group_channel_123', name: title, members: users.map(u => ({ user_id: u})) };
      mockedAxios.post.mockResolvedValue({ data: channelData, status: 200 });

      const result = await Service.CreateSendBirdChannel(users, title);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `https://api-${testSendBirdApplicationId}.sendbird.com/v3/group_channels`,
        { user_ids: users, is_distinct: true, name: title },
        { headers: { 'Content-Type': 'application/json', 'Api-Token': testSendBirdApiToken } }
      );
      expect(result).toEqual({ data: channelData, status: 200 });
    });

    it('should handle error during channel creation', async () => {
      const postError = new Error('Failed to create channel');
      mockedAxios.post.mockRejectedValue(postError);

      await expect(Service.CreateSendBirdChannel(users, title))
        .rejects.toThrow('Failed to create channel');
    });
  });

  describe('FormatResult', () => {
    it('should return an empty array for an empty input array', () => {
      expect(Service.FormatResult([])).toEqual([]);
    });

    it('should process a single car listing with no images', () => {
      const input = [{ carListing: { id: 1, make: 'Toyota', model: 'Camry' } }];
      const expected = [{ id: 1, make: 'Toyota', model: 'Camry', images: [] }];
      expect(Service.FormatResult(input)).toEqual(expected);
    });

    it('should process a single car listing with one image', () => {
      const input = [
        { carListing: { id: 1, make: 'Honda', model: 'Civic' }, carImages: { url: 'image1.jpg' } },
      ];
      const expected = [{ id: 1, make: 'Honda', model: 'Civic', images: [{ url: 'image1.jpg' }] }];
      expect(Service.FormatResult(input)).toEqual(expected);
    });

    it('should process a single car listing with multiple images', () => {
      const input = [
        { carListing: { id: 1, make: 'Ford', model: 'Focus' }, carImages: { url: 'image1.jpg' } },
        { carListing: { id: 1, make: 'Ford', model: 'Focus' }, carImages: { url: 'image2.png' } },
      ];
      const expected = [{ id: 1, make: 'Ford', model: 'Focus', images: [{ url: 'image1.jpg' }, { url: 'image2.png' }] }];
      expect(Service.FormatResult(input)).toEqual(expected);
    });

    it('should process multiple car listings with varied images', () => {
      const input = [
        { carListing: { id: 1, make: 'Tesla', model: 'Model S' }, carImages: { url: 'tesla1.jpg' } },
        { carListing: { id: 2, make: 'BMW', model: 'X5' } }, // No images for BMW
        { carListing: { id: 1, make: 'Tesla', model: 'Model S' }, carImages: { url: 'tesla2.jpg' } },
        { carListing: { id: 3, make: 'Audi', model: 'A4' }, carImages: { url: 'audi1.jpg' } },
        { carListing: { id: 3, make: 'Audi', model: 'A4' }, carImages: { url: 'audi2.jpg' } },
        { carListing: { id: 3, make: 'Audi', model: 'A4' }, carImages: { url: 'audi3.jpg' } },
      ];
      const expected = [
        { id: 1, make: 'Tesla', model: 'Model S', images: [{ url: 'tesla1.jpg' }, { url: 'tesla2.jpg' }] },
        { id: 2, make: 'BMW', model: 'X5', images: [] },
        { id: 3, make: 'Audi', model: 'A4', images: [{ url: 'audi1.jpg' }, { url: 'audi2.jpg' }, { url: 'audi3.jpg' }] },
      ];
      // The order of listings in the output depends on Object.values() behavior for numeric keys, which usually sorts.
      // To ensure stable comparison, sort both actual and expected results by ID.
      const result = Service.FormatResult(input).sort((a, b) => (a.id as number) - (b.id as number));
      expect(result).toEqual(expected.sort((a,b) => (a.id as number) - (b.id as number)));
    });

    it('should skip items with missing carListing or id', () => {
      const input = [
  // @ts-ignore testing invalid input
        { carImages: { url: 'image_only.jpg' } },
  // @ts-ignore testing invalid input
        { carListing: { make: 'Subaru', model: 'Outback' } },
        { carListing: { id: 1, make: 'Mazda', model: 'CX-5' }, carImages: { url: 'mazda1.jpg' } },
      ];
      const expected = [{ id: 1, make: 'Mazda', model: 'CX-5', images: [{ url: 'mazda1.jpg' }] }];
      expect(Service.FormatResult(input)).toEqual(expected);
    });

    it('should handle items with null or undefined carImages', () => {
      const input = [
        { carListing: { id: 1, make: 'Nissan', model: 'Rogue' }, carImages: { url: 'nissan1.jpg' } },
        { carListing: { id: 1, make: 'Nissan', model: 'Rogue' }, carImages: null },
  // @ts-ignore testing potentially undefined property
        { carListing: { id: 1, make: 'Nissan', model: 'Rogue' }, carImages: undefined },
        { carListing: { id: 2, make: 'Kia', model: 'Sportage' } , carImages: null},
      ];
      const expected = [
        { id: 1, make: 'Nissan', model: 'Rogue', images: [{ url: 'nissan1.jpg' }] },
        { id: 2, make: 'Kia', model: 'Sportage', images: [] },
      ];
      const result = Service.FormatResult(input).sort((a,b) => (a.id as number) - (b.id as number));
      expect(result).toEqual(expected.sort((a,b) => (a.id as number) - (b.id as number)));
    });
  });
});
