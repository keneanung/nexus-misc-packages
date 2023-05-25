import { QueueManager } from '../queueManager';
import { sendCommand } from '../nexusApi';

jest.mock('../nexusApi')
const sendCommandMock = jest.mocked(sendCommand);

// Reset handlers so that each test could alter them
// without affecting other, unrelated tests.
afterEach(() => {
  sendCommandMock.mockReset();
});

test.each([
  ['e'],
  ['b'],
  ['c'],
  ['s'],
  ['p'],
  ['w'],
  ['u'],
  ['t'],
  ['!e'],
  ['!b'],
  ['!c'],
  ['!s'],
  ['!p'],
  ['!w'],
  ['!u'],
  ['!t'],
  ['equilibrium'],
  ['balance'],
  ['class'],
  ['paralysis'],
  ['unbound'],
  ['stun'],
  ['free'],
  ['freestand'],
  ['full'],
  ['frl'],
])('Should translate property %p correctly', (queue: string) => {
  const sut = new QueueManager();

  sut.track('foo', queue);

  expect(sut.getQueue()).toMatchSnapshot();
});

test('Should have an empty queue after clear("all")', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'class');
  sut.track('baz', 's');

  sut.clear('all');

  expect(sut.getQueue()).toMatchSnapshot();
});

test('Should have remove items in class queue after clear("class")', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'class');
  sut.track('baz', 's');

  sut.clear('class');

  expect(sut.getQueue()).toMatchSnapshot();
});

test('Should have remove items in class queue after clear("c")', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'class');
  sut.track('baz', 's');

  sut.clear('c');

  expect(sut.getQueue()).toMatchSnapshot();
});

test('Should put prepended items first in queue', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'class');
  sut.track('baz', 's');

  sut.trackFirst('bamboozle', 'freestand');

  expect(sut.getQueue()).toMatchSnapshot();
});

test('Should put items at given position in queue with trackAt', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'class');
  sut.track('baz', 's');

  sut.trackAt(3, 'bamboozle', 'freestand');

  expect(sut.getQueue()).toMatchSnapshot();
});

test('Should replace items at given position in queue with trackReplace', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'class');
  sut.track('baz', 's');

  sut.trackReplace(2, 'bamboozle', 'freestand');

  expect(sut.getQueue()).toMatchSnapshot();
});

test('Should remove items at given position in queue with trackRemove', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'class');
  sut.track('baz', 's');

  sut.trackRemove(2);

  expect(sut.getQueue()).toMatchSnapshot();
});

test('Should remove run command from queue', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'full');
  sut.track('baz', 'full');
  sut.track('foo', 'free');
  sut.track('boom', 'free');

  sut.run('foo', 'full');

  expect(sut.getQueue()).toMatchSnapshot();
});

test('Should remove run command from queue with different casing', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'full');
  sut.track('baz', 'full');
  sut.track('foo', 'free');
  sut.track('boom', 'free');

  sut.run('FOO', 'full');

  expect(sut.getQueue()).toMatchSnapshot();
});

test('Should remove run command from queue (not first item)', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'full');
  sut.track('baz', 'full');
  sut.track('foo', 'free');
  sut.track('boom', 'free');

  sut.run('foo', 'free');

  expect(sut.getQueue()).toMatchSnapshot();
});

test('Workaround for in-game bug #17807', () => {
  const sut = new QueueManager();
  sut.track('sit', 'full');
  sut.track('stand', 'full');
  sut.track('sit', 'eu');

  sut.run('sit', 'eu');
  sut.run('stand', 'eu');
  sut.run('sit', 'eu');

  expect(sut.getQueue()).toMatchSnapshot();
});

test('Should queue command to in-game queue when added locally and queue not full', () => {
  const sut = new QueueManager();

  sut.do('stand', {
    haveBalance: true,
    haveEq: true,
    haveParalysis: false,
    beStunned: false,
    beBound: false,
  });

  expect(sendCommandMock).toMatchSnapshot();
});
