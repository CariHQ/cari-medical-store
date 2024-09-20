import { Table, Badge } from "@medusajs/ui";
import { DeliveryDTO } from "src/modules/delivery/types/common";
import { useVendors } from "../hooks";
import DeliveryActionsMenu from "./delivery-actions-menu";
import DeliveryItems from "./delivery-items";

const DeliveryRow = ({ delivery }: { delivery: DeliveryDTO }) => {
  const { data, loading } = useVendors({
    id: delivery.vendor.id,
  });

  if (loading) {
    return <Table.Row></Table.Row>;
  }

  const vendor = data?.vendors[0];

  return (
    <Table.Row>
      <Table.Cell>{delivery.id.slice(-4)}</Table.Cell>
      <Table.Cell>
        {new Date(delivery.created_at).toLocaleString(undefined, {
          hour: "numeric",
          minute: "numeric",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Table.Cell>
      <Table.Cell>
        <Badge color="purple" size="xsmall">
          {delivery.delivery_status}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        {!delivery.delivered_at ? "ETA " : ""}
        {new Date(delivery.delivered_at || delivery.eta).toLocaleTimeString(
          undefined,
          {
            hour: "numeric",
            minute: "numeric",
          }
        )}
      </Table.Cell>
      <Table.Cell>{vendor.name}</Table.Cell>
      <Table.Cell>
        <DeliveryItems delivery={delivery} />
      </Table.Cell>
      <Table.Cell>
        <DeliveryActionsMenu delivery={delivery} />
      </Table.Cell>
    </Table.Row>
  );
};

export default DeliveryRow;
