"use client";
import TableMain from "@/components/common/table/TableMain";
import { userData } from "@/lib/sampleTableData";
import { useAppSelector } from "@/store/hooks";
import { User, UserStatus } from "@/types/user";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import WoDialog from "@/components/woDialog/_components/WoDialog";

export default function EmployeePage() {
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const [allUsers] = useState<User[]>(userData);
  const [activeTab, setActiveTab] = useState<string>("all`");
  const [isNewWoDialogOpen, setIsNewWoDialogOpen] = useState(false);

  const userColumns: ColumnDef<User>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "department", header: "Department" },
      { accessorKey: "role", header: "Role" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status as UserStatus;
          let statusColor = "";
          switch (status) {
            case UserStatus.ON_DUTY:
              statusColor = "bg-arkBlue-500 text-arkBlue-50";
              break;
            case UserStatus.ON_LEAVE:
              statusColor = "bg-arkBg-500 text-arkBg-50";
              break;
            case UserStatus.OFF_DUTY:
              statusColor = "bg-arkRed-500 text-arkRed-50";
            case UserStatus.SUSPENDED:
              statusColor = "bg-arkYellow-500 text-arkYellow-50";
              break;
            default:
              statusColor = "bg-gray-500 text-gray-50";
          }
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const userData = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open Menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => alert(`View User ${userData.id}`)}
                >
                  View User
                </DropdownMenuItem>
                <DropdownMenuItem>Edit User</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  // Data yang difilter berdasarkan tab dan search query
  const filteredUsers = useMemo(() => {
    let currentUsers = allUsers;
    if (activeTab !== "all") {
      currentUsers = currentUsers.filter((u) => {
        if (activeTab === "on_duty") return u.status === UserStatus.ON_DUTY;
        if (activeTab === "on_leave") return u.status === UserStatus.ON_LEAVE;
        if (activeTab === "off_duty") return u.status === UserStatus.OFF_DUTY;
        if (activeTab === "suspended") return u.status === UserStatus.SUSPENDED;
        return true;
      });
    }
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentUsers = currentUsers.filter((u) =>
        Object.values(u).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
    return currentUsers;
  }, [allUsers, activeTab, searchQuery]);

  const userTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allUsers.length },
      {
        value: "on_duty",
        label: "On Duty",
        count: allUsers.filter((u) => u.status === UserStatus.ON_DUTY).length,
      },
      {
        value: "on_leave",
        label: "On Leave",
        count: allUsers.filter((u) => u.status === UserStatus.ON_LEAVE).length,
      },
      {
        value: "off_duty",
        label: "Off Duty",
        count: allUsers.filter((u) => u.status === UserStatus.OFF_DUTY).length,
      },
      {
        value: "suspended",
        label: "Suspended",
        count: allUsers.filter((u) => u.status === UserStatus.SUSPENDED).length,
      },
    ];
  }, [allUsers]);

  const handleDialogClose = () => {
    setIsNewWoDialogOpen(false);
  };

  return (
    <TableMain<User>
      searchQuery={searchQuery} // Menggunakan TablesArea dan memberikan tipe Invoice
      data={filteredUsers}
      columns={userColumns}
      tabItems={userTabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showAddButton={true}
      showDownloadPrintButtons={true}
      emptyMessage="No invoices found."
      isDialogOpen={isNewWoDialogOpen}
      onOpenChange={setIsNewWoDialogOpen}
      dialogContent={<WoDialog onClose={handleDialogClose} />}
      dialogTitle="Create New Work Order"
      dialogDescription="Fill in the details to create a new work order."
    />
  );
}
