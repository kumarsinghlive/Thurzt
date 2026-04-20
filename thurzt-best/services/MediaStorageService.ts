export interface MediaStorageService {
  uploadPublicPhoto(file: File | Blob | string): Promise<string>;
  uploadPrivatePhoto(file: File | Blob | string): Promise<string>;
  removePhoto(url: string): Promise<void>;
  pickImage(): Promise<string | null>;
  takePhoto(): Promise<string | null>;
}

class NativeMediaStorageServiceImpl implements MediaStorageService {
  async uploadPublicPhoto(file: File | Blob | string): Promise<string> {
    if (typeof file === 'string') return file;
    return URL.createObjectURL(file as Blob);
  }

  async uploadPrivatePhoto(file: File | Blob | string): Promise<string> {
    if (typeof file === 'string') return file;
    return URL.createObjectURL(file as Blob);
  }

  async removePhoto(url: string): Promise<void> {
    // console.log(`NativeMediaStorageService: Removed photo ${url}`);
  }

  async pickImage(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          resolve(URL.createObjectURL(file));
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  }

  async takePhoto(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          resolve(URL.createObjectURL(file));
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  }
}

export const mediaStorageService: MediaStorageService = new NativeMediaStorageServiceImpl();
