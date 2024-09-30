import { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
    component: Badge,
    title: "Badge"
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const ExampleBadge: Story = {
    args: {
        placeholder: 'Moscow',
        className: "bg-pink"
    },
};