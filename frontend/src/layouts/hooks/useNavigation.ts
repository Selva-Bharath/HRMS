import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  BellIcon,
} from "@heroicons/react/24/outline";

export const useNavigation = (user: any) => {
  const getNavigationItems = () => {
    if (user?.access_level === "admin") {
      return [
        { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
        { name: "HR Management", icon: UserGroupIcon, path: "/hrms" },
        { name: "Payroll", icon: BanknotesIcon, path: "/payroll" },
        { name: "Calendar", icon: CalendarIcon, path: "/calendar" },
        { name: "Reports", icon: ChartBarIcon, path: "/reports" },
        { name: "Announcements", icon: BellIcon, path: "/announcements" },
        {
          name: "Meeting Rooms",
          icon: BuildingOffice2Icon,
          path: "/meeting-rooms",
        },
        { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
      ];
    }

    if (user?.access_level === "manager") {
      return [
        { name: "Dashboard", icon: HomeIcon, path: "/manager-dashboard" },
        {
          name: "Employee Dashboard",
          icon: UserGroupIcon,
          path: "/employee-dashboard",
        },
        { name: "Calendar", icon: CalendarIcon, path: "/calendar" },
        { name: "Reports", icon: ChartBarIcon, path: "/reports" },
        { name: "Announcements", icon: BellIcon, path: "/announcements" },
      ];
    }

    if (user?.access_level === "hr") {
      return [
        { name: "HR Management", icon: UserGroupIcon, path: "/hrms" },
        { name: "Reports", icon: ChartBarIcon, path: "/reports" },
        { name: "Announcements", icon: BellIcon, path: "/announcements" },
        {
          name: "Meeting Rooms",
          icon: BuildingOffice2Icon,
          path: "/meeting-rooms",
        },
        { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
      ];
    }

    return [
      {
        name: "Dashboard",
        icon: HomeIcon,
        path: "/employee-dashboard",
      },
      { name: "Calendar", icon: CalendarIcon, path: "/calendar" },
      { name: "Announcements", icon: BellIcon, path: "/announcements" },
    ];
  };

  return {
    sidebarItems: getNavigationItems(),
  };
};