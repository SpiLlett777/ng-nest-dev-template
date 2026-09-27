import { ConfigService } from '@nestjs/config';
import { S3ObjectStorageService } from './s3-object-storage.service';

describe('S3ObjectStorageService', () => {
  const config = {
    OBJECT_STORAGE_ENDPOINT: 'http://localhost:9000',
    OBJECT_STORAGE_REGION: 'us-east-1',
    OBJECT_STORAGE_BUCKET: 'sportlink-dev',
    OBJECT_STORAGE_ACCESS_KEY: 'access-key',
    OBJECT_STORAGE_SECRET_KEY: 'secret-key',
    OBJECT_STORAGE_FORCE_PATH_STYLE: 'true',
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uploads an object to a path-style S3 endpoint', async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(null, { status: 200 }));
    const service = new S3ObjectStorageService(new ConfigService(config));

    await service.put({
      key: 'avatars/user-id/avatar name.png',
      body: Buffer.from('image'),
      contentType: 'image/png',
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      new URL(
        'http://localhost:9000/sportlink-dev/avatars/user-id/avatar%20name.png',
      ),
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'content-type': 'image/png',
          Authorization: expect.stringContaining('Credential=access-key/'),
        }),
      }),
    );
  });

  it('uses a virtual-hosted endpoint when path style is disabled', async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(Buffer.from('image'), { status: 200 }));
    const service = new S3ObjectStorageService(
      new ConfigService({
        ...config,
        OBJECT_STORAGE_ENDPOINT: 'https://example.r2.cloudflarestorage.com',
        OBJECT_STORAGE_REGION: 'auto',
        OBJECT_STORAGE_FORCE_PATH_STYLE: 'false',
      }),
    );

    await expect(service.get('avatars/default.png')).resolves.toEqual(
      Buffer.from('image'),
    );
    expect(fetchSpy).toHaveBeenCalledWith(
      new URL(
        'https://sportlink-dev.example.r2.cloudflarestorage.com/avatars/default.png',
      ),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('checks bucket availability without modifying objects', async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(null, { status: 200 }));
    const service = new S3ObjectStorageService(new ConfigService(config));

    await expect(service.checkAvailability()).resolves.toBeUndefined();
    expect(fetchSpy).toHaveBeenCalledWith(
      new URL('http://localhost:9000/sportlink-dev/'),
      expect.objectContaining({ method: 'HEAD' }),
    );
  });
});
