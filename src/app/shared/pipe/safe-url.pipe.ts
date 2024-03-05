import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    let videoId: string;
    
    if (url.startsWith('https://m.')) {
    // Mobile URL format: https://m.youtube.com/watch?v=0bLGAsnHcx4
    const params = new URLSearchParams(url.split('?')[1]);
    videoId = params.get('v') || '';
  } else {
    // PC URL format: https://youtu.be/Przhgs-GJ2s
    const parts = url.split('/');
    videoId = parts[parts.length - 1];
  }

    const fullUrl = `https://www.youtube.com/embed/` + videoId;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }
}
