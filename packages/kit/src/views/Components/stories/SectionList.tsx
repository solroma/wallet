import { useRef } from 'react';

import type { ISectionListRef } from '@onekeyhq/components';
import {
  Button,
  ListItem,
  SectionList,
  Stack,
  Text,
  XStack,
} from '@onekeyhq/components';
import { SectionFooter } from '@onekeyhq/components/src/SectionList/SectionFooter';
import { SectionHeader } from '@onekeyhq/components/src/SectionList/SectionHeader';

import { Layout } from './utils/Layout';

const sectionListData = [
  {
    title: 'Tokens',
    data: [
      {
        src: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/btc.png',
        title: 'BTC',
        subtitle: '30.00 BTC',
        price: '$902,617.17',
        change: '+4.32%',
      },
      {
        src: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eth.png',
        title: 'Ethereum',
        subtitle: '2.35 ETH',
        price: '$3,836.97',
        change: '+4.32%',
      },
      {
        src: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/matic.png',
        title: 'Polygon',
        subtitle: '2.35 Matic',
        price: '$10421.23',
        change: '-4.32%',
      },
    ],
  },
  {
    title: 'NFTs',
    data: [
      {
        src: 'https://images.glow.app/https%3A%2F%2Farweave.net%2F0WFtaZrc_DUzL2Tt_zztq-9cfJoSDhDacSfrPT50HOo%3Fext%3Dpng?ixlib=js-3.8.0&w=80&h=80&dpr=2&fit=crop&s=7af3b8e6a74c4abc0ab9de93ca67d1c4',
        title: 'Critter Ywin',
        subtitle: 'Hyperspace · 6/27/23, 7:19 AM',
        price: '$3,836.97',
        change: '+4.32%',
      },
      {
        src: 'https://images.glow.app/https%3A%2F%2Farweave.net%2FhRZG2ePVGpBSogaNSdp4Jm3vUILhvB-h3gB7-nRrPsE%3Fext%3Dpng?ixlib=js-3.8.0&w=80&h=80&dpr=2&fit=crop&s=cbd0b1bc0ab5d8b867930546c5e87358',
        title: 'Critter Yore',
        subtitle: 'Magic Eden · 5/23/23, 6:40 PM',
        price: '$10421.23',
        change: '-4.32%',
      },
      {
        src: 'https://images.glow.app/https%3A%2F%2Farweave.net%2F99eb109nC2JgMA5GHpW0GK8TdidO8lm5eDj0FgzfWdA%3Fext%3Dpng?ixlib=js-3.8.0&w=80&h=80&dpr=2&fit=crop&s=2ff9b1faad864bf338d0b881051f6c16',
        title: 'Critter Osar',
        subtitle: 'Magic Eden · 5/22/23, 1:33 PM',
        price: '$10421.23',
        change: '-4.32%',
      },
    ],
  },
];

const SectionListDemo = () => {
  const ref = useRef<ISectionListRef | null>(null);
  return (
    <SectionList
      h="$96"
      ListHeaderComponentStyle={{
        w: '100%',
        bg: 'blue',
      }}
      ref={ref}
      sections={sectionListData}
      renderSectionHeader={({ section: { title } }) => (
        <SectionHeader
          title={title}
          headerRight={
            <Button
              iconAfter="ChevronRightOutline"
              size="small"
              variant="tertiary"
            >
              View All
            </Button>
          }
        />
      )}
      ListHeaderComponent={XStack}
      renderSectionFooter={() => (
        <SectionFooter>
          Nostrud enim sit cupidatat deserunt duis aliquip elit est labore anim
          ullamco consequat minim consectetur.
        </SectionFooter>
      )}
      renderItem={({ item }) => (
        <ListItem
          avatarProps={{
            src: item.src,
          }}
          title={item.title}
          subtitle={item.subtitle}
          onPress={() => {
            const sectionList = ref.current;
            sectionList?.scrollToLocation({
              sectionIndex: 1,
              itemIndex: 0,
              animated: true,
            });
          }}
        />
        // <XStack>
        //   <Text>{item}</Text>
        //   <Divider />
        //   <XStack space="$8">
        //     <Button
        //       onPress={() => {
        //         const sectionList = ref.current;
        //         sectionList?.scrollToLocation({
        //           sectionIndex: 1,
        //           itemIndex: 0,
        //           animated: true,
        //         });
        //       }}
        //     >
        //       Scroll to `SIDES` section
        //     </Button>
        //   </XStack>
        // </XStack>
      )}
    />
  );
};

const SectionListGallery = () => (
  <Layout
    description=".."
    suggestions={['...']}
    boundaryConditions={['...']}
    scrollEnabled={false}
    elements={[
      {
        title: 'Styled SectionList',
        element: <SectionListDemo />,
      },
    ]}
  />
);

export default SectionListGallery;
