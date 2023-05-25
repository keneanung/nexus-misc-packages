import { sendCommand } from "./nexusApi";

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

interface CustomQueueComponent {
  letter: string;
  property: keyof QueuedItemProperties;
}

const itemPropertiesEqual = (one: QueuedItemProperties, other: QueuedItemProperties) => {
  const keys = Object.keys(one);
  if (keys.length !== Object.keys(other).length) {
    return false;
  }
  const castedKeys = keys as (keyof typeof one)[];
  return castedKeys.every((key) => one[key] === other[key]);
};

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

const defaultQueueTranslations: { [key: string]: string } = {
  equilibrium: 'e',
  balance: 'b',
  class: 'c',
  paralysis: '!p',
  unbound: '!w',
  stun: '!t',
  free: 'be!p!t',
  freestand: 'be!p!tu',
  full: 'be!p!tuc',
};

/**
 *  Tracks the content of the in-game queue and allows client side queueing to integrate with it while allowing other sources for queued items.
 */
export class QueueManager {

  private queue: QueuedItem[] = [];

  public track(command: string, queue: string) {
    const itemProperties = this.parseQueue(queue);
    this.queue.push({ command, properties: itemProperties });
  }

  private parseQueue(queue: string): QueuedItemProperties {
    queue = this.translateDefaultQueues(queue);
    const customProperties: QueuedItemProperties = this.translateQueueLettersToProperties(queue);
    return customProperties;
  }

  private translateDefaultQueues(queue: string) {
    return defaultQueueTranslations[queue] ?? queue;
  }

  private translateQueueLettersToProperties(queue: string) {
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

  public getQueue = () => this.queue;

  public clear = (queue: string) => {
    if (queue === 'all') {
      this.queue = [];
      return;
    }
    const queueProps = this.parseQueue(queue);
    for (let i = this.queue.length - 1; i >= 0; i--) {
      if (itemPropertiesEqual(queueProps, this.queue[i].properties)) {
        this.queue.splice(i, 1);
      }
    }
  };

  public trackFirst = (command: string, queue: string) => {
    const itemProperties = this.parseQueue(queue);
    this.queue.unshift({ command, properties: itemProperties });
  };

  public trackAt = (position: number, command: string, queue: string) => {
    const itemProperties = this.parseQueue(queue);
    this.queue.splice(position - 1, 0, { command, properties: itemProperties });
  };

  public trackReplace = (position: number, command: string, queue: string) => {
    const itemProperties = this.parseQueue(queue);
    this.queue.splice(position - 1, 1, { command, properties: itemProperties });
  };

  public trackRemove = (position: number) => {
    this.queue.splice(position - 1, 1);
  };

  public run = (command: string, queue: string) => {
    const itemProperties = this.parseQueue(queue);
    const found = this.removeRunCommand(command, itemProperties, true);
    if (!found) {
      this.removeRunCommand(command, itemProperties, false);
    }
  };

  // The exact parameter is a workaround for in-game bug #17807, where the queue name/type is not correctly reflected in the queue run message
  private removeRunCommand(command: string, itemProperties: QueuedItemProperties, exact: boolean) {
    let found = false;
    for (let i = 0; i < this.queue.length; i++) {
      const queuedItem = this.queue[i];
      if (
        queuedItem.command.toLowerCase() == command.toLowerCase() &&
        (!exact || itemPropertiesEqual(queuedItem.properties, itemProperties))
      ) {
        this.queue.splice(i, 1);
        found = true;
        break;
      }
    }
    return found;
  }

  public do = (command: string, properties: QueuedItemProperties) => {
    const queueLetters: string = this.translateItemProperties(properties)
    sendCommand(`queue add ${queueLetters} ${command}`)
  };

  private translateItemProperties = (properties: QueuedItemProperties) => {
    let queueLetters = "";
    for(const component of customQueueTypeComponents) {
      const propertyValue = properties[component.property]
      if ( propertyValue !== undefined) {
        queueLetters += (propertyValue ? '' : '!') + component.letter
      }
    }
    return queueLetters;
  }
}
