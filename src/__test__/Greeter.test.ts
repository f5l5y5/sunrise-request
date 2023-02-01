import { Greeter } from '../index'

test('my greeter', () => {
  expect(Greeter('james')).toBe('hello james')
})
