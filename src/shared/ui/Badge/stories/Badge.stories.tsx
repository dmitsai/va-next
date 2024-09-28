import { Meta, StoryObj } from "@storybook/react";
import { Badge } from "~/shared/ui/Badge";

const meta: Meta<typeof Badge> = {
    component: Badge,
    title: "Badge"
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const ExampleBadge: Story = {
    args: {
        placeholder: 'Moscow',
        className: 'bg-pink-dark'
    },
};



// export const Remotely = () => (
//     <div>
//         <Badge placeholder={"Remotely"} className={'bg-green-dark'} />
//     </div>
// )

// export const Paid = () => (
//     <div>
//         <Badge placeholder={"Paid"} />
//     </div>
// )