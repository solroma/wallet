import { SimpleDbEntityBase } from './SimpleDbEntityBase';
import type { WebTab } from '@onekeyhq/kit/src/views/Discover/Explorer/Context/contextWebTabs';

export type ISimpleDbEntityDiscoverWebTabs = {
  tabs: WebTab[];
};

export class SimpleDbEntityDiscoverWebTabs extends SimpleDbEntityBase<ISimpleDbEntityDiscoverWebTabs> {
  entityName = 'discoverWebTabs';
	override enableCache = true
}
