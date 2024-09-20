import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Container, Heading, StatusBadge, Table, Text } from "@medusajs/ui";
import ActionsMenu from "../../components/actions-menu";
import { StoreIcon } from "../../components/icons";
import { useVendors } from "../../hooks";

const Vendors = () => {
  const { data, loading } = useVendors();

  return (
    <Container className="flex flex-col p-0 overflow-hidden">
      <div className="p-6">
        <Heading className="txt-large-plus">Vendors</Heading>
      </div>
      {loading && <Text>Loading...</Text>}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Phone</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {data?.vendors && (
          <Table.Body>
            {data.vendors.map((vendor) => (
              <Table.Row key={vendor.id}>
                <Table.Cell>{vendor.name}</Table.Cell>
                <Table.Cell>
                  <StatusBadge color={vendor.is_open ? "green" : "red"}>
                    {vendor.is_open ? "Open" : "Closed"}
                  </StatusBadge>
                </Table.Cell>
                <Table.Cell>{vendor.phone}</Table.Cell>
                <Table.Cell>{vendor.email}</Table.Cell>
                <Table.Cell>
                  <ActionsMenu />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        )}
      </Table>
      <div className="p-6"></div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Vendors",
  icon: StoreIcon,
});

export default Vendors;
