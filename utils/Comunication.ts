import { browser } from 'wxt/browser';
import { RawCarData } from './parseCarData';
import { DefaultCarEntity } from './types';
const actions = {
  INJECT_CONTENT_SCRIPT: 'INJECT_CONTENT_SCRIPT',
  API_RESPONSE: 'API_RESPONSE',
  RAW_CAR_DATA: 'RAW_CAR_DATA',
  ERROR: 'ERROR',
} as const;

type Action = typeof actions[keyof typeof actions];

type CallbackType<T extends Action> = 
  T extends typeof actions.INJECT_CONTENT_SCRIPT ? () => void :
  T extends typeof actions.API_RESPONSE ? (carData: { brand: DefaultCarEntity, model: DefaultCarEntity, fuel: DefaultCarEntity, productionYear: DefaultCarEntity, engineCapacity?: DefaultCarEntity | null }) => void :
  T extends typeof actions.RAW_CAR_DATA ? (rawCarData: RawCarData) => void :
  T extends typeof actions.ERROR ? (error: string) => void :
  never;

export class Communication {
  private static instance: Communication;
  actions = actions;
  private browser = browser;
  private listeners: Record<Action, Function[]> = {
    [this.actions.INJECT_CONTENT_SCRIPT]: [],
    [this.actions.API_RESPONSE]: [],
    [this.actions.RAW_CAR_DATA]: [],
    [this.actions.ERROR]: [],
  };

  private constructor() {
    this.browser.runtime.onMessage.addListener((message) => {
      const action = message.action as Action;
      const callbacks = this.listeners[action];
      if (callbacks) {
        callbacks.forEach(callback => callback(message.params));
      }
    })
  }

  public static getInstance(): Communication {
    if (!Communication.instance) {
      Communication.instance = new Communication();
    }
    return Communication.instance;
  }

  public listen<T extends Action>(event: T, callback: CallbackType<T>) {
    this.listeners[event].push(callback);
  }

  public emit<T extends Action>(event: T, data?: Parameters<CallbackType<T>>[0]): void {
    this.browser.runtime.sendMessage({ action: event, params: data });
  }
}

export const communication = Communication.getInstance();
