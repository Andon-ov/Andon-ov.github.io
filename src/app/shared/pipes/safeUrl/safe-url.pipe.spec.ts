// import { SafeUrlPipe } from './safe-url.pipes';
//
// describe('SafeUrlPipe', () => {
//   it('create an instance', () => {
//     const pipes = new SafeUrlPipe();
//     expect(pipes).toBeTruthy();
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
