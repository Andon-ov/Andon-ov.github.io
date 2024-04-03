import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * SafeUrlPipe is a custom Angular pipe used for sanitizing YouTube video URLs.
 * It transforms a regular YouTube video URL into a safe resource URL that can be embedded in an iframe.
 */
@Pipe({
  name: 'safeUrl',
})
export class SafeUrlPipe implements PipeTransform {
  /**
   * Initializes the pipe with the DomSanitizer service.
   * @param sanitizer DomSanitizer service for sanitizing URLs
   */
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Transforms a regular YouTube video URL into a safe resource URL.
   * @param url The YouTube video URL to be transformed
   * @returns A safe resource URL that can be embedded in an iframe
   */
  transform(url: string): SafeResourceUrl {
    let videoId: string;

    // Extract the video ID from the URL
    if (url.startsWith('https://m.')) {
      // Mobile URL format: https://m.youtube.com/watch?v=0bLGAsnHcx4
      const params = new URLSearchParams(url.split('?')[1]);
      videoId = params.get('v') || '';
    } else {
      // PC URL format: https://youtu.be/Przhgs-GJ2s
      const parts = url.split('/');
      videoId = parts[parts.length - 1];
    }

    // Construct the full URL for embedding the video
    const fullUrl = `https://www.youtube.com/embed/` + videoId;

    // Sanitize and return the full URL as a safe resource URL
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }
}
