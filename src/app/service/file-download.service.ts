import {Injectable} from '@angular/core';
import {Response} from '@angular/http';

@Injectable()
export class FileDownloadService {

  constructor() {
  }

  handler(blob: Blob, filename?: string): void {

    const contentType = blob.type;
    const url = window.URL.createObjectURL(blob);

    if (contentType && (
        contentType.includes('image') ||
        contentType.includes('pdf'))) {
      window.open(url, '_blank');
    }
    else {
      const a: any = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.target = '_blank';
      a.download = filename || '';
      a.click();
      a.parentNode.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  }

}
