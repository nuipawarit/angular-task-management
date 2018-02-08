import { IsInPipe } from './is-in.pipe';

describe('IsInPipe', () => {
  it('create an instance', () => {
    const pipe = new IsInPipe();
    expect(pipe).toBeTruthy();
  });
});
