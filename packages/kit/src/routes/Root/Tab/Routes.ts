import type { TabDiscoveryParamList } from './Discovery/Routes';
import type { TabHomeParamList } from './Home/Routes';
import type { TabMeParamList } from './Me/Routes';
import type { TabSwapParamList } from './Swap/Routes';
import type { TabWebViewParamList } from './WebView/Routes';
import type { DemoDeveloperTabParamList } from '../../../views/Components/stories/NavigatorRoute/Tab/RouteParamTypes';

export enum TabRoutes {
  Home = 'Home',
  Me = 'Me',
  Developer = 'Developer',
  Discovery = 'Discovery',
  Swap = 'Swap',
  WebView = 'WebView',
}

export type TabStackParamList = {
  [TabRoutes.Home]: TabHomeParamList;
  [TabRoutes.Me]: TabMeParamList;
  [TabRoutes.Discovery]: TabDiscoveryParamList;
  [TabRoutes.Developer]: DemoDeveloperTabParamList;
  [TabRoutes.Swap]: TabSwapParamList;
  [TabRoutes.WebView]: TabWebViewParamList;
};
