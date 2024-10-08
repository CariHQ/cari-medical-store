import { ArrrowRight, EllipsisHorizontal, Trash } from "@medusajs/icons";
import { DropdownMenu, IconButton } from "@medusajs/ui";
import { DeliveryDTO } from "src/modules/delivery/types/common";

const DeliveryActionsMenu = ({ delivery }: { delivery: DeliveryDTO }) => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item className="gap-x-2">
          <ArrrowRight className="text-ui-fg-subtle" />
          View customer
        </DropdownMenu.Item>
        {delivery.driver_id && (
          <a href={`/app/drivers/${delivery.driver_id}`}>
            <DropdownMenu.Item className="gap-x-2">
              <ArrrowRight className="text-ui-fg-subtle" />
              View driver
            </DropdownMenu.Item>
          </a>
        )}
        {delivery.order?.id && (
          <a href={`/app/orders/${delivery.order?.id}`}>
            <DropdownMenu.Item className="gap-x-2">
              <ArrrowRight className="text-ui-fg-subtle" />
              View order
            </DropdownMenu.Item>
          </a>
        )}
        {delivery.vendor.id && (
          <a href={`/app/vendors/${delivery.vendor.id}`}>
            <DropdownMenu.Item className="gap-x-2">
              <ArrrowRight className="text-ui-fg-subtle" />
              View vendor
            </DropdownMenu.Item>
          </a>
        )}
        <DropdownMenu.Separator />
        <DropdownMenu.Item className="gap-x-2 text-ui-tag-red-text">
          <Trash className="text-ui-tag-red-icon" />
          Cancel order
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export default DeliveryActionsMenu;
