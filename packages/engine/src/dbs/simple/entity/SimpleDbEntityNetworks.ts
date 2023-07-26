import { OnekeyNetworkUpdatedAt } from '@onekeyhq/shared/src/config/presetNetworks';
import type { IServerNetwork } from '@onekeyhq/shared/types';

import { SimpleDbEntityBase } from './SimpleDbEntityBase';

export type ISimpleDbEntityServerNetworksData = {
  networksMap: Record<string, IServerNetwork>;
  updateTimestampMap: Record<string, number>;
};

const defaultData = {
  networksMap: {},
  updateTimestampMap: {},
};

const getMapKey = (isTestnet?: boolean) => (isTestnet ? 'test' : 'prod');

export class SimpleDbEntityServerNetworks extends SimpleDbEntityBase<ISimpleDbEntityServerNetworksData> {
  entityName = 'serverNetworks';

  override enableCache = true;

  async getServerNetworks() {
    const data = await this.getData();
    if (!data) {
      return [];
    }
    return Object.values(data.networksMap);
  }

  async updateNetworks(networks: IServerNetwork[], isTestnet: boolean) {
    const data = await this.getData();
    this.setRawData({
      ...data,
      networksMap: {
        ...data.networksMap,
        ...networks.reduce((memo, next) => {
          memo[next.id] = next;
          return memo;
        }, {} as ISimpleDbEntityServerNetworksData['networksMap']),
      },
      updateTimestampMap: {
        ...(data.updateTimestampMap ?? {}),
        [getMapKey(isTestnet)]: Date.now(),
      },
    });
  }

  async getTimestamp({ isTestnet }: { isTestnet: boolean }) {
    const data = await this.getData();
    return (
      data.updateTimestampMap?.[getMapKey(isTestnet)] || OnekeyNetworkUpdatedAt
    );
  }

  async getData(): Promise<ISimpleDbEntityServerNetworksData> {
    return (await this.getRawData()) || defaultData;
  }

  async clear() {
    return this.setRawData(defaultData);
  }
}
