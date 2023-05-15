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
  ['frl']
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

  sut.clear('all')

  expect(sut.getQueue()).toMatchSnapshot();
})

test('Should have remove items in class queue after clear("class")', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'class');
  sut.track('baz', 's');

  sut.clear('class')

  expect(sut.getQueue()).toMatchSnapshot();
})

test('Should have remove items in class queue after clear("c")', () => {
  const sut = new QueueManager();
  sut.track('foo', 'full');
  sut.track('bar', 'class');
  sut.track('baz', 's');

  sut.clear('c')

  expect(sut.getQueue()).toMatchSnapshot();
})

test('Should replace entire queue on sync()', () => {
  const sut = new QueueManager();
  sut.track('foo', 'free');

  sut.sync([
    {command: 'bar', queue: 'class'},
    {command: 'baz', queue: 'paralysis'}
  ])

  expect(sut.getQueue()).toMatchSnapshot();
})