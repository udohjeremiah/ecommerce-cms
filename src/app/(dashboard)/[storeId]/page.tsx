import type { Metadata } from "next";

import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  ActivityIcon,
  ArrowUpRightIcon,
  CalendarDaysIcon,
  DollarSignIcon,
  PackageIcon,
} from "lucide-react";

import Heading from "@/components/Heading";
import Overview from "@/components/Overview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { storeId: string };
}): Promise<Metadata> {
  const { userId } = auth();

  if (!userId) {
    return {};
  }

  const store = await prisma.store.findUnique({
    where: { id: params.storeId, userId },
  });

  return {
    title: `${store?.name} Store | E-Commerce CMS`,
    description: `Manage your online ${store?.name} store and its content, from product management and order processing to customization and more.`,
  };
}

interface DashboardPageProps {
  params: { storeId: string };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const store = await prisma.store.findFirst({
    where: { id: params.storeId, userId },
  });

  if (!store) {
    redirect("/");
  }

  const getTotalRevenue = async () => {
    const paidOrders = await prisma.order.findMany({
      where: { storeId: params.storeId, isPaid: true },
      include: { OrderItem: { include: { Product: true } } },
    });

    const totalRevenue = paidOrders.reduce((total, order) => {
      const orderTotal = order.OrderItem.reduce((orderSum, item) => {
        return orderSum + item.Product.price.toNumber();
      }, 0);

      return total + orderTotal;
    }, 0);

    return totalRevenue;
  };

  const getSalesCount = async () => {
    const salesCount = await prisma.order.count({
      where: { storeId: params.storeId, isPaid: true },
    });

    return salesCount;
  };

  const getStockCount = async () => {
    const stockCount = await prisma.product.count({
      where: { storeId: params.storeId, isArchived: false },
    });

    return stockCount;
  };

  const getGraphRevenue = async () => {
    const paidOrders = await prisma.order.findMany({
      where: { storeId: params.storeId, isPaid: true },
      include: { OrderItem: { include: { Product: true } } },
    });

    const monthlyRevenue: { [key: number]: number } = {};

    for (const order of paidOrders) {
      const month = order.createdAt.getMonth();
      let revenueForOrder = 0;

      for (const item of order.OrderItem) {
        revenueForOrder += item.Product.price.toNumber();
      }

      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }

    const graphData: {
      name: string;
      total: number;
    }[] = [
      { name: "Jan", total: 0 },
      { name: "Feb", total: 0 },
      { name: "Mar", total: 0 },
      { name: "Apr", total: 0 },
      { name: "May", total: 0 },
      { name: "Jun", total: 0 },
      { name: "Jul", total: 0 },
      { name: "Aug", total: 0 },
      { name: "Sep", total: 0 },
      { name: "Oct", total: 0 },
      { name: "Nov", total: 0 },
      { name: "Dec", total: 0 },
    ];

    for (const month in monthlyRevenue) {
      graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return graphData;
  };

  const getRecentTransactions = async () => {
    const orders = await prisma.order.findMany({
      where: { storeId: store.id, isPaid: true },
      include: {
        OrderItem: {
          include: { Product: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const formattedOrders = orders.map((order) => ({
      name: order.name,
      email: order.email,
      price: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(
        order.OrderItem.reduce(
          (total, orderItem) => total + Number(orderItem.Product.price),
          0,
        ),
      ),
      createdAt: format(order.createdAt, "MMMM do, yyyy"),
    }));

    return formattedOrders;
  };

  return (
    <main
      className={cn(
        "container flex flex-1 flex-col gap-4 py-4",
        "md:gap-8 md:py-8",
      )}
    >
      <Heading
        title="Dashboard"
        description={`Overview of your ${store.name} store`}
      />
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created At</CardTitle>
            <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(store.createdAt, "MMMM do, yyyy")}
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated on {format(store.updatedAt, "MMMM do, yyyy")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(await getTotalRevenue())}
            </div>
            <p className="text-xs text-muted-foreground">
              Since store creation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{await getSalesCount()}</div>
            <p className="text-xs text-muted-foreground">
              Since store creation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products in Stock
            </CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{await getStockCount()}</div>
            <p className="text-xs text-muted-foreground">
              Since store creation
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              {`Chart displaying the monthly transactions from your ${store.name} store.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={await getGraphRevenue()} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                {`Recent transactions from your ${store.name} store.`}
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href={`/${store.id}/orders`}>
                View All
                <ArrowUpRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(await getRecentTransactions()).map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{transaction.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {transaction.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {transaction.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
