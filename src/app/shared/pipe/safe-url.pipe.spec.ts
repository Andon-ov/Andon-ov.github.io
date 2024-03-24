// import { SafeUrlPipe } from './safe-url.pipe';
//
// describe('SafeUrlPipe', () => {
//   it('create an instance', () => {
//     const pipe = new SafeUrlPipe();
//     expect(pipe).toBeTruthy();
//   });
// });
import { SafeUrlPipe } from './safe-url.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafeUrlPipe', () => {
  let pipe: SafeUrlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    sanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    pipe = new SafeUrlPipe(sanitizer);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
