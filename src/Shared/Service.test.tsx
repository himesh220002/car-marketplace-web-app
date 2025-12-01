import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios'; // Actual axios is mocked by vi.mock below

// Mock axios. This will be hoisted by Vitest.
vi.mock('axios');

// Import the module to be tested.
// import.meta.env should be stubbed by vitest.setup.ts before this runs.
import Service from './Service';

// Get the mocked version of axios
const mockedAxios = vi.mocked(axios, true);

// Define constants for expected values in tests
const testSendBirdApplicationId = 'test-app-id';
const testSendBirdApiToken = 'test-api-token';


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

    it('should log an error and return undefined if user check fails with an Error (e.g. 404)', async () => {
      const getError = new Error('User not found');
      // @ts-ignore
      getError.isAxiosError = true;
      // @ts-ignore
      getError.response = { status: 404, data: { message: 'User not found' } };
      mockedAxios.get.mockRejectedValue(getError);

      const result = await Service.CreateSendBirdUser(userId, nickName, profileUrl);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://api-${testSendBirdApplicationId}.sendbird.com/v3/users/${userId}`,
        { headers: { 'Content-Type': 'application/json', 'Api-Token': testSendBirdApiToken } }
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith("❌ Error checking user existence:", getError);
      expect(mockedAxios.post).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('SHOULD create user if GET rejects with non-Error (hypothetical fix in Service.tsx)', async () => {
        const getErrorNonStandard = { message: 'User not found, custom error object', response: { status: 404 } };
        mockedAxios.get.mockRejectedValue(getErrorNonStandard);

        const createdUserData = { user_id: userId, nickname: nickName, profile_url: profileUrl };
        mockedAxios.post.mockResolvedValue({ data: createdUserData, status: 200 });

        const result = await Service.CreateSendBirdUser(userId, nickName, profileUrl);

        expect(mockedAxios.post).toHaveBeenCalledWith(
            `https://api-${testSendBirdApplicationId}.sendbird.com/v3/users`,
            { user_id: userId, nickname: nickName, profile_url: profileUrl, issue_access_token: false },
            { headers: { 'Content-Type': 'application/json', 'Api-Token': testSendBirdApiToken } }
        );
        expect(result).toEqual({ data: createdUserData, status: 200 });
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });


    it('should return existing user data if user already exists (GET status 200)', async () => {
      const existingUserData = { user_id: userId, nickname: 'Existing User', profile_url: profileUrl };
      mockedAxios.get.mockResolvedValue({ data: existingUserData, status: 200 });

      const result = await Service.CreateSendBirdUser(userId, nickName, profileUrl);

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).not.toHaveBeenCalled();
      expect(result).toEqual(existingUserData);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('SHOULD handle error during user creation if POST fails (hypothetical fix in Service.tsx for GET)', async () => {
      const getErrorNonStandard = { message: 'User not found, custom error object', response: { status: 404 } };
      mockedAxios.get.mockRejectedValue(getErrorNonStandard);

      const postError = new Error('Failed to create user');
      mockedAxios.post.mockRejectedValue(postError);

      await expect(Service.CreateSendBirdUser(userId, nickName, profileUrl))
        .rejects.toThrow('Failed to create user');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should log error and return undefined for non-404 error during user existence check (instanceof Error)', async () => {
        const getError = new Error('Network Error');
        // @ts-ignore
        getError.isAxiosError = true;
        // @ts-ignore
        getError.response = { status: 500, data: { message: 'Internal Server Error' } };
        mockedAxios.get.mockRejectedValue(getError);

        const result = await Service.CreateSendBirdUser(userId, nickName, profileUrl);

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith("❌ Error checking user existence:", getError);
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
