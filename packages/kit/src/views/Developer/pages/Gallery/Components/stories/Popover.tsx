/* eslint-disable react/no-unstable-nested-components */
import { useState } from 'react';

import {
  Button,
  Popover,
  SizableText,
  Stack,
  YStack,
  usePopoverContext,
} from '@onekeyhq/components';

import { Layout } from './utils/Layout';

const PopoverDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      title="Popover Demo"
      open={isOpen}
      onOpenChange={setIsOpen}
      renderTrigger={<Button onPress={() => setIsOpen(true)}>Open</Button>}
      renderContent={
        <Stack space="$4" p="$5">
          <SizableText>
            Non exercitation ea laborum cupidatat sunt amet aute exercitation
            occaecat minim incididunt non est est voluptate.
          </SizableText>
          <Button variant="primary" onPress={() => setIsOpen(false)}>
            Button
          </Button>
        </Stack>
      }
    />
  );
};

const Content = () => {
  const { closePopover } = usePopoverContext();
  return (
    <Stack space="$4" p="$5">
      <SizableText>
        Non exercitation ea laborum cupidatat sunt amet aute exercitation
        occaecat minim incididunt non est est voluptate.
      </SizableText>
      <Button variant="primary" onPress={closePopover}>
        Button
      </Button>
    </Stack>
  );
};

const PopoverGallery = () => (
  <Layout
    description=".."
    suggestions={['...']}
    boundaryConditions={['...']}
    elements={[
      {
        title: 'Controlled',
        element: <PopoverDemo />,
      },
      {
        title: 'Uncontrolled',
        element: () => (
          <Popover
            title="Popover Demo"
            renderTrigger={<Button>Uncontrolled Open</Button>}
            renderContent={({ closePopover }) => (
              <Stack space="$4" p="$5">
                <SizableText>
                  Non exercitation ea laborum cupidatat sunt amet aute
                  exercitation occaecat minim incididunt non est est voluptate.
                </SizableText>
                <Button variant="primary" onPress={closePopover}>
                  Button
                </Button>
              </Stack>
            )}
          />
        ),
      },
      {
        title: 'usePopoverContext',
        element: () => (
          <Popover
            title="Popover Demo"
            renderTrigger={<Button>Uncontrolled Open</Button>}
            renderContent={<Content />}
          />
        ),
      },
      {
        title: 'renderTrigger as function',
        element: () => (
          <Popover
            title="Popover Demo"
            renderTrigger={({ disabled, triggerRef, onPress }) => (
              <YStack>
                <Button>1</Button>
                <Button ref={triggerRef} onPress={onPress} disabled={disabled}>
                  2
                </Button>
              </YStack>
            )}
            renderContent={<Content />}
          />
        ),
      },
    ]}
  />
);

export default PopoverGallery;
