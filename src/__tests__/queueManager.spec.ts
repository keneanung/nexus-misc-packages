import { QueueManager } from '../queueManager';

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

test('Should replace entire queue on sync()', () => {
  const sut = new QueueManager();
  sut.track('foo', 'free');

  sut.sync([
    { command: 'bar', queue: 'class' },
    { command: 'baz', queue: 'paralysis' },
  ]);

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

test('Should clear given queue with trackAddClear', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'full');
  sut.track('baz', 'full');
  sut.track('bam', 'free');
  sut.track('boom', 'free');

  sut.trackAddClear('bamboozle', 'full');

  expect(sut.getQueue()).toMatchSnapshot();
});

test('Should clear all queues queue with trackAddClear and full argument', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'full');
  sut.track('baz', 'full');
  sut.track('bam', 'free');
  sut.track('boom', 'free');

  sut.trackAddClear('bamboozle', 'full', true);

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
