
interface QueuedItem {
  command: string;
  properties: QueuedItemProperties;
}

interface QueuedItemProperties {
  haveBalance?: boolean;
  haveEq?: boolean;
  haveClassBalance?: boolean;
  haveShipBalance?: boolean;
  haveParalysis?: boolean;
  beBound?: boolean;
  beStanding?: boolean;
  beStunned?: boolean;
}

const itemPropertiesEqual = (one: QueuedItemProperties, other: QueuedItemProperties) => {
  const keys = Object.keys(one);
  if(keys.length !== Object.keys(other).length){
    return false
  }
  const castedKeys = Object.keys(one) as (keyof typeof one)[]
  return castedKeys.every((key) => one[key] === other[key]);
}

interface CustomQueueComponent {
  letter: string;
  property: keyof QueuedItemProperties;
}

const customQueueTypeComponents: CustomQueueComponent[] = [
  {
    letter: 'e',
    property: 'haveEq',
  },
  {
    letter: 'b',
    property: 'haveBalance',
  },
  {
    letter: 'c',
    property: 'haveClassBalance',
  },
  {
    letter: 's',
    property: 'haveShipBalance',
  },
  {
    letter: 'p',
    property: 'haveParalysis',
  },
  {
    letter: 'w',
    property: 'beBound',
  },
  {
    letter: 'u',
    property: 'beStanding',
  },
  {
    letter: 't',
    property: 'beStunned',
  },
];

interface Command {
  command: string;
  queue: string;
}

export class QueueManager {
  private queue: QueuedItem[] = [];

  public track(command: string, queue: string) {
    const itemProperties = this.parseQueue(queue);
    this.queue.push({ command, properties: itemProperties });
  }

  private parseQueue(queue: string): QueuedItemProperties {
    if (queue === 'equilibrium') {
      queue = 'e';
    }
    if (queue === 'balance') {
      queue = 'b';
    }
    if (queue === 'class') {
      queue = 'c';
    }
    if (queue === 'paralysis') {
      queue = '!p';
    }
    if (queue === 'unbound') {
      queue = '!w';
    }
    if (queue === 'stun') {
      queue = '!t';
    }
    if (queue === 'free') {
      queue = 'be!p!t';
    }
    if (queue === 'freestand') {
      queue = 'be!p!tu';
    }
    if (queue === 'full') {
      queue = 'be!p!tuc';
    }
    const customProperties: QueuedItemProperties = {};
    for (const queueType of customQueueTypeComponents) {
      const index = queue.indexOf(queueType.letter);
      if (index > -1) {
        const queueTypeValue = index === 0 || queue.at(index - 1) !== '!';
        customProperties[queueType.property] = queueTypeValue;
      }
    }
    return customProperties;
  }

  public getQueue = () => this.queue

  public sync = (newCommands: Command[]) => {
    this.clear('all');
    for (const {command, queue} of newCommands) {
      this.track(command, queue);
    }
  }

  public clear = (queue: string) => {
    if(queue === 'all'){
      this.queue = [];
      return;
    }
    const queueProps = this.parseQueue(queue);
    for (let i = this.queue.length - 1; i >= 0; i--) {
      if(itemPropertiesEqual(queueProps, this.queue[i].properties)){
        this.queue.splice(i,1);
      }
    }
  }
}

/*
CLEARQUEUE <queue>                      - Clear one of your queues.
CLEARQUEUE ALL                          - Clear everything out of your queues.
QUEUE LIST                              - List your current queue.
QUEUE ADD <queue> <command>
                                        - Add an item to the end of one of your
                                          queues.
QUEUE ADDCLEAR <queue> <command>
                                        - Clear the specified queue and add an
                                          item to the fresh queue.
QUEUE ADDCLEARFULL <queue> <command>
                                        - Clear the whole queue and add an item
                                          to the fresh queue.
QUEUE INSERT <queue> <index> <command>
                                        - Add an item to a specific point in one
                                          of your queues.
QUEUE PREPEND <queue> <command>
                                        - Add an item to the start of one of
                                          your queues.
QUEUE REPLACE <queue> <index> <command>
                                        - Replace an item in one of your queues.
QUEUE REMOVE <index>
                                        - Remove an item from a queue.
QUEUE CLEAR <queue>
                                        - Same as CLEARQUEUE
                                        */