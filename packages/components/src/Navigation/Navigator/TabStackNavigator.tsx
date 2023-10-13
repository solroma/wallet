import { useCallback, useMemo } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import platformEnv from '@onekeyhq/shared/src/platformEnv';

import useIsVerticalLayout from '../../Provider/hooks/useIsVerticalLayout';
import { useThemeValue } from '../../Provider/hooks/useThemeValue';
import { makeTabScreenOptions } from '../GlobalScreenOptions';
import { createStackNavigator } from '../StackNavigator';
import NavigationBar from '../Tab/TabBar';
import { tabRouteWrapper } from '../Tab/tabRouteWrapper';

import type { ICON_NAMES } from '../../Icon';
import type { CommonNavigatorConfig } from './types';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs/src/types';
import type { ParamListBase } from '@react-navigation/routers';

export interface TabSubNavigatorConfig<
  RouteName extends string,
  P extends ParamListBase = ParamListBase,
> extends CommonNavigatorConfig<RouteName, P> {
  translationId: string;
}

export interface TabNavigatorConfig<RouteName extends string> {
  name: RouteName;
  tabBarIcon: (focused?: boolean) => ICON_NAMES;
  translationId: string;
  children: TabSubNavigatorConfig<any, any>[];
  disable?: boolean;
}

export interface TabNavigatorProps<RouteName extends string> {
  config: TabNavigatorConfig<RouteName>[];
}

const Stack = createStackNavigator();

function TabSubStackNavigator({
  screens,
}: {
  screens: TabSubNavigatorConfig<string, any>[];
}) {
  const [bgColor, titleColor] = useThemeValue(['bg', 'text']);

  return (
    <Stack.Navigator>
      {screens.map(({ name, component, translationId }) => (
        <Stack.Screen
          key={name}
          name={name}
          component={tabRouteWrapper(component)}
          options={({ navigation }: { navigation: any }) => ({
            // TODO i18n
            title: translationId,
            ...makeTabScreenOptions({ navigation, bgColor, titleColor }),
          })}
        />
      ))}
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export function TabStackNavigator<RouteName extends string>({
  config,
}: TabNavigatorProps<RouteName>) {
  const isVerticalLayout = useIsVerticalLayout();

  const tabBarCallback = useCallback(
    (props: BottomTabBarProps) => <NavigationBar {...props} />,
    [],
  );

  const tabComponents = useMemo(
    () =>
      config
        .filter(({ disable }) => !disable)
        .map(({ name, translationId, tabBarIcon, children }) => ({
          name,
          tabBarLabel: translationId,
          tabBarIcon,
          // eslint-disable-next-line react/no-unstable-nested-components
          children: () => <TabSubStackNavigator screens={children} />,
        })),
    [config],
  );

  return (
    <Tab.Navigator
      tabBar={tabBarCallback}
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
        // Native Load all tabs at once
        // Web Lazy load
        lazy: !platformEnv.isNative,
      }}
    >
      {tabComponents.map(({ name, children, ...options }) => (
        <Tab.Screen
          key={name}
          name={name}
          options={{
            ...options,
            // @ts-expect-error BottomTabBar V7
            tabBarPosition: isVerticalLayout ? 'bottom' : 'left',
          }}
        >
          {children}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}